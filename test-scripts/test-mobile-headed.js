const { chromium } = require('playwright');

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

(async () => {
    console.log('📱 Menjalankan Pengujian Khusus Mobile UI/UX Pemangan (390x844 Touch Screen)...');

    const browser = await chromium.launch({
        headless: false,
        slowMo: 400,
        args: ['--window-size=450,920']
    });

    const context = await browser.newContext({
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true,
        deviceScaleFactor: 2
    });

    const page = await context.newPage();

    try {
        // 1. Kunjungi Beranda di Layar Mobile
        console.log('📍 [1/6] Membuka Beranda Mobile...');
        await page.goto('http://localhost:8080', { waitUntil: 'domcontentloaded' });
        await sleep(1000);
        await page.screenshot({ path: 'testing/detailed-screenshots/mobile-01-beranda.png' });
        await page.screenshot({ path: 'docs/screenshots/03-mobile-view.png' });

        // 2. Uji Hamburger Drawer Navigation & Mobile Profile
        console.log('📍 [2/6] Membuka Drawer Menu Mobile...');
        await page.locator('#burgerToggle').click({ force: true });
        await sleep(1000);
        await page.screenshot({ path: 'testing/detailed-screenshots/mobile-02-drawer-menu.png' });
        await page.locator('#burgerToggle').click({ force: true });
        await sleep(600);

        // 3. Uji Timetable Sticky Column di Mobile
        console.log('📍 [3/6] Menguji Jadwal Visual Matriks di Mobile...');
        await page.locator('#mobileFloatingBar a[href="#timetable"]').click({ force: true });
        await sleep(1000);
        await page.screenshot({ path: 'testing/detailed-screenshots/mobile-03-timetable.png' });

        // 4. Uji Multi-Step Wizard di Layar Mobile
        console.log('📍 [4/6] Menguji 4-Step Booking Wizard di Layar Mobile...');
        await page.locator('#mobileFloatingBar a[href="#booking"]').click({ force: true });
        await sleep(800);

        await page.selectOption('#wizardRoomSelect', 'r-401');
        await sleep(500);
        await page.locator('#btnNextStep1').click({ force: true });
        await sleep(800);

        const nextDay = new Date();
        nextDay.setDate(nextDay.getDate() + 3);
        const yyyy = nextDay.getFullYear();
        const mm = String(nextDay.getMonth() + 1).padStart(2, '0');
        const dd = String(nextDay.getDate()).padStart(2, '0');

        await page.fill('#wizardStartDateTime', `${yyyy}-${mm}-${dd}T09:00`);
        await page.fill('#wizardEndDateTime', `${yyyy}-${mm}-${dd}T12:00`);
        await sleep(600);
        await page.locator('#btnNextStep2').click({ force: true });
        await sleep(800);

        await page.fill('#wizardUserName', 'Siswa Mobile SIJA');
        await page.fill('#wizardUserClass', 'XI SIJA 1');
        await page.fill('#wizardUserContact', '081234567890');
        await page.fill('#wizardSupervisor', 'Pak Amrul Khairullah, S.Kom');
        await page.fill('#wizardReason', 'Simulasi Ujian Berbasis Komputer di Lab SIJA');
        await sleep(600);
        await page.locator('#btnNextStep3').click({ force: true });
        await sleep(800);
        await page.screenshot({ path: 'testing/detailed-screenshots/mobile-04-wizard-step4.png' });

        await page.check('#wizardAgreeTerms', { force: true });
        await sleep(500);
        await page.locator('#btnFinalSubmit').click({ force: true });
        await sleep(1500);

        // 5. Uji Mobile Ticket Tracking
        console.log('📍 [5/6] Menguji Lacak Status Resi di Mobile...');
        await page.locator('#mobileFloatingBar a[href="#tracking"]').click({ force: true });
        await sleep(800);
        await page.fill('#directTrackCode', 'BK-2026-001');
        await page.locator('#btnDirectTrack').click({ force: true });
        await sleep(1200);
        await page.screenshot({ path: 'testing/detailed-screenshots/mobile-05-tracking-receipt.png' });

        // 6. Uji Login & Admin Responsive Cards di Layar Mobile
        console.log('📍 [6/6] Login Admin & Cek Tampilan Tabel Responsif Kartu di Mobile...');
        await page.goto('http://localhost:8080/login/login.html');
        await sleep(1000);
        await page.locator('.demo-pill[data-nis="admin"]').click({ force: true });
        await sleep(600);
        await page.locator('#signInForm button[type="submit"]').click({ force: true });
        await sleep(1500);

        await page.locator('#burgerToggle').click({ force: true });
        await sleep(600);
        await page.locator('a[href="#adminPanel"]').click({ force: true });
        await sleep(1200);
        await page.screenshot({ path: 'testing/detailed-screenshots/mobile-06-admin-cards.png' });

        console.log('📱 SEMUA PENGUJIAN MOBILE UI/UX BERHASIL 100% SUKSES!');
        await sleep(1500);
    } catch (err) {
        console.error('❌ Terjadi kesalahan pengujian mobile:', err);
    } finally {
        await browser.close();
        console.log('🔒 Sesi browser mobile selesai.');
    }
})();
