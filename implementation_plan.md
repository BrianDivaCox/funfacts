# Implementation Plan: Archive Frying Pan Fact, Generate Fresh Replacement & Sync Tasks (v5.7.0)

## Objectives
1. **Purge & Archive "The Frying Pan" Fact**:
   - Move `FACT-1791871419092` from active `Fact Log` to `Duplicates Archive` tab in Google Sheets.
   - Delete/complete the Google Task `GTASK-UF9vbTVwbkI0SEV5LTk4NQ` from Google Tasks `FunFacts` list.
   - Update `data/facts.json` so the "Frying Pan" fact is permanently recorded in the duplicates archive / flagged duplicate so it can never be generated again.
2. **Generate Fresh Replacement Daily Fun Fact**:
   - Trigger generation for a novel topic (e.g., Deep Ocean Biology, Ancient Engineering, or Quantum Physics).
   - Ensure duplicate verification passes across all 105+ facts.
   - Save the new fact to `Fact Log` in Google Sheets and push to Google Tasks (`FunFacts` list).
3. **Automated Verification**:
   - Verify Google Sheets row insertion and Google Tasks creation.
   - Run headless Chrome Puppeteer E2E suite on `index.html` across 375px, 768px, 1280px with 0 errors.
   - Run duplicate engine benchmarks.
4. **Deploy & Push**:
   - Bump version to `5.7.0` in `package.json`.
   - Update `CHANGELOG.md` with $\le 10$ words per bullet.
   - Commit and push to GitHub `origin/main`.
