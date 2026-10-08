# Implementation Plan: Eliminate Duplicate Google Tasks Insertion (v5.4.1)

Single-source Google Tasks creation exclusively through `saveFactToSheet()`, preventing multiple duplicate tasks from being created when a fun fact is generated.

## Proposed Changes

### 1. Google Apps Script Backend (`backend/Code.gs`)
- Modify `postToGoogleKeep(factText, category)`:
  - Remove redundant `postToGoogleTasks()` call.
  - Keep email draft/formatting responsibility only.
- In `dailyMidnightTrigger()`:
  - Remove duplicate tasks creation flow: `uniqueFact` will get pushed to Tasks once inside `saveFactToSheet(uniqueFact)`.
  - Maintain `syncMissingFactsToGoogleTasks()` as catch-up only, which checks for `GTASK-` prefix and avoids re-posting already synced facts.
- Review `saveFactToSheet()`:
  - Ensure Column H is immediately populated with `GTASK-` prefix upon successful insertion, guaranteeing idempotency.

### 2. Version Bump & Changelog
- Bump version to `5.4.1` in `package.json`.
- Add `v5.4.1` entry in `CHANGELOG.md` following the strict $\le$ 10 words per bullet rule.

### 3. Deploy via Clasp & Sync Web App URL
- Push with `clasp push`.
- Deploy version 34 with `clasp deploy`.
- Sync new Web App URL across `app.js`, `daily_automation.js`, and `.github/workflows/daily_automation.yml`.

### 4. Verification & Git Commit
- Run automated node syntax checks and unit tests.
- Audit `CHANGELOG.md` for word count limit ($\le 10$ words).
- Commit and push to GitHub.
