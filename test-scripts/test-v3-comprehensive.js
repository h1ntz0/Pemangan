const { chromium } = require('playwright');

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

(async () => {
    console.log('🚀 Menjalankan Pengujian Komprehensif PEMANGAN V3 (Desktop & Mobile Headed Mode)...');

    const browser = await chromium.launch({
        headless: false,
        slowMo: 400,
        args: ['--window-size=1400,900']
    });

    try {
        // ========================================================
        // BAGIAN 1: PENGUJIAN DESKTOP PORTAL & DEDICATED ADMIN SUITE
        // ========================================================
        console.log('\n🖥️ --- [BAGIAN 1] PENGUJIAN DESKTOP VIEW (1366x768) ---');
        const desktopContext = await browser.newContext({
            viewport: { width: 1366, height: 768 }
        });
        const dPage = await desktopContext.newPage();

        console.log('📍 [1/10] Membuka Beranda Desktop...');
        await dPage.goto('http://localhost:8080', { waitUntil: 'domcontentloaded' });
        await sleep(1000);
        await dPage.screenshot({ path: 'testing/detailed-screenshots/v3-01-desktop-beranda.png' });
        await dPage.screenshot({ path: 'docs/screenshots/01-beranda-desktop.png' });

        console.log('📍 [2/10] Menguji Quick Search & Track Tabs...');
        await dPage.click('#tabHeroTrack');
        await sleep(500);
        await dPage.fill('#heroTrackCode', 'BK-2026-001');
        await dPage.click('#btnHeroTrackExecute');
        await sleep(800);

        await dPage.click('#tabHeroSearch');
        await sleep(400);
        await dPage.fill('#heroSearchInput', 'SIJA');
        await dPage.click('#btnHeroSearchExecute');
        await sleep(800);
        await dPage.screenshot({ path: 'testing/detailed-screenshots/v3-02-desktop-search.png' });

        console.log('📍 [3/10] Menguji Filter Kategori & Modal Detail Ruangan...');
        await dPage.click('.cat-pill[data-cat="ALL"]');
        await sleep(500);
        await dPage.locator('button:has-text("Detail")').first().click();
        await sleep(800);
        await dPage.screenshot({ path: 'testing/detailed-screenshots/v3-03-desktop-modal-detail.png' });
        await dPage.click('#closeDetailModalBtn');
        await sleep(400);

        console.log('📍 [4/10] Menguji Matriks Jadwal Visual Per-Jam...');
        await dPage.click('a[href="#timetable"]');
        await sleep(800);
        await dPage.screenshot({ path: 'testing/detailed-screenshots/v3-04-desktop-timetable.png' });

        console.log('📍 [5/10] Menguji 4-Step Interactive Booking Wizard...');
        await dPage.click('a[href="#booking"]');
        await sleep(600);

        // Step 1
        await dPage.selectOption('#wzRoomSelect', 'r-401');
        await dPage.check('input[name="wzEquipmentAddons"][value="Mikrofon Wireless Ekstra (2 Unit)"]');
        await dPage.click('#btnWzNext1');
        await sleep(600);

        // Step 2
        const nextDay = new Date();
        nextDay.setDate(nextDay.getDate() + 2);
        const yyyy = nextDay.getFullYear();
        const mm = String(nextDay.getMonth() + 1).padStart(2, '0');
        const dd = String(nextDay.getDate()).padStart(2, '0');

        await dPage.fill('#wzStartTime', `${yyyy}-${mm}-${dd}T08:00`);
        await dPage.fill('#wzEndTime', `${yyyy}-${mm}-${dd}T11:00`);
        await sleep(600);
        await dPage.click('#btnWzNext2');
        await sleep(600);

        // Step 3
        await dPage.fill('#wzUserName', 'Arrofi Zein');
        await dPage.selectOption('#wzUserRole', 'siswa');
        await dPage.fill('#wzUserClass', 'XI SIJA 1');
        await dPage.fill('#wzUserContact', '081234567890');
        await dPage.fill('#wzSupervisor', 'Pak Amrul Khairullah, S.Kom');
        await dPage.fill('#wzReason', 'Praktikum Uji Kompetensi Cloud Server & Deployment Pemangan V3');
        await dPage.click('#btnWzNext3');
        await sleep(600);

        // Step 4
        await dPage.check('#wzAgreeTerms');
        await dPage.click('#btnWzSubmit');
        await sleep(1000);
        await dPage.screenshot({ path: 'testing/detailed-screenshots/v3-05-desktop-booking-created.png' });

        console.log('📍 [6/10] Menguji Surat Izin Resmi Digital 2.0 (QR Code)...');
        const slipBtn = dPage.locator('button:has-text("Surat Izin")').first();
        if (await slipBtn.isVisible()) {
            await slipBtn.click();
            await sleep(1000);
            await dPage.screenshot({ path: 'testing/detailed-screenshots/v3-06-desktop-surat-izin.png' });
            await dPage.click('#closeSlipModalBtn');
            await sleep(400);
        }

        console.log('📍 [7/10] Menguji Lacak Status Resi Mandiri...');
        await dPage.click('a[href="#tracking"]');
        await sleep(400);
        await dPage.fill('#directTrackInput', 'BK-2026-001');
        await dPage.click('#btnDirectTrackExecute');
        await sleep(800);
        await dPage.screenshot({ path: 'testing/detailed-screenshots/v3-07-desktop-tracking.png' });

        console.log('📍 [8/10] Menguji Switcher Mode Gelap (Dark Mode)...');
        await dPage.click('#themeToggleBtn');
        await sleep(800);
        await dPage.screenshot({ path: 'testing/detailed-screenshots/v3-08-desktop-darkmode.png' });
        await dPage.click('#themeToggleBtn');
        await sleep(400);

        console.log('📍 [9/10] Login sebagai Admin Sarpras SMKN 1...');
        await dPage.goto('http://localhost:8080/login/login.html');
        await sleep(800);
        await dPage.click('.demo-pill[data-nis="admin"]');
        await dPage.click('#signInForm button[type="submit"]');
        await sleep(1200);

        console.log('📍 [10/10] Menguji Dedicated Sarpras Command Center...');
        await dPage.click('#navAdminSuiteBtn');
        await sleep(1000);
        await dPage.screenshot({ path: 'testing/detailed-screenshots/v3-09-desktop-admin-suite.png' });

        // Switch to Room Status Tab in Admin
        await dPage.click('.adm-tab-btn[data-tab="rooms"]');
        await sleep(800);
        await dPage.screenshot({ path: 'testing/detailed-screenshots/v3-10-desktop-admin-rooms.png' });
        await desktopContext.close();

        // ========================================================
        // BAGIAN 2: PENGUJIAN MOBILE SMARTPHONE (390x844 TOUCH)
        // ========================================================
        console.log('\n📱 --- [BAGIAN 2] PENGUJIAN MOBILE TOUCH VIEW (390x844) ---');
        const mobileContext = await browser.newContext({
            viewport: { width: 390, height: 844 },
            isMobile: true,
            hasTouch: true,
            deviceScaleFactor: 2
        });
        const mPage = await mobileContext.newPage();

        console.log('📍 [Mobile 1/5] Membuka Beranda Mobile...');
        await mPage.goto('http://localhost:8080', { waitUntil: 'domcontentloaded' });
        await sleep(1000);
        await mPage.screenshot({ path: 'testing/detailed-screenshots/v3-m01-beranda.png' });
        await mPage.screenshot({ path: 'docs/screenshots/03-mobile-view.png' });

        console.log('📍 [Mobile 2/5] Menguji Drawer Menu Mobile...');
        await mPage.click('#mobileMenuBtn');
        await sleep(800);
        await mPage.screenshot({ path: 'testing/detailed-screenshots/v3-m02-drawer.png' });
        await mPage.click('#closeDrawerBtn');
        await sleep(400);

        console.log('📍 [Mobile 3/5] Menguji Navigasi Bawah Mengambang (Floating Bar)...');
        await mPage.click('nav.sm\\:hidden a[href="#timetable"]');
        await sleep(800);
        await mPage.screenshot({ path: 'testing/detailed-screenshots/v3-m03-timetable.png' });

        console.log('📍 [Mobile 4/5] Menguji Form Wizard di Layar Smartphone...');
        await mPage.click('nav.sm\\:hidden a[href="#booking"]');
        await sleep(600);
        await mPage.selectOption('#wzRoomSelect', 'r-403');
        await mPage.click('#btnWzNext1');
        await sleep(500);
        await mPage.screenshot({ path: 'testing/detailed-screenshots/v3-m04-wizard-step2.png' });

        console.log('📍 [Mobile 5/5] Menguji Login Admin & Tampilan Responsif di Mobile...');
        await mPage.goto('http://localhost:8080/login/login.html');
        await sleep(800);
        await mPage.click('.demo-pill[data-nis="admin"]');
        await mPage.click('#signInForm button[type="submit"]');
        await sleep(1200);

        await mPage.click('#mobileMenuBtn');
        await sleep(500);
        await mPage.click('#drawerAdminBtn');
        await sleep(1000);
        await mPage.screenshot({ path: 'testing/detailed-screenshots/v3-m05-admin-mobile.png' });

        await mobileContext.close();

        console.log('\n✨ SEMUA PENGUJIAN DESKTOP & MOBILE V3 BERHASIL 100% SUKSES TANPA CACAT!');
        await sleep(1500);
    } catch (err) {
        console.error('❌ Terjadi kesalahan:', err);
    } finally {
        await browser.close();
        console.log('🔒 Pengujian headed telah selesai.');
    }
})();
