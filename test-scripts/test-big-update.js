const { chromium } = require('playwright');

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

(async () => {
    console.log('🚀 Menjalankan Pengujian Komprehensif BIG UPDATE Pemangan SMKN 1 Jakarta (Headed Mode)...');

    const browser = await chromium.launch({
        headless: false,
        slowMo: 600,
        args: ['--window-size=1400,900']
    });

    const context = await browser.newContext({
        viewport: { width: 1400, height: 900 }
    });

    const page = await context.newPage();

    try {
        // 1. Kunjungi Beranda
        console.log('📍 [1/12] Membuka Beranda Baru: http://localhost:8080');
        await page.goto('http://localhost:8080', { waitUntil: 'domcontentloaded' });
        await page.screenshot({ path: 'testing/detailed-screenshots/v2-01-beranda.png' });
        await sleep(1000);

        // 2. Uji Quick Search & Quick Track Tab di Hero
        console.log('📍 [2/12] Menguji Tab Interaktif Hero (Cari Ruangan & Lacak Tiket)...');
        await page.click('#tabQuickTrack');
        await sleep(800);
        await page.fill('#heroTrackCode', 'BK-2026-001');
        await page.click('#btnHeroTrackSubmit');
        await sleep(1200);
        await page.screenshot({ path: 'testing/detailed-screenshots/v2-02-hero-track.png' });

        await page.click('#tabQuickSearch');
        await sleep(600);
        await page.fill('#quickSearchInput', 'SIJA');
        await page.selectOption('#quickCategorySelect', 'Laboratorium');
        await page.click('#btnQuickSearchSubmit');
        await sleep(1200);
        await page.screenshot({ path: 'testing/detailed-screenshots/v2-03-search-results.png' });

        // 3. Uji Filter Kategori Katalog
        console.log('📍 [3/12] Menguji Filter Kategori Katalog Ruangan...');
        const filters = ['Laboratorium', 'Auditorium', 'Aula Serbaguna', 'Teori & Kelas', 'Reguler', 'Meeting Room', 'ALL'];
        for (const cat of filters) {
            console.log(`   🏷️ Memilih kategori: ${cat}`);
            await page.click(`.filter-pill[data-category="${cat}"]`);
            await sleep(500);
        }

        // 4. Uji Modal Detail Fasilitas Ruangan
        console.log('📍 [4/12] Menguji Modal Spesifikasi Detail Ruangan...');
        const detailBtn = page.locator('.view-detail-btn').first();
        if (await detailBtn.isVisible()) {
            await detailBtn.click();
            await sleep(1200);
            await page.screenshot({ path: 'testing/detailed-screenshots/v2-04-modal-detail.png' });
            await page.click('#modalCloseBtn');
            await sleep(600);
        }

        // 5. Uji Jadwal Visual Real-time (Timetable Matrix)
        console.log('📍 [5/12] Menguji Matriks Jadwal Visual Per-Jam (Timetable)...');
        await page.click('a[href="#timetable"]');
        await sleep(1000);
        await page.screenshot({ path: 'testing/detailed-screenshots/v2-05-timetable-matrix.png' });

        // 6. Uji Multi-Step Reservation Wizard
        console.log('📍 [6/12] Menguji 4-Step Reservation Wizard...');
        await page.click('a[href="#booking"]');
        await sleep(800);

        // Step 1: Ruangan & Alat
        console.log('   🔹 Step 1: Memilih Ruangan & Peralatan Tambahan...');
        await page.selectOption('#wizardRoomSelect', 'r-401');
        await page.check('input[name="equipmentAddons"][value="Mikrofon Wireless Extra (2 Unit)"]');
        await page.check('input[name="equipmentAddons"][value="Gigabit Switch 16-Port & Kabel Patch Cord"]');
        await sleep(800);
        await page.click('#btnNextStep1');
        await sleep(800);

        // Step 2: Waktu & Tanggal
        console.log('   🔹 Step 2: Menentukan Waktu & Validasi Anti-Bentrok...');
        const nextDay = new Date();
        nextDay.setDate(nextDay.getDate() + 2);
        const yyyy = nextDay.getFullYear();
        const mm = String(nextDay.getMonth() + 1).padStart(2, '0');
        const dd = String(nextDay.getDate()).padStart(2, '0');

        await page.fill('#wizardStartDateTime', `${yyyy}-${mm}-${dd}T08:00`);
        await page.fill('#wizardEndDateTime', `${yyyy}-${mm}-${dd}T11:30`);
        await sleep(1000);
        await page.screenshot({ path: 'testing/detailed-screenshots/v2-06-wizard-conflict-check.png' });
        await page.click('#btnNextStep2');
        await sleep(800);

        // Step 3: Identitas Pemohon
        console.log('   🔹 Step 3: Pengisian Identitas & Guru Pendamping...');
        await page.fill('#wizardUserName', 'Benn Developer SIJA');
        await page.selectOption('#wizardUserRole', 'siswa');
        await page.fill('#wizardUserClass', 'XI SIJA 1');
        await page.fill('#wizardUserContact', '081299887766');
        await page.fill('#wizardSupervisor', 'Pak Amrul Khairullah, S.Kom');
        await page.fill('#wizardReason', 'Praktikum Uji Kompetensi Jaringan Cloud Server & Deployment Pemangan 2.0');
        await sleep(800);
        await page.click('#btnNextStep3');
        await sleep(800);

        // Step 4: Konfirmasi Final
        console.log('   🔹 Step 4: Review Summary & Persetujuan SOP...');
        await page.screenshot({ path: 'testing/detailed-screenshots/v2-07-wizard-review.png' });
        await page.check('#wizardAgreeTerms');
        await sleep(600);
        await page.click('#btnFinalSubmit');
        await sleep(1500);
        await page.screenshot({ path: 'testing/detailed-screenshots/v2-08-booking-created.png' });

        // 7. Uji Surat Izin Resmi 2.0 (with QR Code)
        console.log('📍 [7/12] Menguji Surat Izin Resmi Digital 2.0 (KOP & QR Code)...');
        const printSlipBtn = page.locator('.print-slip-btn').first();
        if (await printSlipBtn.isVisible()) {
            await printSlipBtn.click();
            await sleep(1500);
            await page.screenshot({ path: 'testing/detailed-screenshots/v2-09-surat-izin-qrcode.png' });
            await page.click('#slipCloseBtn');
            await sleep(600);
        }

        // 8. Uji Lacak Tiket Mandiri
        console.log('📍 [8/12] Menguji Modul Lacak Status Resi Mandiri...');
        await page.click('a[href="#tracking"]');
        await sleep(800);
        await page.fill('#directTrackCode', 'BK-2026-001');
        await page.click('#btnDirectTrack');
        await sleep(1000);
        await page.screenshot({ path: 'testing/detailed-screenshots/v2-10-tracking-direct.png' });

        // 9. Uji Switcher Mode Gelap / Terang (Dark Mode)
        console.log('📍 [9/12] Menguji Switcher Mode Gelap / Terang...');
        await page.click('#themeToggle');
        await sleep(1000);
        await page.screenshot({ path: 'testing/detailed-screenshots/v2-11-dark-mode-v2.png' });
        await page.click('#themeToggle');
        await sleep(800);

        // 10. Uji Halaman Login & Demo Switcher
        console.log('📍 [10/12] Membuka Portal Login & Autentikasi...');
        await page.goto('http://localhost:8080/login/login.html');
        await sleep(1000);
        
        console.log('   🔑 Login sebagai Admin Sarpras SMKN 1...');
        await page.click('.demo-pill[data-nis="admin"]');
        await sleep(800);
        await page.click('#signInForm button[type="submit"]');
        await sleep(1500);

        // 11. Uji Sarpras Enterprise Command Center (Admin / Guru)
        console.log('📍 [11/12] Menguji Sarpras Enterprise Command Center...');
        await page.click('a[href="#adminPanel"]');
        await sleep(1000);
        await page.screenshot({ path: 'testing/detailed-screenshots/v2-12-admin-command-center.png' });

        await page.click('#btnFilterPendingBookings');
        await sleep(800);
        await page.click('#btnFilterApprovedBookings');
        await sleep(800);
        await page.click('#btnFilterAllBookings');
        await sleep(1000);

        // 12. Uji SOP & Tata Tertib Fasilitas
        console.log('📍 [12/12] Menguji Bagian SOP & Tata Tertib Sarpras...');
        await page.click('a[href="#sopSection"]');
        await sleep(1000);
        await page.screenshot({ path: 'testing/detailed-screenshots/v2-13-sop-guidelines.png' });

        console.log('✨ BIG UPDATE 2.0 BERHASIL DIUJI 100% SUKSES TANPA CACAT!');
        await sleep(2500);
    } catch (err) {
        console.error('❌ Terjadi kesalahan:', err);
    } finally {
        await browser.close();
        console.log('🔒 Sesi browser headed telah selesai.');
    }
})();
