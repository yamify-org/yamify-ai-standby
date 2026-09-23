# Yamify.ai standby homepage

Static, independently hosted recovery copy of the public `www.yamify.co` homepage.

## Purpose

- Keeps a branded public page available if the primary GCP-hosted site is unavailable.
- Uses `yamify.ai` as the custom domain.
- Keeps `www.yamify.co` as the canonical marketing URL and is marked `noindex` to avoid duplicate-content indexing.

## Refresh procedure

1. Mirror the current public homepage and same-origin assets.
2. Keep the local Yamify logo path and `.nojekyll` file intact.
3. Verify all local `src` and `href` references exist.
4. Commit and push to `main`; GitHub Pages deploys from the repository root.
5. Verify `https://yamify.ai/` and `https://www.yamify.ai/` over TLS on desktop and mobile.

## Rollback

In GoDaddy DNS, restore the previous parked-domain A records and remove the GitHub Pages CNAME record. The production `yamify.co` DNS is never changed by this standby.
