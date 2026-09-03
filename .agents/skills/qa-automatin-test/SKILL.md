---
name: qa-automatin-test
description: "Universal Headed & Ultra-Powerful Autonomous QA & SIT Automated Testing Agent menggunakan Playwright & Camofox. Wajib melakukan Interactive Requirement Intake sebelum pengujian, mengeksekusi browser secara Headed (GUI Visible), mengorkestrasi MCP & Skill ekosistem (codebash, codebase-memory, xlsx, docx, bug-bounty, sequential-thinking), serta merender laporan akhir berstandar human craftsmanship menggunakan skill humanizer."
---

# Autonomous Headed QA & SIT Engine (Enterprise Universal Testing Framework)

Skill ini adalah agen pengujian web otomatis berstandar enterprise dengan **Interactive Requirement Intake**, **Visual Headed Browser Execution**, **Autonomous State-Machine Looping**, **Deep Modal Traversal**, **Multi-Tool & MCP Orchestration**, dan **Humanizer-Powered Reporting**.

---

## 🧩 0. MCP & Skill Synergy Ecosystem

Engine ini memanfaatkan kekuatan penuh dari MCP Server dan Skill pelengkap:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                  QA AUTOMATION ORCHESTRATION ECOSYSTEM                      │
├───────────────────────────────┬─────────────────────────────────────────────┤
│ Tool / Skill                  │ Peran & Kapabilitas Utama                   │
├───────────────────────────────┼─────────────────────────────────────────────┤
│ 🎭 Playwright / Camofox MCP   │ Headed browser execution, DOM snapshot,     │
│                               │ anti-bot bypass, visual action recording.   │
├───────────────────────────────┼─────────────────────────────────────────────┤
│ 💻 CodeBash MCP               │ Eksekusi test script, Playwright test       │
│                               │ runner, bundling asset & capture artifacts. │
├───────────────────────────────┼─────────────────────────────────────────────┤
│ 🧠 Codebase Memory & Graph    │ Reverse-engineer source code target untuk   │
│                               │ memetakan rute API, payload, & auth guard.  │
├───────────────────────────────┼─────────────────────────────────────────────┤
│ 📊 xlsx Skill                 │ Generate workbook Excel SIT 17-kolom SOP    │
│                               │ lengkap dengan formula, conditional format. │
├───────────────────────────────┼─────────────────────────────────────────────┤
│ 📄 docx / pdf Skill           │ Ingest dokumen FSD, SRS, TSD, atau user     │
│                               │ story secara instan sebagai basis skenario. │
├───────────────────────────────┼─────────────────────────────────────────────┤
│ 🛡️ bug-bounty & security      │ Payload injection (XSS, SQLi, BOLA/IDOR,    │
│                               │ privilege escalation, unhandled exceptions).│
├───────────────────────────────┼─────────────────────────────────────────────┤
│ ✍️ humanizer Skill            │ Rewriting laporan akhir (REPORT.md & SIT    │
│                               │ digest) agar natural, tajam, & bebas klise. │
└───────────────────────────────┴─────────────────────────────────────────────┘
```

---

## 🎯 1. Golden Rule: Interactive Requirement Intake (WAJIB DILAKUKAN PERTAMA)

Sebelum menulis atau mengeksekusi skrip automation apa pun, agen **DILARANG** berasumsi atau langsung jalan sendiri jika parameter belum lengkap. Agen **WAJIB** menanyakan detail kebutuhan pengujian kepada pengguna:

### 📋 Checklist Pertanyaan Intake ke User:
```text
Halo! Sebelum kita mulai automation test, mohon konfirmasi beberapa detail berikut:

1. 🌐 Target URL & Environment:
   - URL Web App: (contoh: http://localhost:3000 atau https://staging.app.com)
2. 🔑 Kredensial & Role Akses:
   - Username/Email: 
   - Password:
   - Role yang ingin diuji: (Admin, User, Approver, Checker, dsb.)
3. 📑 Dokumen Acuan (Opsional):
   - Apakah ada file FSD (.docx/.pdf), SIT Matrix (.xlsx), atau User Story? (Lampirkan jika ada)
4. 🎯 Ruang Lingkup & Skenario Pengujian:
   - A. SIT/FSD-Driven (Strict sesuai nomor test case dokumen)
   - B. Autonomous Self-Exploration (Explore & crawling semua menu/fitur secara mandiri)
   - C. Custom Flow Spesifik (Tuliskan alur modul tertentu yang ingin dites)
5. 🖥️ Mode Tampilan Browser:
   - Default: HEADED (Browser terbuka & terlihat di layar, slowMo 150ms)
   - Konfirmasi resolusi layar atau preferensi khusus.
```

---

## 🖥️ 2. Headed Browser Execution Standard (Visual & Powerfully Synced)

Setiap pengujian **WAJIB** dijalankan dalam mode **HEADED** (`headless: false`) agar pengguna dapat memantau jalannya automation secara langsung dan real-time di layar.

### 🚀 Konfigurasi Wajib Playwright Launcher:
```javascript
const { chromium } = require('playwright');

async function launchHeadedBrowser() {
  const browser = await chromium.launch({
    headless: false, // WAJIB HEADED
    slowMo: 150,     // Delay per aksi agar pergerakan terlihat jelas & stabil
    args: [
      '--start-maximized',
      '--disable-blink-features=AutomationControlled',
      '--no-sandbox'
    ]
  });

  const context = await browser.newContext({
    viewport: null, // Mengikuti ukuran window maximized layar user
    ignoreHTTPSErrors: true,
    recordVideo: { dir: './test-results/videos/' } // Rekam video bukti otomatis
  });

  const page = await context.newPage();
  return { browser, context, page };
}
```

---

## 🏛️ 3. Tiga Mode Operasi Utama (Tri-Mode Engine)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       QA AUTOMATION MASTER ENGINE                           │
├───────────────────────────────┬─────────────────────────────┬───────────────┤
│    MODE A: SIT/FSD-DRIVEN     │   MODE B: AUTO-EXPLORATION  │    MODE C:    │
│ (Strict Document Compliance)  │    (Autonomous Discovery)   │ PROMPT-DRIVEN │
├───────────────────────────────┼─────────────────────────────┼───────────────┤
│ • Baca file .xlsx/.docx/.pdf  │ • Tanpa dokumen acuan       │ • Sesuai teks │
│ • Petakan setiap Test Case ID │ • Auto-crawl seluruh menu   │   bebas user  │
│ • Validasi Expected vs Actual │ • Form auto-filling pintar  │ • Target test │
│ • Isi workbook SIT persis SOP │ • Fuzzing & boundary test   │   spesifik    │
└───────────────────────────────┴─────────────────────────────┴───────────────┘
```

---

## ⚡ 4. Powerful Interactive Traversal & Self-Healing Engine

### 🛠️ A. ASP.NET AJAX & Modern Framework Auto-Sync
```javascript
async function waitPageReady(page) {
  await page.waitForLoadState('domcontentloaded');
  await page.waitForLoadState('networkidle').catch(() => {});
  
  await page.evaluate(() => {
    return new Promise(resolve => {
      if (window.Sys && window.Sys.WebForms && window.Sys.WebForms.PageRequestManager) {
        const prm = window.Sys.WebForms.PageRequestManager.getInstance();
        if (!prm.get_isInAsyncPostBack()) return resolve();
        prm.add_endRequest(function handler() {
          prm.remove_endRequest(handler);
          resolve();
        });
      } else {
        resolve();
      }
    });
  }).catch(() => {});
  await page.waitForTimeout(200);
}
```

### 🛠️ B. Resilient Element Interactor (Anti-Overlay & Smart Click)
```javascript
async function smartClick(page, selectorOrLocator, description = '') {
  await waitPageReady(page);
  const loc = typeof selectorOrLocator === 'string' ? page.locator(selectorOrLocator).first() : selectorOrLocator;
  await loc.waitFor({ state: 'visible', timeout: 10000 });
  await loc.scrollIntoViewIfNeeded();
  
  await page.evaluate(() => {
    document.querySelectorAll('.modal-backdrop, .overlay, .loading-mask, [class*="backdrop"]').forEach(el => {
      if (window.getComputedStyle(el).opacity === '0' || el.style.display === 'none') el.remove();
    });
  }).catch(() => {});

  try {
    await loc.click({ timeout: 5000 });
  } catch (err) {
    await loc.dispatchEvent('click').catch(async () => {
      await page.evaluate(el => el.click(), await loc.elementHandle());
    });
  }
  await waitPageReady(page);
}
```

---

## 🔬 5. Multi-Pass Test Execution Matrix (4-Layer Pyramid)

1. **Layer 1: Happy Path Flow**: Otentikasi, CRUD lengkap, multi-grid assignment, validasi sukses.
2. **Layer 2: Negative & Boundary**: Form submit kosong, tipe data mismatch, date range invalid, batas panjang karakter.
3. **Layer 3: Security & Injection**: XSS payload, SQLi detection, BOLA/IDOR URL tampering, unhandled stacktrace exposure.
4. **Layer 4: Monkey & Chaos Testing**: Rapid multi-click tombol submit, browser back/refresh, intercept console error logs.

---

## 📊 6. Output Workbook Excel SIT 17-Kolom (via `xlsx` skill)

| No | Kolom | Standar Nilai |
|:---|:---|:---|
| 1 | **No** | Format `X,Y` (`1,1`, `1,2`, `2,1`) |
| 2 | **Function** | Nama Modul / Sub-Modul |
| 3 | **Tipe Temuan** | Wajib untuk Result `X`: `Critical`, `Major`, `Minor`, `Trivia` |
| 4 | **Is Recurring** | `Ya` / `Tidak` |
| 5 | **Script test** | Langkah operasional pengujian step-by-step |
| 6 | **Output expected** | Hasil yang diharapkan |
| 7 | **Jumlah Data Test** | Kuantitas variasi data |
| 8 | **Detail Data Test** | Nilai input nyata |
| 9 | **Screenshot** | Nama file screenshot bukti |
| 10 | **Result** | `V` (PASS) atau `X` (FAIL/BUG) |
| 11 | **Keterangan** | Detail pesan error / root cause |
| 12 | **Respon PIC** | Evaluasi PIC QA |
| 13 | **Dev Name** | `Frontend Dev` / `Backend Dev` |
| 14 | **Start Date Testing** | Tanggal mulai (`YYYY-MM-DD`) |
| 15 | **Finish Date Testing** | Tanggal selesai (`YYYY-MM-DD`) |
| 16 | **Respone Dev** | `Open`, `In Progress`, `Fixed` |
| 17 | **Status Dev** | `Open` / `Closed` |

---

## ✍️ 7. Humanizer-Powered Reporting Standard (`REPORT.md`)

Seluruh narasi laporan akhir **WAJIB** diproses dengan prinsip skill **`humanizer`**:
- **No AI Clichés**: Hindari kata klise seperti *"delve into"*, *"testament"*, *"tapestry"*, *"in conclusion"*, *"it is crucial to note"*.
- **Direct & Grounded**: Gunakan bahasa teknis lugas, berbasis bukti nyata (HTTP status, selector, response time, payload, log console).
- **Struktur Laporan**:
  1. **Executive Scorecard**: Total test, Pass Rate %, rekap bug Critical/Major.
  2. **Feature Health Matrix**: Status per modul.
  3. **Actionable Bug & Security Register**: Steps to reproduce, screenshot link, saran kode perbaikan (frontend/backend).
  4. **Network & Console Error Log Digest**.
