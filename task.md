# Implementation Task List: Fast Duplicate Scanning, Dedicated Duplicates Tab & Repeat Counter

- [x] **Step 1: Backup & Housekeeping** <!-- id: 0 -->
  - Clean house and create project backup archive (`backup_funfact_tracker_v5.3.0_pre_duplicates_tab.zip`).
- [x] **Step 2: Architecture & Index Optimization** <!-- id: 1 -->
  - Implement Inverted Keyword Index in `backend/Code.gs` for 10x-50x faster duplicate scanning.
  - Implement `Duplicates Archive` sheet tab auto-initialization & styling.
- [x] **Step 3: Repeat Grouping & Count Tracker** <!-- id: 2 -->
  - Track repeat occurrences (`Repeat #X` / `Repeats: X times`) linked to original Fact ID.
  - Create `moveDuplicatesToArchive()` utility and integrate with `reScanAllDuplicates()`.
- [x] **Step 4: Update Frontend & Automation Scripts** <!-- id: 3 -->
  - Synchronize index optimization and stats in `scripts/daily_automation.js` and `app.js`.
  - Add menu actions in Google Sheets for "📦 Move Duplicates to Archive Tab" and "⚡ Fast Duplicate Scan".
- [x] **Step 5: Testing & Verification** <!-- id: 4 -->
  - Run comprehensive verification tests on indexing speed, tab archiving, and repeat counters.
- [x] **Step 6: Versioning, Changelog & Deployment** <!-- id: 5 -->
  - Update `CHANGELOG.md` (strict <= 10 words per bullet).
  - Bump version to `5.3.0` in `package.json`.
  - Push to Google Apps Script via `clasp push` and commit to GitHub.
