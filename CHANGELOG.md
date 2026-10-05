# Changelog

All notable changes to the Fun Fact Tracker project will be documented in this file.

## [5.3.0] - 2026-10-05

### Added & Optimized
- Added fast inverted keyword indexing for instant duplicate scanning.
- Created dedicated Duplicates Archive tab to store repeated facts.
- Added one-click tool to move duplicates into the archive.
- Grouped duplicate facts with repeat counters like Repeat #1.
- Styled Duplicates Archive tab with deep amethyst theme.
- Synced new Web App deployment across all automation scripts.

## [5.2.1] - 2026-10-05

### Cleaned
- Purged dead test functions from Google Apps Script backend.
- Pushed clean, production-ready codebase to Google Apps Script.

## [5.2.0] - 2026-10-05

### Changed
- Decluttered Google Sheet menu with clean, organized submenus.
- Removed obsolete test tasks and temporary testing buttons.

## [5.1.1] - 2026-10-05

### Updated
- Deployed Web App version 31 with upgraded backend.
- Synchronized Web App API URLs across all project files.

## [5.1.0] - 2026-10-05

### Fixed & Enhanced
- Upgraded duplicate detection to catch all rephrased facts.
- Added number normalization so digits and words match.
- Fixed keyword stemming to eliminate plural mismatch bugs.
- Bundled offline facts database for reliable duplicate checking.

## [5.0.1] - 2026-08-14

### Fixed
- Removed setNumberFormat calls to prevent typed column errors.
- Added try-catch guards to all sheet styling operations.

## [5.0.0] - 2026-08-14

### Major Update
- Facts marked Posted only after task creation succeeds.
- Unsynced facts remain marked as Queued.
- Added automatic duplicate scanning to Google Tasks sync.

## [4.9.1] - 2026-08-14

### Fixed
- Added safety guards around table percentage number formatting.

## [4.9.0] - 2026-08-14

### Changed
- Placed new fun facts directly into dedicated FunFacts list.

## [4.8.0] - 2026-08-14

### Upgraded & Fixed
- Switched Google Tasks integration to direct OAuth REST requests.
- Ensured reliable task creation from GitHub Actions runs.

## [4.7.0] - 2026-08-12

### Fixed
- Fixed Google Tasks sync filter matching historical seed timestamps.
- Added regex matching to ensure all new facts sync.

## [4.6.1] - 2026-08-11

### Fixed
- Added missing script OAuth scopes to project manifest.

## [4.6.0] - 2026-08-11

### Added
- Added automated hourly trigger for background Google Tasks syncing.
- Automatically pushes new facts from Sheets to Google Tasks.

## [4.5.0] - 2026-08-09

### Enhanced
- Filtered Google Tasks sync to recent facts only.
- Added one-click tool to clean completed Google Tasks.

## [4.4.0] - 2026-08-09

### Added
- Added one-click menu item to sync sheet facts.
- Added task sync routine to daily midnight trigger.

## [4.3.1] - 2026-08-07

### Fixed
- Added explicit OAuth permissions for Tasks and Gmail compose.

## [4.3.0] - 2026-08-05

### Added
- Added one-click menu tool to generate five facts.

## [4.2.1] - 2026-08-05

### Enhanced
- Posted facts to both default and FunFacts task lists.

## [4.2.0] - 2026-08-04

### Fixed & Enhanced
- Added core topic guard for matching key stemmed words.
- Optimized similarity strictness threshold across all scripts.

## [4.1.3] - 2026-08-04

### Fixed
- Updated test function to write facts to both destinations.

## [4.1.2] - 2026-07-30

### Added
- Added one-click menu tool to test Google Tasks.

## [4.1.1] - 2026-07-30

### Fixed
- Added null safety checks to Tasks and Keep integrations.

## [4.1.0] - 2026-07-30

### Added
- Added midnight violet theme formatting to Google Sheet.
- Enabled automatic text wrapping for fact and keyword columns.
- Added menu item to apply custom artistic theme.

## [4.0.5] - 2026-07-30

### Fixed
- Added automatic Tasks and Keep sync when saving facts.
- Added diagnostics logging for web app authorization redirects.

## [4.0.4] - 2026-07-30

### Fixed
- Fixed GitHub Actions workflow secret evaluation syntax.

## [4.0.3] - 2026-07-30

### Fixed
- Synced Gemini API key from dashboard into Settings sheet.

## [4.0.2] - 2026-07-30

### Fixed
- Upgraded GitHub Actions workflow runner to Node.js 24.
- Added secret validation step with setup instructions.

## [4.0.0] - 2026-07-30

### Added
- Added GitHub Actions daily midnight automation workflow.
- Created standalone Node.js script for automated fact generation.
- Upgraded web dashboard with Gemini 3.x model options.

## [3.6.1] - 2026-07-30

### Fixed
- Increased retry limit to three attempts per model.
- Adjusted duplicate similarity threshold to reduce false flags.
- Expanded topic domain coverage to 36 distinct categories.
- Deployed Web App API version 20 to Google Script.

## [3.6.0] - 2026-07-30

### Fixed
- Added five-minute runtime cap to prevent execution timeouts.
- Set thirty-second deadline on all external network requests.
- Added error handling for malformed or truncated responses.
- Handled overloaded server responses with fast model fallback.
- Deployed Web App API version 19 to Google Script.

## [3.5.0] - 2026-07-24

### Fixed
- Updated AI model chain to modern Gemini 3.x endpoints.
- Resolved quota errors caused by retired legacy models.
- Deployed Web App API version 18 to Google Script.

## [3.4.0] - 2026-07-24

### Fixed
- Added English word stemmer to catch rephrased duplicates.
- Tuned strictness threshold for better similarity detection.
- Deployed Web App API version 17 to Google Script.

## [3.3.0] - 2026-07-24

### Added & Fixed
- Added menu tool to rescan all facts for duplicates.
- Added chronological duplicate scanner across all sheet rows.
- Flagged historical duplicate facts in the fact log.
- Deployed Web App API version 16 to Google Script.

## [3.2.0] - 2026-07-24

### Fixed
- Prevented spreadsheet reinitialization on every web app request.
- Added hard duplicate guard before saving facts to sheet.
- Expanded prompt history sample for better Gemini guidance.
- Deployed Web App API version 15 to Google Script.

## [3.1.0] - 2026-07-24

### Added
- Added automatic backoff delay on rate limit errors.
- Optimized prompt tokens to conserve API quota limits.
- Deployed Web App API version 14 to Google Script.

## [3.0.0] - 2026-07-24

### Added
- Seeded 64 historical Google Keep facts into sheet.
- Added automatic seeding support during sheet initialization.
- Deployed Web App API version 13 to Google Script.

## [2.9.0] - 2026-07-24

### Added
- Added random topic domain hints on each generation attempt.
- Raised temperature and topP settings for maximum variety.
- Deployed Web App API version 12 to Google Script.

## [2.8.0] - 2026-07-24

### Added
- Updated Gemini model fallback hierarchy to 3.x models.
- Deployed Web App API version 11 to Google Script.

## [2.7.0] - 2026-07-24

### Added
- Added Gemini 3.6 Flash to top of model list.
- Deployed Web App API version 10 to Google Script.

## [2.6.0] - 2026-07-24

### Added
- Updated Gemini API endpoint with multi-model fallback array.
- Deployed Web App API version 9 to Google Script.

## [2.5.0] - 2026-07-24

### Added
- Removed obsolete placeholder text in dashboard interface.
- Deployed Web App API version 8 to Google Script.

## [2.4.0] - 2026-07-24

### Added
- Removed key prefix restrictions for modern API key formats.
- Deployed Web App API version 7 to Google Script.

## [2.3.0] - 2026-07-24

### Added
- Added API key format check in backend generator.
- Added friendly error message parser for invalid keys.
- Deployed Web App API version 6 to Google Script.

## [2.2.0] - 2026-07-24

### Added
- Added interactive UI alerts for sheet trigger feedback.
- Added alert dialog when Gemini API key is missing.
- Deployed Web App API version 5 to Google Script.

## [2.1.0] - 2026-07-24

### Added
- Integrated official Google Tasks API into script backend.
- Automatically added new daily fun facts to task list.
- Deployed Web App API version 4 to Google Script.

## [2.0.0] - 2026-07-24

### Added
- Added custom Fun Fact Tracker menu in Google Sheets.
- Deployed Web App API version 3 to Google Script.
- Updated default frontend script URL in web app.

## [1.9.0] - 2026-07-24

### Added
- Re-bound clasp backend to FunFacts Database Google Sheet.
- Deployed updated Web App API endpoint to Google Script.
- Connected dashboard default script URL to sheet backend.

## [1.8.0] - 2026-07-24

### Added
- Bound Apps Script backend directly to user Google Sheet.
- Deployed updated Web App API endpoint to Google Script.
- Connected dashboard script setting to live sheet backend.

## [1.7.0] - 2026-07-24

### Added
- Created dedicated Google Sheet titled FunFacts Database.
- Deployed Web App version 1 to Google Script.
- Connected dashboard script setting to new web app endpoint.

## [1.6.0] - 2026-07-24

### Added
- Pushed Fun Fact Tracker module to Google Apps Script.
- Embedded tracker options into Google Sheets admin menu.

## [1.5.1] - 2026-07-24

### Added
- Added nojekyll file to bypass Jekyll GitHub build.
- Added step-by-step setup instructions for GitHub Pages.

## [1.5.0] - 2026-07-24

### Added
- Configured GitHub Pages live web app deployment.
- Added project README with demo badge and documentation.

## [1.4.1] - 2026-07-24

### Added
- Connected remote repository on GitHub for project sync.
- Pushed complete initial codebase to GitHub main branch.

## [1.4.0] - 2026-07-24

### Added
- Initialized local Git repository with gitignore rules.
- Prepared project for GitHub publishing and tracking.

## [1.3.1] - 2026-07-24

### Fixed
- Fixed browser local storage cache sync for seeded facts.
- Added vault reset button to sync historical facts.

## [1.3.0] - 2026-07-24

### Added
- Imported and indexed 64 historical Google Keep facts.
- Configured initial database seeding with historical dataset.
- Flagged historical duplicate entries across the initial dataset.

## [1.2.0] - 2026-07-24

### Added
- Enforced concise character limits and fun tone in prompts.
- Configured funfact hashtag formatting across all generated outputs.
- Enhanced Keep note formatting for Google Tasks sync.

## [1.1.0] - 2026-07-24

### Added
- Created dashboard startup script to launch browser app.
- Created backup script to archive project files on demand.
- Created organize script to sort files into subdirectories.

## [1.0.0] - 2026-07-24

### Added
- Initial project release of Fun Fact Tracker application.
- Added web dashboard for managing and searching facts.
- Added multi-tier duplicate prevention engine for fact uniqueness.
- Added Google Apps Script backend with sheet storage.
- Added automated midnight trigger and Gemini generation sandbox.
