# Yamify.ai canonical handoff

Static GitHub Pages handoff from `yamify.ai` to the current public experience at `www.yamify.co`.

## Purpose

- Keeps TLS and a branded fallback link active on `yamify.ai`.
- Sends visitors to the current homepage instead of maintaining a second copy that can drift.
- Keeps `www.yamify.co` as the single canonical marketing URL and marks the handoff `noindex`.

## Release procedure

1. Keep `CNAME` and `.nojekyll` intact.
2. Commit and push to `main`; GitHub Pages deploys from the repository root.
3. Verify `https://yamify.ai/` and `https://www.yamify.ai/` over TLS and confirm both land on `https://www.yamify.co/`.

## Rollback

Revert the handoff commit to restore the previous static standby page. DNS does not need to change, and the production `yamify.co` DNS remains untouched.
