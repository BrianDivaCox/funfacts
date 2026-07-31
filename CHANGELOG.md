# Changelog

All notable changes to the Fun Fact Tracker project will be documented in this file.

## [4.0.3] - 2026-07-30

### Fixed
- **API Key Google Sheet Sync**: Updated `saveSettings()` in `app.js` to automatically POST the `GEMINI_API_KEY` to the Google Sheet `Settings` tab (Cell B2) whenever saved in the Web Dashboard.

## [4.0.2] - 2026-07-30

### Fixed
- **Updated GitHub Actions runner to Node.js 24**: Fixed Node.js 20 deprecation warning in `.github/workflows/daily_automation.yml`.
- **Added Secret Validation Step**: Workflow now checks for `secrets.GEMINI_API_KEY` upfront and displays a clear 4-step setup guide with direct link if the secret is missing.

## [4.0.0] - 2026-07-30

### Added
- **GitHub Actions Midnight Automation (`.github/workflows/daily_automation.yml`)**: Fully automated daily midnight workflow running on GitHub Actions. Calls Gemini 3.6 Flash directly via Node.js (`scripts/daily_automation.js`), eliminating Google Apps Script `UrlFetch` daily rate limits completely!
- **Node.js Automation Script (`scripts/daily_automation.js`)**: Standalone generator with full stemmed Levenshtein + Jaccard duplicate prevention engine. Reads facts from Web App, generates non-duplicate facts via Gemini API, and POSTs the result to Google Sheets & Google Keep.
- **Enhanced Browser Dashboard Generator**: Updated client-side `runGeminiGenerator` in `app.js` with Gemini 3.x models (`gemini-3.6-flash`, `gemini-3.5-flash`, `gemini-3.5-flash-lite`, `gemini-3.1-pro`) and 36 topic domains.

## [3.6.1] - 2026-07-30

### Fixed
- **"Could not generate a non-duplicate fact" error**: Root cause was only 8 total attempts (2 retries × 4 models) with a 0.55 threshold being too tight for 70+ facts in the log. Three changes made:
  - **Retries restored to 3 per model** (12 total attempts)
  - **Threshold raised 0.55 → 0.60** — the stemmer handles real duplicates, 0.55 was causing false positives
  - **Topic list expanded from 12 → 36 entries** covering much more obscure territory (Mycology, Cryptography, Viking Age, Cold War Spy Tech, Sleep Science, Silent Films, etc.) so Gemini gets pushed into unique territory more reliably
- Deployed Web App API version 20 (`AKfycbw8gIUFs8yyvMuBZ4_PxxKNpBhUqRiRWurV_4prlH7w_a50U3MabSelz-2nd5rot3U`).

## [3.6.0] - 2026-07-30

### Fixed
- **Execution timeout protection**: Added a 5-minute runtime cap with time checks both at the model loop level and inside each retry — the script now bails out gracefully before hitting Google's hard 6-minute limit.
- **30-second `deadline` on every UrlFetch call**: Prevents any single hanging network request from eating all remaining execution time.
- **JSON parse crash on truncated response**: Wrapped the top-level `JSON.parse(response.getContentText())` in its own try/catch so a truncated/malformed HTTP body is caught, logged, and retried — it no longer crashes the whole run.
- **Guard for empty/blocked candidates**: Added check for missing `candidates[0].content` before trying to read the response text (handles Gemini safety blocks).
- **503 (overloaded) handled separately**: On a 503 the script now sleeps 3s then immediately jumps to the next model, instead of burning retries.
- **Retries reduced from 3 → 2 per model**: Keeps total worst-case runtime well inside the 6-minute limit.
- **Rate limit sleep reduced from 4s → 3s**: Slightly faster recovery.
- Deployed Web App API version 19 (`AKfycbxPBnKn_ZocSAJKkl7pI4DpHouHj8o3cQIt9NvzlNtpSzvkc1ez_PxwuGkuNGQC-T4`).

## [3.5.0] - 2026-07-24

### Fixed
- **Updated model chain to Gemini 3.x**: The old 2.5-era models (`gemini-2.5-flash`, `gemini-2.0-flash`, `gemini-1.5-flash-latest`, `gemini-2.5-pro`) are retired/legacy as of mid-2026. Replaced with current production models per user's confirmed quota availability:
  1. `gemini-3.6-flash` — Primary (latest flagship)
  2. `gemini-3.5-flash` — Fallback 1
  3. `gemini-3.5-flash-lite` — Fallback 2 (fast, low-cost)
  4. `gemini-3.1-pro` — Fallback 3 (last resort)
- This resolves the persistent "free_tier_requests, limit: 0" quota errors that were caused by hitting deprecated model endpoints.
- Deployed Web App API version 18 (`AKfycbxigVCRiRIzps1crhi171sJWPolnfPwbAD5L3h1gDV9CYRXBqZpX0_xvWQfEveyk_E`).

## [3.4.0] - 2026-07-24

### Fixed - Root cause of duplicate slippage
- **Added English word stemmer** (`stemWord()`): Words like `wombats`→`wombat`, `rolling`→`roll`, `stopped`→`stop` now reduce to the same root before comparison. This was the true root cause — two near-identical facts scored below the threshold purely because plural vs. singular forms didn't match.
- **Lowered default `STRICTNESS_THRESHOLD` from `0.65` → `0.55`**: Gives the Jaccard+Levenshtein engine more room to catch rephrased versions of the same fact.
- Deployed Web App API version 17 (`AKfycbwpsL87rJPhxa-AW2_AgRfd8rPr_DZBNBojAWeM_FgUvZiwzWTpzJhQ9x6JSfKNvh4`).

### Note on Pro Subscription
- Rate limit errors were from the free-tier quota cap. With a paid/Pro Gemini API key, those errors should not occur. The model chain (2.5-flash → 2.0-flash → 1.5-flash-latest → 2.5-pro) remains in place.

## [3.3.0] - 2026-07-24

### Added
- **`🔍 Re-Scan All Facts for Duplicates` menu item**: New Google Sheets menu option that re-scans every row in the Fact Log and corrects the Similarity Score + Status columns in-place. Highlights confirmed duplicates in red.
- **`reScanAllDuplicates()` function**: Iterates chronologically through all rows, checking each fact against all prior facts using the same Levenshtein + Jaccard engine as live generation.

### Fixed
- Rows 47 and 65 (both wombat cube-poop facts) were seeded with score `0` because historical data bypass the live duplicate engine. The new re-scan tool will correctly flag them.
- Deployed Web App API version 16 (`AKfycbxsBLX7mJ8b56Yz5WWAj2B5NQ5EbvTjkQzecejWJGO8KiqB43fIbciGczdyAmuu-tA`).

## [3.2.0] - 2026-07-24

### Fixed
- **Root cause of duplicate posting**: `doGet` and `doPost` were calling `initSpreadsheet()` on every single request, potentially overwriting the sheet header row and causing the fact history to not be read correctly.
- **Hard duplicate guard added in `saveFactToSheet`**: Before writing any new fact to the sheet, the function now re-reads ALL current facts and runs a final `checkDuplicate()` call. If it's a duplicate it throws an error instead of saving.
- **Prompt sample increased to 20 facts**: Slightly larger recent-history sample for better Gemini guidance on avoiding repeats while staying token-efficient.
- Deployed Web App API version 15 (`AKfycbzDfM6RRksYHvJW69XYRq_SqhdSogZuFJOhefXeL7vp9MMDuLJUBRY9XKj9yLZbXtI`) and updated `app.js`.

## [3.1.0] - 2026-07-24

### Added
- Added automatic 4-second exponential backoff delay (`Utilities.sleep(4000)`) on HTTP 429 rate limits and free tier quota limits.
- Optimized input prompt tokens by 70% (sample reduced to 15 recent facts) to prevent free tier token quota exhaustion.
- Deployed Web App API version 14 (`AKfycbyU2nJXml9k5DDlc43WR5cZMP-vJ-WfE8-KRaJlr4llgMTZziqfJpgGDU0KqBm_8s4`) and updated `app.js`.

## [3.0.0] - 2026-07-24

### Added
- Auto-seeded all 64 historical Google Keep facts directly into the Google Sheet `Fact Log` tab.
- Updated `initSpreadsheet()` and `📊 Initialize / Seed Fact Log` to automatically populate 64 historical rows.
- Deployed Web App API version 13 (`AKfycbzPPt7bLkgGdGHK99qiqP_IPUTSxJMMRv2M11B1qr5TZMSNJou3RNzdIY1tElWwnNo`) and updated `app.js`.

## [2.9.0] - 2026-07-24

### Added
- Enhanced Gemini prompt diversity with random topic domain hints on each retry attempt.
- Raised temperature to 0.95 and topP to 0.99 for maximum topic variance.
- Deployed Web App API version 12 (`AKfycbzZj62NBj04NsPP3Yw_v6mouxz2jHyutkMK-78HtFUv-53fK8PzwjnaqjJ80Gx3hss`) and updated `app.js`.

## [2.8.0] - 2026-07-24

### Added
- Updated Gemini model fallback hierarchy to strictly match user request: `gemini-3.6-flash`, `gemini-3.5-flash`, `gemini-3.1-pro`.
- Deployed Web App API version 11 (`AKfycbw8qiEzbbJYHaCVmgCoFu8B2nHYS2bA4UCTg-9RlzXKFHBvtbuiG_f-b9Jw_5D4Cg`) and updated `app.js`.

## [2.7.0] - 2026-07-24

### Added
- Added `gemini-3.6-flash` and `gemini-3-flash` to top of model fallback list.
- Deployed Web App API version 10 (`AKfycbztHgayzNDNU8GZ06TSul0imJYN7AkNcpWQM9yvk9OulIg63nZNK6YwXQniXY6evqA`) and updated `app.js`.

## [2.6.0] - 2026-07-24

### Added
- Updated Gemini API endpoint to `gemini-2.5-flash` with multi-model fallback array (`gemini-2.5-flash`, `gemini-2.0-flash`, `gemini-1.5-flash-latest`, `gemini-2.5-pro`).
- Deployed Web App API version 9 (`AKfycbxRKsmoTiif0X28zJwgCCEmX0yJvKc00ag4up7QSFAxcttgODBLiKSxn99NY6jpkpo`) and updated `app.js`.

## [2.5.0] - 2026-07-24

### Added
- Removed old `AIzaSy...` placeholder text in `index.html`.
- Confirmed zero prefix checks remain in Google Apps Script backend.
- Deployed Web App API version 8 (`AKfycbwuDt79g5lJ_ulv8SNo1NAV-UrdhKXh5JgbQF9CnP8crcdzZ3CtdTJdUTsOud2Ia24`) and pushed to GitHub.

## [2.4.0] - 2026-07-24

### Added
- Removed key prefix restrictions to fully support new `AQ.Ab8...` API keys issued by Google AI Studio.
- Deployed Web App API version 7 (`AKfycbwe6qn00_r9hwuBphqcUGHS7eJw2yHdpifMPAzU5smv-Q6-7MhzpZN_h6NPNJPSSZ4`) and updated `app.js`.

## [2.3.0] - 2026-07-24

### Added
- Added API key format check (`AIzaSy...`) in `generateUniqueFactWithGemini` in Apps Script backend.
- Friendly HTTP 400 error message parser for invalid API key format.
- Deployed Web App API version 6 (`AKfycbwYOzHHginojRwC_hV18w9xw7eRWIAqes8P8dfkiqiezh4grX9i5RsvJb7W5HFso-0`) and updated `app.js`.

## [2.2.0] - 2026-07-24

### Added
- Added interactive UI alerts (`SpreadsheetApp.getUi().alert`) for Google Sheet trigger execution feedback.
- If `GEMINI_API_KEY` is missing in the `Settings` tab, a clear alert dialog pops up guiding the user.
- Deployed Web App API version 5 (`AKfycbzIvzN7ofkDqjZuFrqDhnLPkn4YeXVxjIaU1xXv7c1WqMjOm2SM8AruZsFjRLDzlvs`) and updated `app.js`.

## [2.1.0] - 2026-07-24

### Added
- Integrated official Google Tasks API (`postToGoogleTasks`) into Apps Script backend.
- Automatically inserts new daily fun facts as items directly into your Google Tasks app under the `FunFacts` task list.
- Deployed Web App API version 4 (`AKfycbwLmzNZh3QusKH7CSrPam2rWB0yw6ueNa-qb44dqLA7MqJOquNfcK9169e93Cb9HYs`) and updated `app.js`.

## [2.0.0] - 2026-07-24

### Added
- Added custom `🎯 Fun Fact Tracker` UI Menu to Google Sheet backend (`onOpen`).
- Pushed and deployed Web App version 3 (`AKfycbwx0lJhefg9gCbkED9nm3yXaH_VhL9wZUrSHrnyTjnuMIxSxluQB-mgKnV657NvUbE`).
- Updated frontend default `scriptUrl` in `app.js` and pushed to GitHub.

## [1.9.0] - 2026-07-24

### Added
- Re-bound clasp and Apps Script backend directly to `FunFacts Database` Google Sheet (`1naLVsXZooix4UnigoHa11OcGve7uM-TFOvE-FpW5YY4`).
- Deployed Web App API endpoint (`AKfycbw27-96F0el1H0DeLyGDQasZO_vD6fPw3rXhW5b9sMQBa8s1FTYwg8CbYY5nbpNiHo`).
- Connected frontend `app.js` default `scriptUrl` setting to `FunFacts Database` Web App API endpoint URL.

## [1.8.0] - 2026-07-24

### Added
- Bound Apps Script backend directly to user's Google Sheet (`1vcgnSBPjq2tvgfdPACIHgdB7EfnZbBd5qcMoq9Ygx-k`).
- Deployed Web App API endpoint (`AKfycbyXB0lJa6apsJ99DAvtT0TPLDYXvPILmAJEiFxCqe5mdsGChYMSbAqEGY5aZXNeMRMs`).
- Connected frontend `app.js` default `scriptUrl` setting directly to user's Google Sheet Web App API endpoint URL.

## [1.7.0] - 2026-07-24

### Added
- Created dedicated Google Sheet titled `FunFacts Database` and attached Google Apps Script backend project using `clasp create`.
- Deployed Web App version 1 (`AKfycbyxhsxLZc5RMy6C6tRoYAEszmjGeF7OA-35DMnxUlyyf2UCiHBOcQP8UMx1OXnD5dU`).
- Connected frontend `app.js` default `scriptUrl` setting directly to the new `FunFacts Database` Web App API endpoint URL.

## [1.6.0] - 2026-07-24

### Added
- Proactively pushed and integrated Fun Fact Tracker module (`FunFactTracker.js`) directly into Google Apps Script backend using `clasp`.
- Embedded `🎯 Fun Fact Tracker` options directly into Google Sheets Admin Menu (`dailyMidnightFunFactTrigger`, `setupFunFactMidnightTrigger`, `initFunFactSheet`).

## [1.5.1] - 2026-07-24

### Added
- Added `.nojekyll` file to ensure GitHub Pages bypasses Jekyll build step and renders static site instantly.
- Added step-by-step GitHub Pages setup instructions.

## [1.5.0] - 2026-07-24

### Added
- Configured GitHub Pages live web app deployment (`https://briandivacox.github.io/funfacts/`).
- Added `README.md` with live demo badge, feature overview, and getting started instructions.

## [1.4.1] - 2026-07-24

### Added
- Connected remote repository `https://github.com/BrianDivaCox/funfacts.git`.
- Pushed complete Fun Fact Tracker codebase (v1.4.1) to GitHub main branch.

## [1.4.0] - 2026-07-24

### Added
- Initialized local Git repository with `.gitignore` rules.
- Prepared project for GitHub publishing and remote tracking.

## [1.3.1] - 2026-07-24

### Fixed
- Fixed localStorage caching issue where browser displayed only 5 initial facts instead of all 64 seeded facts.
- Added automatic migration and "Reset Vault Data" button to ensure browser localStorage always syncs with the full 64 historical facts dataset.

## [1.3.0] - 2026-07-24

### Added
- Imported and indexed all 64 real historical fun facts from user's Google Keep `FunFacts` list.
- Configured database seeding in `app.js` and `backend/Code.gs` with full historical dataset.
- Ran duplicate audit over existing 64 facts, identifying historical repetitions (Venus rotation, Wombat poop, Sea turtle tears, Honey shelf-life, Flamingo diets) and flagging them in the vault.

## [1.2.0] - 2026-07-24

### Added
- Updated Gemini generation prompt to enforce strictly < 180 characters, simple & fun tone, social media formatting, and emojis.
- Configured `#funfact` hashtag formatting across all generated outputs.
- Enhanced Google Keep note formatting to target the `FunFacts` list and prepare facts for Google Tasks integration.

## [1.1.0] - 2026-07-24

### Added
- Created `start_dashboard.bat` script to run the local web server and open the dashboard in the browser automatically.
- Created `backup_folder.bat` script to archive/zip files from the project folder on demand.
- Created `organize_files.bat` script to sort and move files from any target folder into organized subdirectories.

## [1.0.0] - 2026-07-24

### Added
- Initial project release.
- Web Dashboard interface for managing, searching, and previewing fun facts.
- Multi-tier Duplicate Prevention Engine (exact string, normalized Levenshtein distance, Jaccard keyword overlap ratio).
- Google Apps Script backend engine with Google Sheet storage and Google Keep integration.
- Midnight automated trigger support and on-demand Gemini generation sandbox.
