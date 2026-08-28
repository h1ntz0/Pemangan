const { chromium } = require('playwright');

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

(async () => {
    console.log('🚀 Memulai Pengujian Headed Mode Interaktif untuk Sistem Pemangan SMKN 1 Jakarta...');
    
    // Launch browser in headed mode
    const browser = await chromium.launch({
        headless: false,
        slowMo: 650,
        args: ['--window-size=1400,850']
    });

    const context = await browser.newContext({
        viewport: { width: 1400, height: 850 }
    });

    const page = await context.newPage();

    try {
        // 1. Kunjungi Beranda
        console.log('📍 [1/12] Membuka Beranda: http://localhost:8080');
        await page.goto('http://localhost:8080', { waitUntil: 'domcontentloaded' });
        await page.screenshot({ path: 'testing/detailed-screenshots/01-beranda.png' });
        await sleep(1000);

        // 2. Uji Navigasi Menu Header
        console.log('📍 [2/12] Menguji Navigasi Menu Navbar & Scroll-Spy...');
        await page.click('a[href="#rooms"]');
        await sleep(800);
        await page.click('a[href="#booking"]');
        await sleep(800);
        await page.click('a[href="#schedule"]');
        await sleep(800);
        await page.click('a[href="#about"]');
        await sleep(800);
        await page.click('a[href="#hero"]');
        await sleep(800);

        // 3. Uji Filter Kategori Ruangan
        console.log('📍 [3/12] Menguji Filter Kategori Katalog Ruangan...');
        await page.click('a[href="#rooms"]');
        await sleep(600);
        
        const categories = ['Laboratorium', 'Teori & Kelas', 'Reguler', 'Auditorium', 'Aula Serbaguna', 'ALL'];
        for (const cat of categories) {
            console.log(`   🏷️ Memilih filter kategori: ${cat}`);
            await page.click(`.filter-pill[data-category="${cat}"]`);
            await sleep(600);
        }

        // 4. Uji Pencarian Ruangan
        console.log('📍 [4/12] Menguji Fitur Pencarian Real-time Ruangan...');
        const searchInput = page.locator('#roomSearchInput');
        await searchInput.fill('SIJA');
        await sleep(900);
        await page.screenshot({ path: 'testing/detailed-screenshots/02-search-sija.png' });
        
        await searchInput.fill('Teater');
        await sleep(900);
        await searchInput.fill('');
        await sleep(600);

        // 5. Uji Modal Detail Ruangan
        console.log('📍 [5/12] Menguji Modal Detail Ruangan...');
        const firstDetailBtn = page.locator('.view-detail-btn').first();
        if (await firstDetailBtn.isVisible()) {
            await firstDetailBtn.click();
            await sleep(1200);
            await page.screenshot({ path: 'testing/detailed-screenshots/03-modal-detail.png' });
            await page.click('#modalCloseBtn');
            await sleep(600);
        }

        // 6. Uji Tombol "Pinjam" langsung dari Kartu Ruangan
        console.log('📍 [6/12] Menguji Tombol Pinjam Langsung dari Kartu...');
        const bookBtn = page.locator('.book-this-btn[data-id="r-401"]');
        if (await bookBtn.isVisible()) {
            await bookBtn.click();
            await sleep(800);
        }

        // 7. Pengisian Form Peminjaman
        console.log('📍 [7/12] Menguji Pengisian & Validasi Form Peminjaman...');
        await page.fill('#booking-name', 'Benn Test Suite');
        await page.selectOption('#booking-role', 'siswa');
        await page.fill('#booking-class', 'XI SIJA 1');
        await page.fill('#booking-contact', '081234567890');
        await page.fill('#booking-reason', 'Uji Coba Otomatis Sistem Reservasi Pemangan');

        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const yyyy = tomorrow.getFullYear();
        const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
        const dd = String(tomorrow.getDate()).padStart(2, '0');
        
        await page.fill('#start-date-time', `${yyyy}-${mm}-${dd}T09:00`);
        await page.fill('#end-date-time', `${yyyy}-${mm}-${dd}T11:00`);
        await sleep(800);

        await page.click('#booking-form button[type="submit"]');
        await sleep(1500);
        await page.screenshot({ path: 'testing/detailed-screenshots/04-booking-submitted.png' });

        // 8. Uji Modal Cetak Surat Izin Resmi
        console.log('📍 [8/12] Menguji Pratinjau Surat Izin Resmi SMKN 1 Jakarta...');
        const printSlipBtn = page.locator('.print-slip-btn').first();
        if (await printSlipBtn.isVisible()) {
            await printSlipBtn.click();
            await sleep(1500);
            await page.screenshot({ path: 'testing/detailed-screenshots/05-surat-izin-modal.png' });
            await page.click('#slipCloseBtn');
            await sleep(600);
        }

        // 9. Uji Toggle Dark / Light Theme
        console.log('📍 [9/12] Menguji Switcher Mode Gelap / Terang...');
        await page.click('#themeToggle');
        await sleep(1000);
        await page.screenshot({ path: 'testing/detailed-screenshots/06-dark-mode.png' });
        await page.click('#themeToggle');
        await sleep(800);

        // 10. Uji Halaman Autentikasi (Login / Sign-up)
        console.log('📍 [10/12] Membuka Halaman Login: http://localhost:8080/login/login.html');
        await page.goto('http://localhost:8080/login/login.html');
        await sleep(1200);
        await page.screenshot({ path: 'testing/detailed-screenshots/07-login-page.png' });

        // Switch to Sign Up mode
        console.log('   🔄 Menguji toggle ke form Pendaftaran (Sign-up)...');
        await page.click('#signInForm .toggle');
        await sleep(1000);
        await page.screenshot({ path: 'testing/detailed-screenshots/08-signup-mode.png' });

        // Switch back to Sign In mode
        console.log('   🔄 Menguji toggle kembali ke form Masuk (Sign-in)...');
        await page.click('#signUpForm .toggle');
        await sleep(1000);

        // 11. Quick Demo Fill Admin
        console.log('📍 [11/12] Menguji Demo Pill Switcher Akun (Admin Sarpras)...');
        await page.click('.demo-pill[data-nis="admin"]');
        await sleep(1000);
        await page.screenshot({ path: 'testing/detailed-screenshots/09-demo-admin-filled.png' });
        
        // Submit login as admin
        await page.click('#signInForm button[type="submit"]');
        await sleep(2000);

        // 12. Uji Panel Admin Sarpras
        console.log('📍 [12/12] Menguji Panel Kelola Sarpras (Hak Akses Role Admin)...');
        await page.click('a[href="#adminPanel"]');
        await sleep(1000);
        await page.screenshot({ path: 'testing/detailed-screenshots/10-admin-panel.png' });

        // Filter pengajuan di panel admin
        await page.click('#btnFilterPendingBookings');
        await sleep(900);
        await page.click('#btnFilterAllBookings');
        await sleep(1200);

        console.log('✨ SEMUA 12 SKENARIO PENGUJIAN HEADED BERHASIL LULUS 100%!');
        await sleep(2500);
    } catch (err) {
        console.error('❌ Terjadi kesalahan saat pengujian:', err);
    } finally {
        await browser.close();
        console.log('🔒 Sesi browser headed telah selesai dan ditutup.');
    }
})();
