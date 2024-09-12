import { Page } from 'puppeteer';
import { JobBoard } from '../boards.data.ts';

export class WebScraper {
  async scrape(page: Page, { regex }: JobBoard): Promise<JobPost[]> {
    return (
      await page.evaluate(() => {
        return Array.from(document.querySelectorAll('a')).map((link) => ({
          title: link.textContent!.trim(),
          href: link.href,
        }));
      }, regex)
    ).filter((link) => regex.test(link.href));
  }
}

export type JobPost = {
  href: string;
  title: string;
};
