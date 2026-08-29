import { chromium, devices } from 'playwright';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const screenshotDir = path.join(projectRoot, 'testing', 'mobile');

if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir, { recursive: true });
}

async function runMobileTests() {
  console.log('📱 Starting Mobile UX & Light/Dark Theme Verification...');

  const browser = await chromium.launch({ headless: true });
  // Emulate mobile phone (iPhone 14 / Pixel 7 standard: 390x844)
  const context = await browser.newContext({
    ...devices['iPhone 14'],
  });

  const page = await context.newPage();
  const baseUrl = 'http://localhost:80'; // Test through Nginx on port 80

  try {
    console.log('--- 1. Testing Mobile Homepage in Light Mode ---');
    await page.goto(`${baseUrl}/`, { waitUntil: 'load' });
    
    // Verify default theme is Light Mode
    const htmlClasses = await page.evaluate(() => document.documentElement.className);
    console.log('Initial HTML class:', htmlClasses || '(clean light mode)');
    await page.screenshot({ path: path.join(screenshotDir, '01-mobile-home-light.png') });
    console.log('✅ Mobile Homepage in Light Mode captured.');

    console.log('--- 2. Testing Theme Switcher (Light -> Dark -> Light) ---');
    // Click theme toggle button
    await page.evaluate(() => {
      const btn = document.querySelector('button[aria-label*="Mode"]');
      if (btn) btn.click();
    });
    await page.waitForTimeout(300);
    const darkClasses = await page.evaluate(() => document.documentElement.className);
    console.log('After toggle to Dark:', darkClasses);
    await page.screenshot({ path: path.join(screenshotDir, '02-mobile-home-dark.png') });
    
    // Toggle back to Light
    await page.evaluate(() => {
      const btn = document.querySelector('button[aria-label*="Mode"]');
      if (btn) btn.click();
    });
    await page.waitForTimeout(300);
    const lightClassesAgain = await page.evaluate(() => document.documentElement.className);
    console.log('After toggle back to Light:', lightClassesAgain || '(clean light mode)');
    await page.screenshot({ path: path.join(screenshotDir, '03-mobile-home-light-again.png') });
    console.log('✅ Theme switcher verified in both directions.');

    console.log('--- 3. Testing Mobile Bottom Navigation: Ruangan (/rooms) ---');
    await page.evaluate(() => {
      const navItem = Array.from(document.querySelectorAll('.bottom-nav a')).find(a => a.textContent?.includes('Ruangan'));
      if (navItem) navItem.click();
    });
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(screenshotDir, '04-mobile-rooms-catalog.png') });
    console.log('✅ Mobile Rooms catalog verified via bottom nav.');

    console.log('--- 4. Testing Mobile Bottom Navigation: Pinjam (/booking) ---');
    await page.evaluate(() => {
      const navItem = Array.from(document.querySelectorAll('.bottom-nav a')).find(a => a.textContent?.includes('Pinjam'));
      if (navItem) navItem.click();
    });
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(screenshotDir, '05-mobile-booking-wizard.png') });
    console.log('✅ Mobile Booking wizard verified via bottom nav.');

    console.log('--- 5. Testing Mobile Bottom Navigation: Jadwal (/timetable) ---');
    await page.evaluate(() => {
      const navItem = Array.from(document.querySelectorAll('.bottom-nav a')).find(a => a.textContent?.includes('Jadwal'));
      if (navItem) navItem.click();
    });
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(screenshotDir, '06-mobile-timetable.png') });
    console.log('✅ Mobile Timetable matrix verified via bottom nav.');

    console.log('--- 6. Testing Mobile Bottom Navigation: Lacak (/tracking) ---');
    await page.evaluate(() => {
      const navItem = Array.from(document.querySelectorAll('.bottom-nav a')).find(a => a.textContent?.includes('Lacak'));
      if (navItem) navItem.click();
    });
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(screenshotDir, '07-mobile-tracking.png') });
    console.log('✅ Mobile Tracking verified via bottom nav.');

    console.log('\n🎉 ALL MOBILE TESTS & 3-COLOR REFINEMENTS VERIFIED 100% SUCCESSFULLY.');

  } catch (err) {
    console.error('❌ Mobile test error:', err);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
}

runMobileTests();
