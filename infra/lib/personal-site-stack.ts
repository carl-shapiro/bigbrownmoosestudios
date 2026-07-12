import * as cdk from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as targets from 'aws-cdk-lib/aws-route53-targets';

export interface PersonalSiteStackProps extends cdk.StackProps {
  /** "owner/repo" — scopes the GitHub Actions OIDC trust policy. */
  readonly githubRepo: string;
  /** Branch allowed to assume the deploy role. Defaults to "main". */
  readonly githubBranch?: string;
  /** Apex domain — must match the Route53 hosted zone's name exactly. */
  readonly apexDomain: string;
  /** Additional domain names to serve, e.g. ["www.example.com"]. */
  readonly additionalDomainNames?: string[];
  /**
   * ID of the Route53 hosted zone for apexDomain (already created — NS
   * records were migrated there manually, outside CDK). Used to
   * DNS-validate the ACM certificate and to create the alias records
   * pointing at CloudFront, both fully automated by this stack.
   */
  readonly hostedZoneId: string;
  /**
   * Set to false if a GitHub OIDC provider already exists in this AWS
   * account (an account can only have one per provider URL) and import it
   * instead of creating a new one.
   */
  readonly createGithubOidcProvider?: boolean;
}

const DIRECTORY_INDEX_REWRITE = `
function handler(event) {
  var request = event.request;
  var uri = request.uri;
  if (uri.endsWith('/')) {
    request.uri += 'index.html';
  } else if (!uri.includes('.')) {
    request.uri += '/index.html';
  }
  return request;
}
`;

export class PersonalSiteStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: PersonalSiteStackProps) {
    super(scope, id, props);

    const branch = props.githubBranch ?? 'main';
    const domainNames = [props.apexDomain, ...(props.additionalDomainNames ?? [])];

    // Private origin bucket. Content is synced exclusively by GitHub
    // Actions (`aws s3 sync`) — no BucketDeployment construct here, so
    // frequent content deploys stay decoupled from rare infra deploys.
    const siteBucket = new s3.Bucket(this, 'SiteBucket', {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      enforceSSL: true,
      // Content is fully reproducible from the repo — no reason to retain
      // the bucket (or fail stack deletion) on teardown.
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // Imported by fixed attributes (not fromLookup) so this stack stays
    // synthesizable without live AWS credentials/context. The zone itself
    // was created outside CDK when the domain's nameservers were migrated.
    const hostedZone = route53.HostedZone.fromHostedZoneAttributes(this, 'Zone', {
      hostedZoneId: props.hostedZoneId,
      zoneName: props.apexDomain,
    });

    // Now that Route53 owns the zone, CDK can create and DNS-validate the
    // certificate itself — no more manual request/validation step.
    const certificate = new acm.Certificate(this, 'Certificate', {
      domainName: props.apexDomain,
      subjectAlternativeNames: props.additionalDomainNames,
      validation: acm.CertificateValidation.fromDns(hostedZone),
    });

    // defaultRootObject only resolves "/", not subpaths. With
    // trailingSlash: true the Next.js export writes e.g. about/index.html,
    // so requests for "/about/" (or "/about") need rewriting to
    // "/about/index.html" or the private S3 origin 403s.
    const directoryIndexFunction = new cloudfront.Function(
      this,
      'DirectoryIndexFunction',
      {
        code: cloudfront.FunctionCode.fromInline(DIRECTORY_INDEX_REWRITE),
      },
    );

    const distribution = new cloudfront.Distribution(this, 'SiteDistribution', {
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(siteBucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        functionAssociations: [
          {
            function: directoryIndexFunction,
            eventType: cloudfront.FunctionEventType.VIEWER_REQUEST,
          },
        ],
      },
      domainNames,
      certificate,
      defaultRootObject: 'index.html',
      priceClass: cloudfront.PriceClass.PRICE_CLASS_100,
      errorResponses: [
        // S3-via-OAC returns 403, not 404, for missing keys (it denies
        // anonymous listing rather than reporting "not found").
        { httpStatus: 403, responseHttpStatus: 404, responsePagePath: '/404.html' },
        { httpStatus: 404, responseHttpStatus: 404, responsePagePath: '/404.html' },
      ],
    });

    // Alias records (not CNAME — GoDaddy's apex-CNAME limitation was the
    // reason Route53 was needed in the first place) for every configured
    // domain, pointing at the distribution. A + AAAA since the
    // distribution has IPv6 enabled.
    const aliasTarget = route53.RecordTarget.fromAlias(
      new targets.CloudFrontTarget(distribution),
    );
    for (const domain of domainNames) {
      // recordName must be relative to the zone root (or omitted for the
      // apex) — passing the full FQDN here would double the zone suffix.
      const apexSuffix = `.${props.apexDomain}`;
      const recordName =
        domain === props.apexDomain
          ? undefined
          : domain.endsWith(apexSuffix)
            ? domain.slice(0, -apexSuffix.length)
            : domain;
      const idSuffix = domain === props.apexDomain ? 'Apex' : domain.split('.')[0];
      new route53.ARecord(this, `${idSuffix}ARecord`, {
        zone: hostedZone,
        recordName,
        target: aliasTarget,
      });
      new route53.AaaaRecord(this, `${idSuffix}AaaaRecord`, {
        zone: hostedZone,
        recordName,
        target: aliasTarget,
      });
    }

    const oidcProvider = props.createGithubOidcProvider === false
      ? iam.OpenIdConnectProvider.fromOpenIdConnectProviderArn(
          this,
          'GithubOidcProvider',
          `arn:aws:iam::${this.account}:oidc-provider/token.actions.githubusercontent.com`,
        )
      : new iam.OpenIdConnectProvider(this, 'GithubOidcProvider', {
          url: 'https://token.actions.githubusercontent.com',
          clientIds: ['sts.amazonaws.com'],
        });

    // Trust restricted to this repo + branch via the `sub` claim, so only
    // workflow runs on `main` in this exact repo can assume the role.
    const deployRole = new iam.Role(this, 'GithubActionsDeployRole', {
      assumedBy: new iam.FederatedPrincipal(
        oidcProvider.openIdConnectProviderArn,
        {
          StringEquals: {
            'token.actions.githubusercontent.com:aud': 'sts.amazonaws.com',
          },
          StringLike: {
            'token.actions.githubusercontent.com:sub': `repo:${props.githubRepo}:ref:refs/heads/${branch}`,
          },
        },
        'sts:AssumeRoleWithWebIdentity',
      ),
      description:
        'Assumed by GitHub Actions to sync site content to S3 and invalidate CloudFront. Deliberately scoped to nothing broader.',
    });

    // Least-privilege, explicit rather than via grant*() helpers, to match
    // exactly what `aws s3 sync --delete` + `cloudfront create-invalidation`
    // need and nothing else — this role should never be able to touch infra.
    deployRole.addToPolicy(
      new iam.PolicyStatement({
        actions: ['s3:ListBucket'],
        resources: [siteBucket.bucketArn],
      }),
    );
    deployRole.addToPolicy(
      new iam.PolicyStatement({
        actions: ['s3:GetObject', 's3:PutObject', 's3:DeleteObject'],
        resources: [siteBucket.arnForObjects('*')],
      }),
    );
    deployRole.addToPolicy(
      new iam.PolicyStatement({
        actions: ['cloudfront:CreateInvalidation'],
        resources: [
          `arn:aws:cloudfront::${this.account}:distribution/${distribution.distributionId}`,
        ],
      }),
    );

    new cdk.CfnOutput(this, 'SiteBucketName', { value: siteBucket.bucketName });
    new cdk.CfnOutput(this, 'DistributionId', { value: distribution.distributionId });
    new cdk.CfnOutput(this, 'DistributionDomainName', {
      value: distribution.distributionDomainName,
    });
    new cdk.CfnOutput(this, 'GithubActionsDeployRoleArn', {
      value: deployRole.roleArn,
    });
  }
}
