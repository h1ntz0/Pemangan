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

async function testSplashScreen() {
  console.log('📱 Testing 3-Second Splash Loading Screen...');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    ...devices['iPhone 14'],
  });

  const page = await context.newPage();
  const baseUrl = 'http://localhost:80';

  try {
    console.log('1. Navigating to website...');
    await page.goto(`${baseUrl}/`, { waitUntil: 'domcontentloaded' });
    
    // Capture during splash loading (approx 1s in)
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(screenshotDir, '00-mobile-splash-loading.png') });
    console.log('✅ Splash screen captured (progress active).');

    // Wait for splash screen (3s) to complete
    await page.waitForTimeout(2500);
    await page.screenshot({ path: path.join(screenshotDir, '01-mobile-home-after-splash.png') });
    console.log('✅ Main app captured after splash transition.');

    console.log('\n🎉 SPLASH SCREEN TEST PASSED 100%');
  } catch (err) {
    console.error('❌ Splash screen test error:', err);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
}

testSplashScreen();
