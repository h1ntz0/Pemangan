import { chromium, devices } from 'playwright';
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

async function captureAllScreenshots() {
  console.log('📸 Capturing High-Res Desktop & Mobile Screenshots for README...');

  const browser = await chromium.launch({ headless: true });
  const baseUrl = 'http://localhost:5173'; // Vite dev/preview server or localhost:80

  // 1. Desktop Screenshots (1440 x 900)
  console.log('\n--- Desktop Captures ---');
  const desktopContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  const desktopPage = await desktopContext.newPage();

  // Desktop Beranda
  await desktopPage.goto(`${baseUrl}/`, { waitUntil: 'networkidle' });
  const skipBtn = await desktopPage.$('button:has-text("Lewati")');
  if (skipBtn) await skipBtn.click();
  await desktopPage.waitForTimeout(600);
  await desktopPage.screenshot({ path: path.join(docsDir, 'desktop-beranda.png') });
  console.log('✅ desktop-beranda.png');

  // Desktop Katalog Ruangan
  await desktopPage.goto(`${baseUrl}/rooms`, { waitUntil: 'networkidle' });
  await desktopPage.waitForTimeout(600);
  await desktopPage.screenshot({ path: path.join(docsDir, 'desktop-ruangan.png') });
  console.log('✅ desktop-ruangan.png');

  // Desktop Detail Ruangan
  await desktopPage.goto(`${baseUrl}/rooms/r-401`, { waitUntil: 'networkidle' });
  await desktopPage.waitForTimeout(600);
  await desktopPage.screenshot({ path: path.join(docsDir, 'desktop-detail-ruangan.png') });
  console.log('✅ desktop-detail-ruangan.png');

  // Desktop Jadwal Matriks
  await desktopPage.goto(`${baseUrl}/timetable`, { waitUntil: 'networkidle' });
  await desktopPage.waitForTimeout(600);
  await desktopPage.screenshot({ path: path.join(docsDir, 'desktop-jadwal.png') });
  console.log('✅ desktop-jadwal.png');

  // Desktop Formulir Booking
  await desktopPage.goto(`${baseUrl}/booking`, { waitUntil: 'networkidle' });
  await desktopPage.waitForTimeout(600);
  await desktopPage.screenshot({ path: path.join(docsDir, 'desktop-booking.png') });
  console.log('✅ desktop-booking.png');

  // Desktop Tracking
  await desktopPage.goto(`${baseUrl}/tracking?ticketId=BK-2026-001`, { waitUntil: 'networkidle' });
  await desktopPage.waitForTimeout(600);
  await desktopPage.screenshot({ path: path.join(docsDir, 'desktop-tracking.png') });
  console.log('✅ desktop-tracking.png');

  // Desktop Admin Dashboard
  await desktopPage.goto(`${baseUrl}/admin`, { waitUntil: 'networkidle' });
  await desktopPage.waitForTimeout(600);
  await desktopPage.screenshot({ path: path.join(docsDir, 'desktop-admin.png') });
  console.log('✅ desktop-admin.png');

  // Desktop Login
  await desktopPage.goto(`${baseUrl}/login`, { waitUntil: 'networkidle' });
  await desktopPage.waitForTimeout(600);
  await desktopPage.screenshot({ path: path.join(docsDir, 'desktop-login.png') });
  console.log('✅ desktop-login.png');

  // Desktop Surat Izin Resmi
  await desktopPage.goto(`${baseUrl}/slip/BK-2026-001`, { waitUntil: 'networkidle' });
  await desktopPage.waitForTimeout(600);
  await desktopPage.screenshot({ path: path.join(docsDir, 'desktop-surat-izin.png') });
  console.log('✅ desktop-surat-izin.png');

  await desktopContext.close();

  // 2. Mobile Screenshots (iPhone 14)
  console.log('\n--- Mobile Captures ---');
  const mobileContext = await browser.newContext({
    ...devices['iPhone 14'],
  });
  const mobilePage = await mobileContext.newPage();

  // Mobile Beranda
  await mobilePage.goto(`${baseUrl}/`, { waitUntil: 'networkidle' });
  const mobileSkip = await mobilePage.$('button:has-text("Lewati")');
  if (mobileSkip) await mobileSkip.click();
  await mobilePage.waitForTimeout(600);
  await mobilePage.screenshot({ path: path.join(docsDir, 'mobile-beranda.png') });
  console.log('✅ mobile-beranda.png');

  // Mobile Menu Nav
  const menuBtn = await mobilePage.$('button[aria-label="Toggle menu"]');
  if (menuBtn) {
    await menuBtn.click();
    await mobilePage.waitForTimeout(500);
    await mobilePage.screenshot({ path: path.join(docsDir, 'mobile-menu.png') });
    console.log('✅ mobile-menu.png');
    await menuBtn.click();
    await mobilePage.waitForTimeout(300);
  }

  // Mobile Katalog Ruangan
  await mobilePage.goto(`${baseUrl}/rooms`, { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(600);
  await mobilePage.screenshot({ path: path.join(docsDir, 'mobile-ruangan.png') });
  console.log('✅ mobile-ruangan.png');

  // Mobile Booking Wizard
  await mobilePage.goto(`${baseUrl}/booking`, { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(600);
  await mobilePage.screenshot({ path: path.join(docsDir, 'mobile-booking.png') });
  console.log('✅ mobile-booking.png');

  // Mobile Timetable
  await mobilePage.goto(`${baseUrl}/timetable`, { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(600);
  await mobilePage.screenshot({ path: path.join(docsDir, 'mobile-jadwal.png') });
  console.log('✅ mobile-jadwal.png');

  // Mobile Tracking
  await mobilePage.goto(`${baseUrl}/tracking?ticketId=BK-2026-001`, { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(600);
  await mobilePage.screenshot({ path: path.join(docsDir, 'mobile-tracking.png') });
  console.log('✅ mobile-tracking.png');

  // Mobile Admin
  await mobilePage.goto(`${baseUrl}/admin`, { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(600);
  await mobilePage.screenshot({ path: path.join(docsDir, 'mobile-admin.png') });
  console.log('✅ mobile-admin.png');

  // Mobile Login
  await mobilePage.goto(`${baseUrl}/login`, { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(600);
  await mobilePage.screenshot({ path: path.join(docsDir, 'mobile-login.png') });
  console.log('✅ mobile-login.png');

  await mobileContext.close();
  await browser.close();

  console.log('\n🎉 ALL SCREENSHOTS CAPTURED SUCCESSFULLY IN docs/screenshots/');
}

captureAllScreenshots();
