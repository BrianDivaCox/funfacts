# Task List: Consolidated Single-Entry Duplicates Archive with Repeat Counters (v5.8.0)

- [x] Clean house and create pre-change project backup (strictly maintaining max 2 backups)
- [x] Refactor `Duplicates Archive` schema and consolidation engine in `backend/Code.gs` (1 entry per topic with incrementing `repeatCount`)
- [x] Update `archiveSpecificFact` & `moveDuplicatesToArchive` to increment existing row counter instead of creating redundant rows
- [x] Push and deploy updated Apps Script via Clasp to deployment ID `AKfycbw-Lc7XbpxcslSgdAKCQS0IMZiQWm_nOs1Pk3qtwF34slW86hDTioR74mUzA1mDl7o`
- [x] Run live consolidation trigger on Google Sheet Duplicates Archive tab and verify single Sloth row with Repeat Count = 8 (tested increment to 9)
- [x] Update `app.js` and `index.html` to reflect consolidated archive table with repeat counter pills
- [x] Run headless Chrome Puppeteer E2E tests across mobile (375px), tablet (768px), desktop (1280px) with 0 errors
- [x] Run duplicate engine benchmark suite
- [x] Bump version to `v5.8.0` in `package.json` and update `CHANGELOG.md` (strictly $\le 10$ words per bullet)
- [x] Commit and push `v5.8.0` to GitHub `origin/main`
- [x] Clean up all temporary scripts and verify zero dangling background processes
