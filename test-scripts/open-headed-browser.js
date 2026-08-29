import { chromium } from 'playwright';

async function openBrowser() {
  console.log('🌐 Launching interactive headed browser for Pemangan 2.0...');
  
  const browser = await chromium.launch({
    headless: false,
    args: ['--start-maximized']
  });

  const context = await browser.newContext({
    viewport: null
  });

  const page = await context.newPage();
  await page.goto('http://localhost:3000/');
  console.log('✨ Browser opened at http://localhost:3000/');

  // Keep browser running until user closes it
  await new Promise(() => {});
}

openBrowser().catch(err => {
  console.error('Failed to open browser:', err);
});
