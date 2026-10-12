# Implementation Plan: Fix Nightly Midnight Fun Fact Automation Workflow & Model Fallback (v5.5.0)

Fix the GitHub Actions workflow failure by replacing non-existent models (`gemini-3.1-pro`), making 503 high-demand errors gracefully advance to available fallback models, and adding network request timeouts.

## Root Cause Analysis
1. **Model 503 Overload on `gemini-3.8-flash`**: Upstream Google API intermittently returns 503 high demand spikes. `daily_automation.js` slept 2s and retried the exact same overloaded model 3 times instead of immediately advancing to `gemini-3.5-flash`.
2. **Missing `gemini-3.1-pro` (404)**: `gemini-3.1-pro` does not exist in Gemini API (`models/gemini-3.1-pro is not found`). The fallback chain needs active, proven production endpoints (`gemini-3.8-flash`, `gemini-3.5-flash`, `gemini-3.5-flash-lite`, `gemini-flash-lite-latest`).
3. **No Request Timeout on Fetch**: `fetch` calls without `AbortController` timeouts can hang indefinitely on degraded Google network calls until GitHub Actions kills the entire job.
4. **Deploy Script & Web App Endpoint**: Synchronize any Apps Script updates via clasp deploy and sync new deployment across project files.

## Proposed Changes

### 1. Update Fallback Model Chains across All Files
- Primary: `gemini-3.8-flash`
- Fallback 1: `gemini-3.5-flash` (tested & verified working 200 OK)
- Fallback 2: `gemini-3.5-flash-lite` (tested & verified working 200 OK)
- Fallback 3: `gemini-flash-lite-latest` (tested & verified working 200 OK)
- Apply to:
  - `scripts/daily_automation.js`
  - `backend/Code.gs`
  - `app.js`

### 2. Improve `daily_automation.js` Resilience
- When encountering HTTP 503 (high demand), break immediately to the next model in the fallback chain instead of burning all 3 retries on the overloaded model.
- Add an `AbortController` with a 15-second timeout to every fetch request to prevent hanging.
- Ensure thorough error logging in GitHub Actions.

### 3. Deploy Backend via Clasp & Version Bump
- Run `clasp push` and `clasp deploy`.
- Sync new deployment ID across `app.js`, `daily_automation.js`, and `.github/workflows/daily_automation.yml`.
- Bump version to `5.5.0` in `package.json`.
- Add `v5.5.0` to `CHANGELOG.md` with strict $\le 10$ words per bullet.

## Verification Plan
- Run automated node syntax validation.
- Test `daily_automation.js` locally with live API key to guarantee successful generation and fallback.
- Run `CHANGELOG.md` word count audit script ($\le 10$ words).
- Commit and push to GitHub `origin/main`.
