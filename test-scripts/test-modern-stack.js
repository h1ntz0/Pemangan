import { chromium } from 'playwright';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const screenshotDir = path.join(projectRoot, 'testing', 'modern-stack');

if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir, { recursive: true });
}

async function runTests() {
  console.log('🚀 Launching Vite Preview Server for Modern Stack Verification...');
  
  const server = spawn('npm', ['run', 'preview', '--', '--port', '4173', '--strictPort'], {
    cwd: projectRoot,
    stdio: 'pipe'
  });

  server.stdout.on('data', (d) => console.log(`[Server] ${d.toString().trim()}`));
  server.stderr.on('data', (d) => console.error(`[Server Err] ${d.toString().trim()}`));

  await new Promise(r => setTimeout(r, 2500));

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();

  const baseUrl = 'http://localhost:4173';

  try {
    console.log('--- 1. Testing Homepage (/) ---');
    await page.goto(`${baseUrl}/`, { waitUntil: 'load' });
    await page.waitForSelector('text=PEMANGAN');
    await page.screenshot({ path: path.join(screenshotDir, '01-homepage.png'), fullPage: true });
    console.log('✅ Homepage verified.');

    console.log('--- 2. Testing Rooms Catalog (/rooms) ---');
    await page.goto(`${baseUrl}/rooms`, { waitUntil: 'load' });
    await page.waitForSelector('text=Katalog Ruangan & Laboratorium');
    await page.screenshot({ path: path.join(screenshotDir, '02-rooms-catalog.png'), fullPage: true });
    console.log('✅ Rooms Catalog verified.');

    console.log('--- 3. Testing Room Detail (/rooms/r-401) ---');
    await page.goto(`${baseUrl}/rooms/r-401`, { waitUntil: 'load' });
    await page.waitForSelector('text=Ruang 401 - Lab Komputer SIJA');
    await page.screenshot({ path: path.join(screenshotDir, '03-room-detail.png'), fullPage: true });
    console.log('✅ Room Detail (Lab SIJA 401) verified.');

    console.log('--- 4. Testing Timetable Matrix (/timetable) ---');
    await page.goto(`${baseUrl}/timetable`, { waitUntil: 'load' });
    await page.waitForSelector('text=Matriks Jadwal Penggunaan Ruangan');
    await page.screenshot({ path: path.join(screenshotDir, '04-timetable.png'), fullPage: true });
    console.log('✅ Timetable Matrix verified.');

    console.log('--- 5. Testing 4-Step Booking Wizard (/booking) ---');
    await page.goto(`${baseUrl}/booking?roomId=r-403`, { waitUntil: 'load' });
    await page.waitForSelector('text=Formulir Reservasi Ruangan 4-Langkah');
    await page.screenshot({ path: path.join(screenshotDir, '05-booking-step1.png') });
    
    // Step 1 -> Step 2
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent?.includes('Lanjutkan'));
      if (btn) btn.click();
    });
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(screenshotDir, '06-booking-step2.png') });

    // Step 2 -> Step 3
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent?.includes('Lanjutkan'));
      if (btn) btn.click();
    });
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(screenshotDir, '07-booking-step3.png') });

    // Step 3 -> Step 4
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent?.includes('Lanjutkan'));
      if (btn) btn.click();
    });
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(screenshotDir, '08-booking-step4.png') });

    // Step 4 -> Submit
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent?.includes('Kirim Permohonan Resmi'));
      if (btn) btn.click();
    });
    await page.waitForTimeout(600);
    await page.waitForSelector('text=Permohonan Berhasil Diajukan!');
    await page.screenshot({ path: path.join(screenshotDir, '09-booking-success.png') });
    console.log('✅ 4-Step Booking Wizard completed end-to-end.');

    console.log('--- 6. Testing Tracking Center (/tracking) ---');
    await page.goto(`${baseUrl}/tracking?ticketId=BK-2026-001`, { waitUntil: 'load' });
    await page.waitForSelector('text=BK-2026-001');
    await page.screenshot({ path: path.join(screenshotDir, '10-tracking-page.png') });
    console.log('✅ Tracking Center verified.');

    console.log('--- 7. Testing Sarpras Command Center (/admin) ---');
    await page.goto(`${baseUrl}/admin`, { waitUntil: 'load' });
    await page.waitForSelector('text=Sarpras Enterprise Command Center');
    await page.screenshot({ path: path.join(screenshotDir, '11-admin-command-center.png'), fullPage: true });
    console.log('✅ Sarpras Command Center verified.');

    console.log('--- 8. Testing Login Portal (/login) ---');
    await page.goto(`${baseUrl}/login`, { waitUntil: 'load' });
    await page.waitForSelector('text=Masuk ke Portal');
    await page.screenshot({ path: path.join(screenshotDir, '12-login-page.png') });
    console.log('✅ Login Portal verified.');

    console.log('--- 9. Testing Official Printable Slip (/slip/BK-2026-001) ---');
    await page.goto(`${baseUrl}/slip/BK-2026-001`, { waitUntil: 'load' });
    await page.waitForSelector('text=Surat Izin Penggunaan Fasilitas & Laboratorium');
    await page.screenshot({ path: path.join(screenshotDir, '13-official-slip.png'), fullPage: true });
    console.log('✅ Official Printable Slip verified.');

    console.log('\n🎉 ALL 9 VERIFICATION SCENARIOS PASSED WITH ZERO ERRORS.');

  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exitCode = 1;
  } finally {
    await browser.close();
    server.kill();
  }
}

runTests();
