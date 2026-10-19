# Implementation Plan: Pure Direct Google Sign-In Button (v5.9.1)

## Objectives
1. **Eliminate Modal and Text Clutter**:
   - Remove the entire Admin Authentication Modal, explanatory text, and target email box.
   - The user requested: "we just need the google sign in button".
   - The header will have a clean, direct "Sign in with Google" button.
2. **Direct Google Sign-In Authentication**:
   - Clicking the Google Sign-In button directly launches Google Sign-In (Firebase Auth with GoogleAuthProvider / GIS popup).
   - Only `briandivacox@gmail.com` is granted administrator access.
   - Any other account is rejected with an immediate error toast.
   - Authenticated state displays the user's Google avatar and "Sign Out" button.
   - Settings tab remains completely hidden and inaccessible to public visitors until `briandivacox@gmail.com` signs in.
3. **Automated Verification**:
   - Run headless Chrome E2E test verifying:
     - Public view: only the direct Google Sign-In button is in the header, Settings tab is hidden.
     - Direct Google Sign-In unlocks Settings tab for `briandivacox@gmail.com`.
     - Sign Out locks Settings and returns view to Dashboard.
     - Responsive audits pass with 0 errors across 375px, 768px, 1280px.
4. **Deploy & Push**:
   - Bump version to `5.9.1`.
   - Update `CHANGELOG.md` with $\le 10$ words per bullet.
   - Push to GitHub `origin/main` for live GitHub Pages deployment.
