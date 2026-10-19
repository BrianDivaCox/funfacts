# Implementation Plan: Hide Settings Behind Google Sign-In Admin Menu (v5.9.0)

## Objectives
1. **Hide Settings & Automation for Public Visitors**:
   - The "⚙️ Settings & Automation" tab button and its section (`#settings`) must be hidden and inaccessible by default for public visitors to `https://briandivacox.github.io/funfacts/`.
   - Prevent unauthorized access or tab switching to Settings if unauthenticated.
2. **Google Sign-In Admin Menu**:
   - Add a sleek Google Sign-In Admin button in the top navigation/header.
   - Implement Admin Auth Modal with Google Sign-In (GIS) and authorized administrator verification (`briandivacox@gmail.com`).
   - On successful login: unlock Settings tab with an "ADMIN" badge, display admin avatar and name with a 1-click Sign Out option.
   - On sign-out: immediately lock and hide Settings, redirect user back to Dashboard, and clear admin session.
3. **Automated Verification**:
   - Run headless Google Chrome Puppeteer E2E tests across mobile (375px), tablet (768px), and desktop (1280px) asserting:
     - Settings tab is completely hidden in public mode.
     - Settings tab unlocks upon admin authentication.
     - Settings tab locks and hides upon sign-out.
     - 0 console errors and 0 horizontal overflow.
   - Run duplicate engine benchmarks.
4. **Deploy & Push**:
   - Bump version to `5.9.0` in `package.json`.
   - Update `CHANGELOG.md` with strictly $\le 10$ words per bullet.
   - Commit and push to GitHub `origin/main`.
