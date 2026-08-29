import { chromium } from 'playwright';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

async function debug() {
  const server = spawn('npm', ['run', 'preview', '--', '--port', '4173'], {
    cwd: projectRoot,
    stdio: 'pipe'
  });

  await new Promise(r => setTimeout(r, 2000));

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('[Browser Log]', msg.text()));
  page.on('pageerror', err => console.error('[Browser Error]', err));

  await page.goto('http://localhost:4173/booking?roomId=r-403');
  console.log('H1:', await page.textContent('h1'));
  console.log('Step 1 H3:', await page.textContent('h3'));

  await page.click('button:has-text("Lanjutkan")');
  await page.waitForTimeout(500);
  console.log('Step 2 H3:', await page.textContent('h3'));

  await page.click('button:has-text("Lanjutkan")');
  await page.waitForTimeout(500);
  console.log('Step 3 H3:', await page.textContent('h3'));

  await page.click('button:has-text("Lanjutkan")');
  await page.waitForTimeout(500);
  console.log('Step 4 H3:', await page.textContent('h3'));

  const buttons = await page.$$eval('button', els => els.map(e => e.textContent.trim()));
  console.log('All buttons on Step 4:', buttons);

  await browser.close();
  server.kill();
}

debug();
