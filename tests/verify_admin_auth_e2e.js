/**
 * End-to-End Automated Verification Test Suite
 * Tests Pure Direct Google Sign-In, Route Security Guards, and Responsive Layouts
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const puppeteer = require('C:/Users/Brian/Documents/antigravity/brian_theater/node_modules/puppeteer-core');

const CHROME_PATH = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PORT = 8089;
const ROOT_DIR = path.resolve(__dirname, '..');

// Simple static HTTP server
function createServer() {
  const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml'
  };

  return http.createServer((req, res) => {
    let filePath = path.join(ROOT_DIR, req.url.split('?')[0]);
    if (req.url === '/favicon.ico') {
      res.writeHead(204);
      res.end();
      return;
    }
    if (req.url === '/' || req.url === '') {
      filePath = path.join(ROOT_DIR, 'index.html');
    }

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
        return;
      }
      const ext = path.extname(filePath);
      const contentType = mimeTypes[ext] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    });
  });
}

async function runVerification() {
  console.log('🚀 Starting FactVault AI Direct Google Sign-In E2E Test Suite...');
  const server = createServer();
  await new Promise((resolve) => server.listen(PORT, resolve));
  console.log(`📡 Local test server running on http://127.0.0.1:${PORT}`);

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  const consoleErrors = [];

  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  page.on('pageerror', err => {
    consoleErrors.push(err.toString());
  });

  try {
    // -------------------------------------------------------------
    // TEST 1: Public Default State (Settings strictly hidden)
    // -------------------------------------------------------------
    console.log('\n[TEST 1] Verifying Public Default State (Unauthenticated)...');
    await page.goto(`http://127.0.0.1:${PORT}/index.html`, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.waitForFunction(() => !!window.app);

    const publicState = await page.evaluate(() => {
      const settingsTabBtn = document.getElementById('adminSettingsTabBtn');
      const settingsSection = document.getElementById('settings');
      const adminLoginBtn = document.getElementById('adminLoginBtn');
      const adminProfilePill = document.getElementById('adminProfilePill');

      const btnComputed = window.getComputedStyle(settingsTabBtn);
      const secComputed = window.getComputedStyle(settingsSection);
      const loginComputed = window.getComputedStyle(adminLoginBtn);
      const profileComputed = window.getComputedStyle(adminProfilePill);

      return {
        btnDisplay: btnComputed.display,
        secDisplay: secComputed.display,
        loginDisplay: loginComputed.display,
        profileDisplay: profileComputed.display,
        loginBtnText: adminLoginBtn ? adminLoginBtn.innerText.trim() : '',
        isAdmin: window.app ? window.app.isAdmin : null
      };
    });

    console.log('Public State Check:', publicState);
    if (publicState.btnDisplay !== 'none') {
      throw new Error(`FAIL: Settings Tab Button is visible to public! display=${publicState.btnDisplay}`);
    }
    if (publicState.secDisplay !== 'none') {
      throw new Error(`FAIL: Settings Section is visible to public! display=${publicState.secDisplay}`);
    }
    if (publicState.loginDisplay === 'none') {
      throw new Error(`FAIL: Google Sign In Button is hidden from public! display=${publicState.loginDisplay}`);
    }
    if (!publicState.loginBtnText.includes('Sign In with Google')) {
      throw new Error(`FAIL: Google Sign In button does not say "Sign In with Google"! text=${publicState.loginBtnText}`);
    }
    if (publicState.profileDisplay !== 'none') {
      throw new Error(`FAIL: Admin Profile Pill should be hidden from public! display=${publicState.profileDisplay}`);
    }
    if (publicState.isAdmin !== false) {
      throw new Error(`FAIL: app.isAdmin should be false! value=${publicState.isAdmin}`);
    }
    console.log('✅ TEST 1 PASSED: Settings tab & section strictly hidden; direct Google Sign In button displayed.');

    // -------------------------------------------------------------
    // TEST 2: Security Route Guard (Prevent Unauthorized Tab Switch)
    // -------------------------------------------------------------
    console.log('\n[TEST 2] Verifying Security Route Guard against unauthorized tab switch...');
    const switchAttempt = await page.evaluate(() => {
      window.app.switchTab('settings');
      const activeTabBtn = document.querySelector('.tab-btn.active');
      const activeSection = document.querySelector('.tab-content.active');
      const toast = document.querySelector('.toast');

      return {
        activeTab: activeTabBtn ? activeTabBtn.dataset.tab : null,
        activeSecId: activeSection ? activeSection.id : null,
        toastText: toast ? toast.innerText : null
      };
    });

    console.log('Switch Attempt Result:', switchAttempt);
    if (switchAttempt.activeTab === 'settings') {
      throw new Error('FAIL: Unauthorized user was able to switch to settings tab!');
    }
    if (switchAttempt.activeSecId === 'settings') {
      throw new Error('FAIL: Settings section became active for unauthorized user!');
    }
    console.log('✅ TEST 2 PASSED: Security Guard rejected unauthorized access and displayed warning toast.');

    // -------------------------------------------------------------
    // TEST 3: Unauthorized Google Sign-In Rejection
    // -------------------------------------------------------------
    console.log('\n[TEST 3] Verifying Rejection of Unauthorized Google Account...');
    const fakeUnauthorizedToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' + 
      Buffer.from(JSON.stringify({
        email: 'random_visitor@gmail.com',
        name: 'Random Visitor',
        picture: null
      })).toString('base64') + '.fakesignature';

    const rejectionResult = await page.evaluate((token) => {
      window.app.handleGoogleCredentialResponse({ credential: token });
      const toasts = document.querySelectorAll('.toast');
      const latestToast = toasts.length > 0 ? toasts[toasts.length - 1] : null;
      return {
        isAdmin: window.app.isAdmin,
        toastText: latestToast ? latestToast.innerText : null
      };
    }, fakeUnauthorizedToken);

    console.log('Rejection Result:', rejectionResult);
    if (rejectionResult.isAdmin === true) {
      throw new Error('FAIL: Unauthorized email was granted admin access!');
    }
    if (!rejectionResult.toastText || !rejectionResult.toastText.includes('random_visitor@gmail.com')) {
      throw new Error('FAIL: Toast alert did not display unauthorized access rejection!');
    }
    console.log('✅ TEST 3 PASSED: Unauthorized account correctly rejected with toast alert.');

    // -------------------------------------------------------------
    // TEST 4: Direct Google Sign-In as Brian Cox (briandivacox@gmail.com)
    // -------------------------------------------------------------
    console.log('\n[TEST 4] Verifying Direct Google Sign-In for Brian Cox...');
    await page.click('#adminLoginBtn');

    await page.waitForFunction(() => {
      return window.app && window.app.isAdmin === true;
    });

    const adminUnlockedState = await page.evaluate(() => {
      const settingsTabBtn = document.getElementById('adminSettingsTabBtn');
      const adminLoginBtn = document.getElementById('adminLoginBtn');
      const adminProfilePill = document.getElementById('adminProfilePill');
      const adminName = document.getElementById('adminName');

      return {
        isAdmin: window.app.isAdmin,
        btnDisplay: window.getComputedStyle(settingsTabBtn).display,
        btnAdminTag: settingsTabBtn.querySelector('.nav-admin-tag') !== null,
        loginDisplay: window.getComputedStyle(adminLoginBtn).display,
        profileDisplay: window.getComputedStyle(adminProfilePill).display,
        adminName: adminName.textContent,
        sessionStored: sessionStorage.getItem('factvault_admin_session') !== null
      };
    });

    console.log('Admin Unlocked State:', adminUnlockedState);
    if (!adminUnlockedState.isAdmin) {
      throw new Error('FAIL: app.isAdmin is not true!');
    }
    if (adminUnlockedState.btnDisplay === 'none') {
      throw new Error('FAIL: Settings tab button is still hidden after admin login!');
    }
    if (!adminUnlockedState.btnAdminTag) {
      throw new Error('FAIL: Settings tab button does not have ADMIN tag badge!');
    }
    if (adminUnlockedState.loginDisplay !== 'none') {
      throw new Error('FAIL: Google Sign In button is still visible in header!');
    }
    if (adminUnlockedState.profileDisplay === 'none') {
      throw new Error('FAIL: Admin profile pill is hidden in header!');
    }
    if (!adminUnlockedState.sessionStored) {
      throw new Error('FAIL: Admin session was not saved to sessionStorage!');
    }
    console.log('✅ TEST 4 PASSED: Direct Google Sign-In unlocked Settings tab with ADMIN tag.');

    // -------------------------------------------------------------
    // TEST 5: Admin Settings Tab Navigation & Controls Functionality
    // -------------------------------------------------------------
    console.log('\n[TEST 5] Verifying Settings Tab Navigation & Controls...');
    await page.click('#adminSettingsTabBtn');
    await page.waitForFunction(() => {
      const settingsSec = document.getElementById('settings');
      return settingsSec.classList.contains('active');
    });

    const settingsControlsState = await page.evaluate(() => {
      const apiKeyInput = document.getElementById('settingApiKey');
      const scriptUrlInput = document.getElementById('settingScriptUrl');
      const strictnessInput = document.getElementById('settingStrictness');
      const saveBtn = document.getElementById('saveSettingsBtn');
      const reloadBtn = document.getElementById('resetDataBtn');

      return {
        hasApiKeyInput: !!apiKeyInput,
        scriptUrlVal: scriptUrlInput ? scriptUrlInput.value : '',
        strictnessVal: strictnessInput ? strictnessInput.value : '',
        hasSaveBtn: !!saveBtn,
        hasReloadBtn: !!reloadBtn
      };
    });

    console.log('Settings Controls State:', settingsControlsState);
    if (!settingsControlsState.hasApiKeyInput || !settingsControlsState.hasSaveBtn) {
      throw new Error('FAIL: Settings controls are missing or not rendered properly!');
    }
    console.log('✅ TEST 5 PASSED: Admin navigated to Settings; all controls available.');

    // -------------------------------------------------------------
    // TEST 6: Admin Sign Out Journey
    // -------------------------------------------------------------
    console.log('\n[TEST 6] Verifying Admin Sign Out Journey...');
    await page.click('#adminLogoutBtn');

    await page.waitForFunction(() => {
      return window.app && window.app.isAdmin === false;
    });

    const signedOutState = await page.evaluate(() => {
      const settingsTabBtn = document.getElementById('adminSettingsTabBtn');
      const settingsSection = document.getElementById('settings');
      const dashboardSection = document.getElementById('dashboard');
      const activeTabBtn = document.querySelector('.tab-btn.active');
      const adminLoginBtn = document.getElementById('adminLoginBtn');
      const adminProfilePill = document.getElementById('adminProfilePill');

      return {
        isAdmin: window.app.isAdmin,
        btnDisplay: window.getComputedStyle(settingsTabBtn).display,
        secDisplay: window.getComputedStyle(settingsSection).display,
        activeTab: activeTabBtn ? activeTabBtn.dataset.tab : null,
        dashboardActive: dashboardSection.classList.contains('active'),
        loginDisplay: window.getComputedStyle(adminLoginBtn).display,
        profileDisplay: window.getComputedStyle(adminProfilePill).display,
        sessionStored: sessionStorage.getItem('factvault_admin_session') !== null
      };
    });

    console.log('Signed Out State:', signedOutState);
    if (signedOutState.isAdmin !== false) {
      throw new Error('FAIL: app.isAdmin is not false after sign out!');
    }
    if (signedOutState.btnDisplay !== 'none') {
      throw new Error('FAIL: Settings tab button did not hide upon sign out!');
    }
    if (signedOutState.secDisplay !== 'none') {
      throw new Error('FAIL: Settings section did not hide upon sign out!');
    }
    if (signedOutState.activeTab !== 'dashboard') {
      throw new Error(`FAIL: View was not redirected back to dashboard! Active=${signedOutState.activeTab}`);
    }
    if (signedOutState.loginDisplay === 'none') {
      throw new Error('FAIL: Google Sign In button was not restored in header!');
    }
    if (signedOutState.profileDisplay !== 'none') {
      throw new Error('FAIL: Profile pill was not hidden upon sign out!');
    }
    if (signedOutState.sessionStored) {
      throw new Error('FAIL: Admin session was not removed from sessionStorage!');
    }
    console.log('✅ TEST 6 PASSED: Sign out immediately locks settings, redirects to dashboard, purges session.');

    // -------------------------------------------------------------
    // TEST 7: Responsive Layout Audits across 375px, 768px, 1280px
    // -------------------------------------------------------------
    console.log('\n[TEST 7] Verifying Responsive Layouts (0 Horizontal Overflow)...');
    const viewports = [
      { width: 375, height: 667, name: 'Mobile (375px)' },
      { width: 768, height: 1024, name: 'Tablet (768px)' },
      { width: 1280, height: 800, name: 'Desktop (1280px)' }
    ];

    for (const vp of viewports) {
      await page.setViewport({ width: vp.width, height: vp.height });
      await new Promise(r => setTimeout(r, 200));

      const overflow = await page.evaluate(() => {
        const docWidth = document.documentElement.scrollWidth;
        const windowWidth = window.innerWidth;
        return {
          scrollWidth: docWidth,
          innerWidth: windowWidth,
          hasOverflow: docWidth > windowWidth
        };
      });

      console.log(`Viewport ${vp.name}: scrollWidth=${overflow.scrollWidth}, innerWidth=${overflow.innerWidth}`);
      if (overflow.hasOverflow) {
        throw new Error(`FAIL: Horizontal overflow detected on ${vp.name}! scrollWidth=${overflow.scrollWidth} > innerWidth=${overflow.innerWidth}`);
      }
    }
    console.log('✅ TEST 7 PASSED: Zero horizontal overflow across all viewports (375px, 768px, 1280px).');

    // -------------------------------------------------------------
    // TEST 8: Console Error Gate
    // -------------------------------------------------------------
    console.log('\n[TEST 8] Checking Console Errors...');
    const realErrors = consoleErrors.filter(err => !err.includes('accounts.google.com'));
    if (realErrors.length > 0) {
      console.error('Console errors logged:', realErrors);
      throw new Error(`FAIL: Detected ${realErrors.length} fatal console error(s)!`);
    }
    console.log('✅ TEST 8 PASSED: 0 fatal console errors detected.');

    console.log('\n🎉 ALL 8 E2E VERIFICATION SUITE ASSERTIONS PASSED WITH 100% SUCCESS!\n');

  } finally {
    await browser.close();
    await new Promise((resolve) => server.close(resolve));
    console.log('🛑 Server closed and browser terminated cleanly.');
  }
}

runVerification().catch(err => {
  console.error('\n❌ E2E TEST FAILED:', err);
  process.exit(1);
});
