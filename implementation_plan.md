# Implementation Plan: Gemini Flash 3.8 Model Upgrade (v5.4.0)

Upgrade AI model integration across the entire codebase from retiring 3.6/3.7 models to `gemini-3.8-flash`.

## Proposed Changes

### 1. Frontend Client (`app.js`)
- Update `modelsToTry` array in `runGeminiGenerator`:
  - Primary: `gemini-3.8-flash`
  - Fallbacks: `gemini-3.5-flash`, `gemini-3.5-flash-lite`, `gemini-3.1-pro`

### 2. Google Apps Script Backend (`backend/Code.gs`)
- Update `modelsToTry` array in `generateUniqueFactWithGemini`:
  - Primary: `gemini-3.8-flash`
  - Fallbacks: `gemini-3.5-flash`, `gemini-3.5-flash-lite`, `gemini-3.1-pro`

### 3. Automation Scripts (`scripts/daily_automation.js`)
- Update `MODELS_TO_TRY` array:
  - Primary: `gemini-3.8-flash`
  - Fallbacks: `gemini-3.5-flash`, `gemini-3.5-flash-lite`, `gemini-3.1-pro`

### 4. Version Bump & Changelog
- Bump version to `5.4.0` in `package.json`.
- Add `v5.4.0` release notes to `CHANGELOG.md` following the strict $\le$ 10 words per bullet rule.

### 5. Clasp Deployment & Automated Verification
- Push and deploy Apps Script via clasp.
- Programmatically verify test suites and headless checks.
- Commit and push to GitHub.

## Verification Plan
- Automated syntax and unit verification of scripts.
- Check word count of all bullets in `CHANGELOG.md` ($\le 10$ words).
- Deploy Apps Script backend via `clasp push` and `clasp deploy`.
