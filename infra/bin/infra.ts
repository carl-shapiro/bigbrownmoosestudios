#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib/core';
import { PersonalSiteStack } from '../lib/personal-site-stack';

const app = new cdk.App();

const apexDomain = app.node.tryGetContext('apexDomain') as string | undefined;
const additionalDomainNames = app.node.tryGetContext('additionalDomainNames') as
  | string[]
  | undefined;
const hostedZoneId = app.node.tryGetContext('hostedZoneId') as string | undefined;
const githubRepo = app.node.tryGetContext('githubRepo') as string | undefined;
if (!apexDomain || !hostedZoneId || !githubRepo) {
  throw new Error(
    'apexDomain, hostedZoneId, and githubRepo must be set in cdk.json context.',
  );
}

// CloudFront requires its ACM certificate to live in us-east-1, and the
// bucket/distribution/OIDC role are all region-agnostic besides that
// constraint, so the whole stack is pinned here rather than following the
// deployer's default CLI region.
new PersonalSiteStack(app, 'PersonalSiteStack', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: 'us-east-1' },
  apexDomain,
  additionalDomainNames,
  hostedZoneId,
  githubRepo,
});
