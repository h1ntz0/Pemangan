const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '../testing/audit-screenshots');
if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
}

async function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
}

(async () => {
    console.log('🚀 Menjalankan visual inspection audit menyeluruh...');
    const browser = await chromium.launch({
        headless: false,
        slowMo: 300,
        args: ['--window-size=1440,900']
    });

    // 1. Desktop Context
    const desktop = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await desktop.newPage();

    // Guest / Public view
    await page.goto('http://localhost:8080', { waitUntil: 'networkidle' });
    await sleep(800);
    await page.screenshot({ path: path.join(outDir, '01-desktop-hero.png') });

    // Scroll to Rooms
    await page.evaluate(() => document.getElementById('rooms')?.scrollIntoView());
    await sleep(800);
    await page.screenshot({ path: path.join(outDir, '02-desktop-rooms.png') });

    // Open detail modal
    const detailBtn = page.locator('.view-detail-btn, button:has-text("Detail")').first();
    if (await detailBtn.isVisible()) {
        await detailBtn.click();
        await sleep(600);
        await page.screenshot({ path: path.join(outDir, '03-desktop-room-modal.png') });
        await page.click('#closeDetailModalBtn, #modalCloseBtn');
        await sleep(400);
    }

    // Scroll to Timetable
    await page.evaluate(() => document.getElementById('timetable')?.scrollIntoView());
    await sleep(800);
    await page.screenshot({ path: path.join(outDir, '04-desktop-timetable.png') });

    // Scroll to Booking Wizard
    await page.evaluate(() => document.getElementById('booking')?.scrollIntoView());
    await sleep(800);
    await page.screenshot({ path: path.join(outDir, '05-desktop-wizard-step1.png') });

    // Wizard Step 2 & 3 & 4
    await page.selectOption('#wzRoomSelect', 'r-401');
    await page.click('#btnWzNext1');
    await sleep(400);
    await page.screenshot({ path: path.join(outDir, '06-desktop-wizard-step2.png') });

    const dt = new Date();
    dt.setDate(dt.getDate() + 3);
    const dStr = dt.toISOString().slice(0, 10);
    await page.fill('#wzStartTime', `${dStr}T08:00`);
    await page.fill('#wzEndTime', `${dStr}T10:00`);
    await page.click('#btnWzNext2');
    await sleep(400);
    await page.screenshot({ path: path.join(outDir, '07-desktop-wizard-step3.png') });

    await page.fill('#wzUserName', 'Ahmad Test');
    await page.selectOption('#wzUserRole', 'siswa');
    await page.fill('#wzUserClass', 'XII RPL 2');
    await page.fill('#wzUserContact', '081299998888');
    await page.fill('#wzSupervisor', 'Pak Rian Firmansyah');
    await page.fill('#wzReason', 'Simulasi Proyek Akhir Web Application');
    await page.click('#btnWzNext3');
    await sleep(400);
    await page.screenshot({ path: path.join(outDir, '08-desktop-wizard-step4.png') });

    // Scroll to Tracking
    await page.evaluate(() => document.getElementById('tracking')?.scrollIntoView());
    await sleep(600);
    await page.fill('#directTrackInput', 'BK-2026-001');
    await page.click('#btnDirectTrackExecute');
    await sleep(600);
    await page.screenshot({ path: path.join(outDir, '09-desktop-tracking.png') });

    // Scroll to SOP
    await page.evaluate(() => document.getElementById('sop')?.scrollIntoView());
    await sleep(600);
    await page.screenshot({ path: path.join(outDir, '10-desktop-sop.png') });

    // Scroll to Footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await sleep(600);
    await page.screenshot({ path: path.join(outDir, '11-desktop-footer.png') });

    // Dark Mode check
    await page.click('#themeToggleBtn');
    await sleep(600);
    await page.screenshot({ path: path.join(outDir, '12-desktop-dark-hero.png') });
    await page.click('#themeToggleBtn');
    await sleep(400);

    // 2. Login Page
    await page.goto('http://localhost:8080/login/login.html');
    await sleep(600);
    await page.screenshot({ path: path.join(outDir, '13-login-page.png') });

    // Test Siswa Login
    await page.click('.demo-pill[data-nis="102144"]');
    await sleep(300);
    await page.click('#signInForm button[type="submit"]');
    await sleep(1000);
    await page.screenshot({ path: path.join(outDir, '14-logged-in-siswa.png') });

    // Test Admin Login
    await page.goto('http://localhost:8080/login/login.html');
    await sleep(500);
    await page.click('.demo-pill[data-nis="admin"]');
    await sleep(300);
    await page.click('#signInForm button[type="submit"]');
    await sleep(1000);

    // Switch to Admin Suite
    await page.click('#navAdminSuiteBtn');
    await sleep(800);
    await page.screenshot({ path: path.join(outDir, '15-admin-suite-bookings.png') });

    // Admin Suite Rooms tab
    await page.click('.adm-tab-btn[data-tab="rooms"]');
    await sleep(600);
    await page.screenshot({ path: path.join(outDir, '16-admin-suite-rooms.png') });

    // Test Guru Login
    await page.goto('http://localhost:8080/login/login.html');
    await sleep(500);
    await page.click('.demo-pill[data-nis="19800101"]');
    await sleep(300);
    await page.click('#signInForm button[type="submit"]');
    await sleep(1000);
    await page.click('#navAdminSuiteBtn');
    await sleep(800);
    await page.screenshot({ path: path.join(outDir, '17-guru-suite.png') });

    await desktop.close();

    // 3. Mobile View (iPhone 14 / Pixel 7 style)
    const mobile = await browser.newContext({
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true
    });
    const mPage = await mobile.newPage();
    await mPage.goto('http://localhost:8080');
    await sleep(600);
    await mPage.screenshot({ path: path.join(outDir, '18-mobile-hero.png') });

    await mPage.click('#mobileMenuBtn');
    await sleep(400);
    await mPage.screenshot({ path: path.join(outDir, '19-mobile-drawer.png') });
    await mPage.click('#closeDrawerBtn');
    await sleep(300);

    await mPage.evaluate(() => document.getElementById('timetable')?.scrollIntoView());
    await sleep(600);
    await mPage.screenshot({ path: path.join(outDir, '20-mobile-timetable.png') });

    await mobile.close();
    await browser.close();
    console.log('✅ Visual inspection audit selesai!');
})();
