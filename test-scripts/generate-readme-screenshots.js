import { chromium, devices } from 'playwright';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const docsDir = path.join(projectRoot, 'docs', 'screenshots');

if (!fs.existsSync(docsDir)) {
  fs.mkdirSync(docsDir, { recursive: true });
}

async function ensureNoSplash(page) {
  try {
    const skipBtn = await page.$('button:has-text("Lewati")');
    if (skipBtn) {
      await skipBtn.click();
      await page.waitForTimeout(350);
    }
  } catch (e) {
    // ignore
  }
  // Wait until splash is gone and main content is visible
  try {
    await page.waitForSelector('main', { state: 'visible', timeout: 5000 });
  } catch (e) {
    // ignore
  }
}

async function captureAllScreenshots() {
  console.log('🚀 Starting Vite preview server on port 4173...');
const server = spawn('npm', ['run', 'preview', '--', '--port', '4173', '--strictPort'], {
    cwd: projectRoot,
    shell: true,
stdio: 'pipe'
});

  server.stdout.on('data', (d) => {
    const msg = d.toString();
    if (msg.includes('4173')) {
      console.log(`[Vite Preview] Ready on port 4173`);
    }
  });

  // Give preview server 2 seconds to start
  await new Promise((r) => setTimeout(r, 2000));

  const baseUrl = 'http://localhost:4173';
  console.log(`📸 Launching Chromium to capture screenshots at ${baseUrl}...`);

  const browser = await chromium.launch({ headless: true });

  try {
    // ==========================================
    // 1. DESKTOP SCREENSHOTS (1440 x 900)
    // ==========================================
    console.log('\n--- 1. Desktop Screenshots (1440 x 900) ---');
    const desktopContext = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 2,
    });
    const desktopPage = await desktopContext.newPage();

    // 1.1 Desktop Beranda
    console.log('Capturing desktop-beranda.png...');
    await desktopPage.goto(`${baseUrl}/`, { waitUntil: 'networkidle' });
    await ensureNoSplash(desktopPage);
    await desktopPage.waitForTimeout(500);
    await desktopPage.screenshot({ path: path.join(docsDir, 'desktop-beranda.png') });
    console.log('✅ desktop-beranda.png');

    // 1.2 Desktop Katalog Ruangan
    console.log('Capturing desktop-ruangan.png...');
    await desktopPage.goto(`${baseUrl}/rooms`, { waitUntil: 'networkidle' });
    await ensureNoSplash(desktopPage);
    await desktopPage.waitForTimeout(500);
    await desktopPage.screenshot({ path: path.join(docsDir, 'desktop-ruangan.png') });
    console.log('✅ desktop-ruangan.png');

    // 1.3 Desktop Detail Ruangan
    console.log('Capturing desktop-detail-ruangan.png...');
    await desktopPage.goto(`${baseUrl}/rooms/r-401`, { waitUntil: 'networkidle' });
    await ensureNoSplash(desktopPage);
    await desktopPage.waitForTimeout(500);
    await desktopPage.screenshot({ path: path.join(docsDir, 'desktop-detail-ruangan.png') });
    console.log('✅ desktop-detail-ruangan.png');

    // 1.4 Desktop Jadwal Matriks
    console.log('Capturing desktop-jadwal.png...');
    await desktopPage.goto(`${baseUrl}/timetable`, { waitUntil: 'networkidle' });
    await ensureNoSplash(desktopPage);
    await desktopPage.waitForTimeout(500);
    await desktopPage.screenshot({ path: path.join(docsDir, 'desktop-jadwal.png') });
    console.log('✅ desktop-jadwal.png');

    // 1.5 Desktop Formulir Booking
    console.log('Capturing desktop-booking.png...');
    await desktopPage.goto(`${baseUrl}/booking?roomId=r-403`, { waitUntil: 'networkidle' });
    await ensureNoSplash(desktopPage);
    await desktopPage.waitForTimeout(500);
    await desktopPage.screenshot({ path: path.join(docsDir, 'desktop-booking.png') });
    console.log('✅ desktop-booking.png');

    // 1.6 Desktop Tracking
    console.log('Capturing desktop-tracking.png...');
    await desktopPage.goto(`${baseUrl}/tracking?ticketId=BK-2026-001`, { waitUntil: 'networkidle' });
    await ensureNoSplash(desktopPage);
    await desktopPage.waitForTimeout(500);
    await desktopPage.screenshot({ path: path.join(docsDir, 'desktop-tracking.png') });
    console.log('✅ desktop-tracking.png');

    // 1.7 Desktop Admin Dashboard
    console.log('Capturing desktop-admin.png...');
    await desktopPage.goto(`${baseUrl}/admin`, { waitUntil: 'networkidle' });
    await ensureNoSplash(desktopPage);
    await desktopPage.waitForTimeout(500);
    await desktopPage.screenshot({ path: path.join(docsDir, 'desktop-admin.png') });
    console.log('✅ desktop-admin.png');

    // 1.8 Desktop Login
    console.log('Capturing desktop-login.png...');
    await desktopPage.goto(`${baseUrl}/login`, { waitUntil: 'networkidle' });
    await ensureNoSplash(desktopPage);
    await desktopPage.waitForTimeout(500);
    await desktopPage.screenshot({ path: path.join(docsDir, 'desktop-login.png') });
    console.log('✅ desktop-login.png');

    // 1.9 Desktop Surat Izin Resmi
    console.log('Capturing desktop-surat-izin.png...');
    await desktopPage.goto(`${baseUrl}/slip/BK-2026-001`, { waitUntil: 'networkidle' });
    await ensureNoSplash(desktopPage);
    await desktopPage.waitForTimeout(800);
    await desktopPage.screenshot({ path: path.join(docsDir, 'desktop-surat-izin.png') });
    console.log('✅ desktop-surat-izin.png');

    await desktopContext.close();

    // ==========================================
    // 2. MOBILE SCREENSHOTS (iPhone 14)
    // ==========================================
    console.log('\n--- 2. Mobile Screenshots (iPhone 14) ---');
    const mobileContext = await browser.newContext({
      ...devices['iPhone 14'],
    });
    const mobilePage = await mobileContext.newPage();

    // 2.0 Mobile Splash Screen (intentionally capture splash on fresh load without skipping)
    console.log('Capturing mobile-splash.png (Real Splash Screen)...');
    await mobilePage.goto(`${baseUrl}/`, { waitUntil: 'commit' });
    await mobilePage.waitForTimeout(600); // at 600ms splash is beautifully visible
    await mobilePage.screenshot({ path: path.join(docsDir, 'mobile-splash.png') });
    console.log('✅ mobile-splash.png');

    // 2.1 Mobile Beranda (After Splash / Skipped)
    console.log('Capturing mobile-beranda.png...');
    await ensureNoSplash(mobilePage);
    await mobilePage.waitForTimeout(500);
    await mobilePage.screenshot({ path: path.join(docsDir, 'mobile-beranda.png') });
    console.log('✅ mobile-beranda.png');

    // 2.2 Mobile Katalog Ruangan
    console.log('Capturing mobile-ruangan.png...');
    await mobilePage.goto(`${baseUrl}/rooms`, { waitUntil: 'networkidle' });
    await ensureNoSplash(mobilePage);
    await mobilePage.waitForTimeout(500);
    await mobilePage.screenshot({ path: path.join(docsDir, 'mobile-ruangan.png') });
    console.log('✅ mobile-ruangan.png');

    // 2.3 Mobile Booking Wizard
    console.log('Capturing mobile-booking.png...');
    await mobilePage.goto(`${baseUrl}/booking?roomId=r-401`, { waitUntil: 'networkidle' });
    await ensureNoSplash(mobilePage);
    await mobilePage.waitForTimeout(500);
    await mobilePage.screenshot({ path: path.join(docsDir, 'mobile-booking.png') });
    console.log('✅ mobile-booking.png');

    // 2.4 Mobile Timetable
    console.log('Capturing mobile-jadwal.png...');
    await mobilePage.goto(`${baseUrl}/timetable`, { waitUntil: 'networkidle' });
    await ensureNoSplash(mobilePage);
    await mobilePage.waitForTimeout(500);
    await mobilePage.screenshot({ path: path.join(docsDir, 'mobile-jadwal.png') });
    console.log('✅ mobile-jadwal.png');

    // 2.5 Mobile Tracking
    console.log('Capturing mobile-tracking.png...');
    await mobilePage.goto(`${baseUrl}/tracking?ticketId=BK-2026-001`, { waitUntil: 'networkidle' });
    await ensureNoSplash(mobilePage);
    await mobilePage.waitForTimeout(500);
    await mobilePage.screenshot({ path: path.join(docsDir, 'mobile-tracking.png') });
    console.log('✅ mobile-tracking.png');

    // 2.6 Mobile Admin
    console.log('Capturing mobile-admin.png...');
    await mobilePage.goto(`${baseUrl}/admin`, { waitUntil: 'networkidle' });
    await ensureNoSplash(mobilePage);
    await mobilePage.waitForTimeout(500);
    await mobilePage.screenshot({ path: path.join(docsDir, 'mobile-admin.png') });
    console.log('✅ mobile-admin.png');

    // 2.7 Mobile Login
    console.log('Capturing mobile-login.png...');
    await mobilePage.goto(`${baseUrl}/login`, { waitUntil: 'networkidle' });
    await ensureNoSplash(mobilePage);
    await mobilePage.waitForTimeout(500);
    await mobilePage.screenshot({ path: path.join(docsDir, 'mobile-login.png') });
    console.log('✅ mobile-login.png');

    await mobileContext.close();
    await browser.close();
  } finally {
    server.kill();
  }

  console.log('\n🎉 ALL REAL SCREENSHOTS CAPTURED SUCCESSFULLY IN docs/screenshots/!');
}

captureAllScreenshots().catch((err) => {
  console.error('❌ Error during capture:', err);
  process.exit(1);
});
