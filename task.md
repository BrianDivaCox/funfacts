# Task List: Fix Nightly Fun Fact Automation & Live Sync (v5.6.0)

- [x] Diagnose why no new facts appeared (inspected live GitHub Actions logs & Web App endpoint)
- [x] Clean house & create pre-change project backup (strictly maintaining max 2 backups)
- [x] Fix `backend/appsscript.json` (`"access": "ANYONE_ANONYMOUS"`) and `backend/Code.gs` token budget
- [x] Deploy updated Google Apps Script Web App (`clasp push` & `clasp deploy`) and verify live JSON response
- [x] Update `scripts/daily_automation.js`, `app.js`, and `.github/workflows/daily_automation.yml` with new Web App URL, hard POST verification, and `data/facts.json` auto-commit
- [x] Bump version to `v5.6.0` in `package.json` and update `CHANGELOG.md` ($\le 10$ words per bullet)
- [ ] Trigger live fun fact generation and verify end-to-end across Google Sheets, Google Tasks, `data/facts.json`, and headless Chrome UI test
- [ ] Commit and push `v5.6.0` to GitHub and verify GitHub Actions `workflow_dispatch` run succeeds
