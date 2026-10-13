# Task List: Archive Duplicate Fact & Generate Fresh Replacement (v5.7.0)

- [x] Clean house and create pre-change project backup (strictly maintaining max 2 backups)
- [x] Add `archiveFact` and `deleteGoogleTask` REST endpoints in `backend/Code.gs` and deploy via Clasp
- [x] Archive `FACT-1791871419092` ("Frying Pan") from Google Sheet & delete from Google Tasks
- [x] Update `data/facts.json` to record "Frying Pan" as duplicate and prevent future generation
- [x] Generate and post a fresh, novel replacement daily fun fact to Google Sheet & Google Tasks
- [x] Verify live Google Sheet and Google Tasks row contents
- [x] Run headless Chrome Puppeteer E2E tests across mobile (375px), tablet (768px), desktop (1280px)
- [x] Run duplicate engine benchmark suite
- [x] Bump version to `v5.7.0` in `package.json` and update `CHANGELOG.md` ($\le 10$ words per bullet)
- [x] Commit and push `v5.7.0` to GitHub `origin/main`
- [x] Clean up all temporary scripts and verify zero dangling background processes
