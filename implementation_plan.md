# Implementation Plan: Fix Anonymous Web App Access, GitHub Persistence & Trigger Live Fun Fact (v5.6.0)

## Root Cause Analysis (Empirically Verified via Live GitHub Actions & Google Apps Script Logs)
1. **Google Apps Script Web App Blocked Anonymous Access (`HTTP 401` / Sign-In Redirect)**:
   - `backend/appsscript.json` had `"access": "ANYONE"`, which in Google Apps Script's manifest schema means **"Anyone with a Google Account"** (requiring an interactive Google Sign-in session).
   - Consequently, unauthenticated requests from GitHub Actions (`daily_automation.js`) and the Web Dashboard (`app.js`) received an HTML redirect to `accounts.google.com/v3/signin/` on `GET` and `HTTP 401 Unauthorized` on `POST`.
   - Changing `"access"` to `"ANYONE_ANONYMOUS"` in `backend/appsscript.json` and redeploying via `clasp push` + `clasp deploy` allows external REST `GET`/`POST` calls without requiring interactive browser login cookies.
2. **`daily_automation.js` Silently Swallowed Web App Save Failures**:
   - When the Web App `POST` returned `HTTP 401`, `daily_automation.js` logged a warning (`⚠️ Web App POST returned HTTP 401 (non-JSON response)`) and exited with code `0` (green checkmark in GitHub Actions), masking the failure to save to Google Sheets and Google Tasks.
   - Additionally, `maxOutputTokens: 300` in `generationConfig` caused thinking models (`gemini-3.8-flash` / `gemini-3.5-flash`) to exhaust token budget during internal reasoning (`content.parts` undefined or truncated JSON). Increasing `maxOutputTokens` to `1024` and safely extracting the text part prevents empty/truncated candidates.
3. **`daily_automation.yml` Never Committed `data/facts.json` Back to GitHub**:
   - `daily_automation.js` wrote new facts to `data/facts.json` on the ephemeral GitHub Actions Ubuntu runner, which was discarded when the job ended because `.github/workflows/daily_automation.yml` lacked a `git commit` & `git push` step.
   - Also, `daily_automation.yml` only ran at `0 0 * * *` (5:00 PM PDT, subject to GitHub's heavy top-of-hour queue congestion). Adding a Midnight Pacific schedule (`5 7 * * *`) and `permissions: contents: write` + auto-commit step ensures `data/facts.json` stays synced in the repository.

## Proposed Changes
1. **`backend/appsscript.json` & `backend/Code.gs`**:
   - Set `"access": "ANYONE_ANONYMOUS"` in `backend/appsscript.json`.
   - Increase `maxOutputTokens` to `1024` and safely extract text parts in `backend/Code.gs`.
   - Push and deploy a new Web App version via `npx @google/clasp push --force` and `npx @google/clasp deploy`.
2. **`scripts/daily_automation.js` & `app.js`**:
   - Update `DEFAULT_WEB_APP_URL` / `API_BASE_URL` with the new deployment URL.
   - Increase `maxOutputTokens` to `1024` and safely guard `resData.candidates[0].content.parts`.
   - Make `daily_automation.js` throw a hard error if the Web App `POST` fails (`!saveJson.success`), so GitHub Actions never reports a false-positive green status.
   - Sync `data/facts.json` with all live facts from the Google Sheet.
3. **`.github/workflows/daily_automation.yml`**:
   - Update `WEB_APP_URL` to the new deployment URL.
   - Add `permissions: contents: write` and a step to commit and push updated `data/facts.json` back to `main`.
   - Trigger `workflow_dispatch` via the GitHub API to immediately generate and post a fresh daily fun fact live.
4. **Versioning & Documentation (`v5.6.0`)**:
   - Bump `package.json` to `5.6.0`.
   - Update `CHANGELOG.md` with App Store style bullets ($\le 10$ words per bullet).
