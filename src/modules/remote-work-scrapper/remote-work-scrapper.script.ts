import puppeteer from 'puppeteer';

const browser = await puppeteer.launch({ headless: false });
const page = await browser.newPage();

await page.goto('https://www.remote-work.io/companies-hiring-remote-jobs/');

await page.waitForSelector('table');

// Retrieve links
const rows = await page.$$eval('#jobTable tbody tr', (rows) =>
  Object.fromEntries(
    rows.map((row) => {
      return [
        row.querySelector<HTMLTableCellElement>('td')!.textContent!,
        { link: row.querySelector<HTMLAnchorElement>('.apply-btn')?.href ?? row.querySelector('a')?.href },
      ];
    }),
  ),
);

await browser.close();
console.log(rows);
console.log(rows.length);
