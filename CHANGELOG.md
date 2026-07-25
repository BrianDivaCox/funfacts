# Changelog

All notable changes to the Fun Fact Tracker project will be documented in this file.

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
