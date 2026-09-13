const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  await page.goto('http://localhost:3005', { waitUntil: 'networkidle2' });
  const html = await page.content();
  console.log(html.substring(0, 500));
  await browser.close();
  process.exit(0);
})();
