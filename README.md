# bigbrownmoosestudios.com

Personal site — a landing page hub for code, music, and hobby projects, plus
professional info. Static Next.js site on S3 + CloudFront, provisioned with
AWS CDK, deployed by GitHub Actions.

## Structure

- `site/` — Next.js app (static export). Content lives in `site/content/*.json`.
- `infra/` — AWS CDK app (`PersonalSiteStack`): private S3 bucket, CloudFront
  distribution, GitHub OIDC deploy role.
- `.github/workflows/deploy-site.yml` — builds `site/` and syncs it to S3 on
  every push to `main`.

## Local development

```sh
cd site
npm install
npm run dev      # http://localhost:3000
npm run build    # static export to site/out/
```

Edit the placeholder content in `site/content/*.json` (marked `TODO`), and
drop real images into `site/public/images/<collection-slug>/` and your
resume into `site/public/resume.pdf`.

## First-time infra setup (manual — not automatable from here)

`bigbrownmoosestudios.com`'s nameservers now point at Route 53, so the stack
fully automates the ACM certificate (DNS-validated) and the DNS records
(apex + `www` aliased to CloudFront) — no manual cert request or DNS wiring
needed.

1. **Fill in `infra/cdk.json` context:**
   - `hostedZoneId` — the Route 53 hosted zone ID for `bigbrownmoosestudios.com`
     (Route 53 console → Hosted zones → the zone → "Hosted zone ID").
   - `githubRepo` — your actual `owner/repo` slug (scopes the GitHub Actions
     IAM trust policy).
   - `apexDomain` / `additionalDomainNames` are already set.

2. **Deploy the infra stack locally** (this first deploy can't go through
   GitHub Actions — the deploy role doesn't exist until after it runs):

   ```sh
   cd infra
   npm install
   npx cdk bootstrap   # first CDK use in this account/region only
   npx cdk diff        # review before deploying
   npx cdk deploy
   ```

   This creates the cert, validates it via Route 53 DNS records, and creates
   the alias records — all in one deploy. Note the four `CfnOutput` values
   printed at the end: `SiteBucketName`, `DistributionId`,
   `DistributionDomainName`, `GithubActionsDeployRoleArn`.

3. **Add GitHub repo secrets** (Settings → Secrets and variables → Actions):
   `AWS_DEPLOY_ROLE_ARN`, `SITE_BUCKET_NAME`, `DISTRIBUTION_ID` — from the
   outputs above.

4. **Push to `main`.** The `deploy-site.yml` workflow builds and syncs the
   site, then invalidates the CloudFront cache.

5. **Verify** at `https://bigbrownmoosestudios.com` (DNS + cert are live
   after step 2 completes — propagation is usually fast but can take a few
   minutes) or immediately at `https://<DistributionDomainName>`.

Infra changes after this first deploy stay a local `npx cdk deploy` —
there's no CI workflow for infra, deliberately: infra changes are rare, and
the deploy role's OIDC trust doesn't exist until after the first manual
deploy anyway.
