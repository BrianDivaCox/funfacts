# Changelog

All notable changes to the Fun Fact Tracker project will be documented in this file.

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
