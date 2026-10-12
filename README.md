# Yamify.ai standby homepage

Static, independently hosted recovery copy of the public `www.yamify.co` homepage.

## Purpose

- Keeps a branded public page available if the primary GCP-hosted site is unavailable.
- Uses `yamify.ai` as the custom domain.
- Keeps `www.yamify.co` as the canonical marketing URL and is marked `noindex` to avoid duplicate-content indexing.

## Refresh procedure

The sync workflow can refresh the snapshot on demand and commits only when the
public homepage changed. A failed or unreachable primary site never overwrites
the last known-good standby. Its hourly schedule is temporarily disabled while
the GitHub organization Actions account is locked for billing, preventing a
repeating failed-run notification. Restore the hourly cron after GitHub unlocks
the account.

For an operator refresh:

1. Run `node scripts/sync-homepage.mjs`.
2. Verify `index.html` contains the current headline, canonical URL, and
   `noindex,nofollow` directive.
3. Commit and push to `main`; GitHub Pages deploys from the repository root.
4. Verify `https://yamify.ai/` and `https://www.yamify.ai/` over TLS on desktop
   and mobile.

## Rollback

In GoDaddy DNS, restore the previous parked-domain A records and remove the GitHub Pages CNAME record. The production `yamify.co` DNS is never changed by this standby.
