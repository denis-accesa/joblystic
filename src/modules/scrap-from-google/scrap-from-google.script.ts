import puppeteer from 'puppeteer';
import { writeFileSync } from 'node:fs';
async function scrapGoogleLinks(siteLink: string) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  const searchQuery = `site:${siteLink}`;

  try {
    // Open Google
    await page.goto(`https://www.google.com/search?q=${searchQuery}`);

    // Wait for the results to load
    const rejectCookiesBtn = await page.$('::-p-aria([name="Rechazar todo"][role="button"])');
    if (rejectCookiesBtn) {
      await rejectCookiesBtn.click();
    }

    // Extract all links from the search results
    const allLinks = new Set<string>();
    do {
      await page.waitForSelector('#search');
      console.log('results loaded');
      await page.waitForFunction(
        (targetLink) => {
          const anchorElements = Array.from(document.querySelectorAll('a')).filter((link) =>
            link.href.startsWith(targetLink),
          );
          return anchorElements.length > 0;
        },
        {},
        siteLink,
      );
      const links = await page.evaluate((targetLink) => {
        const anchorElements = Array.from(document.querySelectorAll('a')).filter((link) =>
          link.href.startsWith(targetLink),
        );
        return anchorElements.map((anchor) => anchor.href);
      }, siteLink);
      links.forEach((link) => allLinks.add(link));
      const nextPage = await page.$('::-p-aria([name="Siguiente"][role="link"])');

      if (nextPage) {
        await nextPage.click();
        console.log('clicked')
      } else {
        writeFileSync('links.json', JSON.stringify(Array.from(allLinks)));
        return;
      }
    } while (true);
  } catch (error) {
    console.error('Error scraping Google:', error);
  } finally {
    // await browser.close();
  }
}

// Example usage
await scrapGoogleLinks('https://boards.greenhouse.io/embed/job_board');
