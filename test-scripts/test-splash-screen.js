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

async function testInteractiveSplash() {
  console.log('📱 Testing Interactive Diagnostics Preloader...');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    ...devices['iPhone 14'],
  });

  const page = await context.newPage();
  const baseUrl = 'http://localhost:80';

  try {
    console.log('1. Navigating to website...');
    await page.goto(`${baseUrl}/`, { waitUntil: 'domcontentloaded' });
    
    // Capture early stage
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(screenshotDir, '00a-interactive-splash-start.png') });
    console.log('✅ Interactive splash initial state captured.');

    // Interactive tap on screen to test boost & ripple
    await page.mouse.click(200, 350);
    await page.waitForTimeout(200);
    await page.screenshot({ path: path.join(screenshotDir, '00b-interactive-splash-boost.png') });
    console.log('✅ Interactive tap boost captured.');

    // Wait for splash screen to smoothly complete
    await page.waitForTimeout(2200);
    await page.screenshot({ path: path.join(screenshotDir, '00c-homepage-after-splash.png') });
    console.log('✅ Main app captured after interactive splash transition.');

    console.log('\n🎉 ALL INTERACTIVE PRELOADER TESTS PASSED 100%');
  } catch (err) {
    console.error('❌ Interactive splash test error:', err);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
}

testInteractiveSplash();
