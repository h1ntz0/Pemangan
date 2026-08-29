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

  // 1. Desktop Screenshots (1280 x 800)
  console.log('\n--- Desktop Captures ---');
  const desktopContext = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 2,
  });
  const desktopPage = await desktopContext.newPage();
  const baseUrl = 'http://localhost:80';

  // Desktop Beranda
  await desktopPage.goto(`${baseUrl}/`, { waitUntil: 'load' });
  await desktopPage.waitForTimeout(400);
  // Click skip if splash active
  const skipBtn = await desktopPage.$('button:has-text("Lewati")');
  if (skipBtn) await skipBtn.click();
  await desktopPage.waitForTimeout(500);
  await desktopPage.screenshot({ path: path.join(docsDir, 'desktop-beranda.png') });
  console.log('✅ desktop-beranda.png');

  // Desktop Ruangan
  await desktopPage.goto(`${baseUrl}/rooms`, { waitUntil: 'load' });
  await desktopPage.waitForTimeout(500);
  await desktopPage.screenshot({ path: path.join(docsDir, 'desktop-ruangan.png') });
  console.log('✅ desktop-ruangan.png');

  // Desktop Jadwal
  await desktopPage.goto(`${baseUrl}/timetable`, { waitUntil: 'load' });
  await desktopPage.waitForTimeout(500);
  await desktopPage.screenshot({ path: path.join(docsDir, 'desktop-jadwal.png') });
  console.log('✅ desktop-jadwal.png');

  // Desktop Tracking
  await desktopPage.goto(`${baseUrl}/tracking?ticketId=BK-2026-001`, { waitUntil: 'load' });
  await desktopPage.waitForTimeout(500);
  await desktopPage.screenshot({ path: path.join(docsDir, 'desktop-tracking.png') });
  console.log('✅ desktop-tracking.png');

  // Desktop Surat Izin Resmi
  await desktopPage.goto(`${baseUrl}/slip/BK-2026-001`, { waitUntil: 'load' });
  await desktopPage.waitForTimeout(500);
  await desktopPage.screenshot({ path: path.join(docsDir, 'desktop-surat-izin.png') });
  console.log('✅ desktop-surat-izin.png');

  await desktopContext.close();

  // 2. Mobile Screenshots (iPhone 14 / Pixel 7)
  console.log('\n--- Mobile Captures ---');
  const mobileContext = await browser.newContext({
    ...devices['iPhone 14'],
  });
  const mobilePage = await mobileContext.newPage();

  // Mobile Splash Loading
  await mobilePage.goto(`${baseUrl}/`, { waitUntil: 'domcontentloaded' });
  await mobilePage.waitForTimeout(800);
  await mobilePage.screenshot({ path: path.join(docsDir, 'mobile-splash.png') });
  console.log('✅ mobile-splash.png');

  // Mobile Beranda
  await mobilePage.waitForTimeout(2500);
  await mobilePage.screenshot({ path: path.join(docsDir, 'mobile-beranda.png') });
  console.log('✅ mobile-beranda.png');

  // Mobile Booking Wizard
  await mobilePage.goto(`${baseUrl}/booking`, { waitUntil: 'load' });
  await mobilePage.waitForTimeout(500);
  await mobilePage.screenshot({ path: path.join(docsDir, 'mobile-booking.png') });
  console.log('✅ mobile-booking.png');

  // Mobile Timetable
  await mobilePage.goto(`${baseUrl}/timetable`, { waitUntil: 'load' });
  await mobilePage.waitForTimeout(500);
  await mobilePage.screenshot({ path: path.join(docsDir, 'mobile-jadwal.png') });
  console.log('✅ mobile-jadwal.png');

  // Mobile Tracking
  await mobilePage.goto(`${baseUrl}/tracking?ticketId=BK-2026-001`, { waitUntil: 'load' });
  await mobilePage.waitForTimeout(500);
  await mobilePage.screenshot({ path: path.join(docsDir, 'mobile-tracking.png') });
  console.log('✅ mobile-tracking.png');

  await mobileContext.close();
  await browser.close();

  console.log('\n🎉 ALL SCREENSHOTS CAPTURED SUCCESSFULLY IN docs/screenshots/');
}

captureAllScreenshots();
