import { Page } from 'puppeteer';
import { JobBoard, PaginatedJobBoard, ShowMoreButtonJobBoard } from '../boards.data.ts';

async function loadData(page: Page, jobBoard: JobBoard) {
  await page.waitForFunction(
    (regexString) => {
      const regex = new RegExp(regexString);
      return (
        Array.from(document.querySelectorAll('a')).filter(
          (link) => regex.test(link.href) && !!(link.textContent || link.ariaLabel),
        ).length > 0
      );
    },
    { timeout: 5000 },
    jobBoard.regex.source,
  );
  return await page.evaluate((regexString) => {
    const regex = new RegExp(regexString);
    return Array.from(document.querySelectorAll('a'))
      .filter((link) => (regex.test(link.href) && !!link.textContent) || link.ariaLabel)
      .map((link) => ({
        title: (link.textContent || link.ariaLabel)!.trim(),
        href: link.href,
      }));
  }, jobBoard.regex.source);
}

export async function* loadStaticPage(page: Page, jobBoard: JobBoard) {
  await page.waitForNetworkIdle();
  yield loadData(page, jobBoard);
}

export async function* loadPageWithShowMoreButton(page: Page, jobBoard: ShowMoreButtonJobBoard) {
  await page.waitForNetworkIdle();
  const selector = `::-p-aria([name="${jobBoard.loaderOptions.buttonLabel}"][role="button"])`;

  while (await page.$(selector)) {
    await page.locator(selector).click();
    await page.waitForNetworkIdle();
  }

  yield loadData(page, jobBoard);
}

export async function* loadPageWithPagination(page: Page, jobBoard: PaginatedJobBoard) {
  await page.waitForNetworkIdle();
  yield loadData(page, jobBoard);

  const selector = `::-p-aria([name="${jobBoard.loaderOptions.nextButtonLabel}"][role="button"]), ::-p-aria([name="${jobBoard.loaderOptions.nextButtonLabel}"][role="link"])`;
  while (await page.$(selector)) {
    await page.locator(selector).click();
    await page.waitForNetworkIdle();
    yield loadData(page, jobBoard);
  }
}
