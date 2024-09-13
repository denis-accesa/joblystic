import * as fs from 'node:fs';
import puppeteer, { Page } from 'puppeteer';
import { AnyJobBoard, boardsData } from './inputs/boards.data.ts';
import {
  loadPageWithPagination,
  loadPageWithShowMoreButton,
  loadStaticPage,
} from './services/data-loaders.ts';

import { JobPost } from './services/scraper.ts';

const browser = await puppeteer.launch({ headless: false, devtools: true });
const start = performance.now();
const jobPosts = await scrapConcurrently(boardsData, 4);
const end = performance.now();
console.log(`Scraped ${jobPosts.length} jobs in ${(end - start) / 1000}s`);
fs.writeFileSync('job-links.json', JSON.stringify(jobPosts, null));
await browser.close();

async function extractJobLinks(jobBoard: AnyJobBoard) {
  console.info(`[${jobBoard.name}]`, 'Extracting job links');
  const page = await browser.newPage();
  try {
    await page.goto(jobBoard.link);
    const loader = getLoader(jobBoard);
    const jobLinks: JobPost[] = [];
    for await (const links of loader(page)) {
      jobLinks.push(...links.filter((link) => !!link.href.trim()));
    }

    if (!jobLinks.length) {
      console.warn(`[${jobBoard.name}]`, `No job links found`);
    } else {
      console.log(`[${jobBoard.name}]`, `Found ${jobLinks.length} job links for ${jobBoard.name}`);
    }
    return jobLinks;
  } catch (error) {
    console.error(`[${jobBoard.name}]`, `Unable to load ${jobBoard.link}`, error);
    return [];
  } finally {
    console.debug(`[${jobBoard.name}]`, 'Closing page for', jobBoard.name);
    await page.close();
  }
}

function getLoader(jobBoard: AnyJobBoard) {
  switch (jobBoard.loader) {
    case 'static':
      return (page: Page) => loadStaticPage(page, jobBoard);
    case 'infinite-scroll':
      throw Error('Not implemented');
    case 'show-more-button':
      return (page: Page) => loadPageWithShowMoreButton(page, jobBoard);
    case 'pagination':
      return (page: Page) => loadPageWithPagination(page, jobBoard);
  }
}

async function scrapConcurrently(jobBoards: AnyJobBoard[], maxConcurrent: number) {
  const jobPosts: JobPost[][] = [];
  const executing = new Set<string>();
  const allPromises: Promise<unknown>[] = [];

  for (const board of jobBoards) {
    console.debug(`[${board.name}]`, 'Queued');
    if (executing.size >= maxConcurrent) {
      console.debug(`[${board.name}]`, 'waiting');
      await Promise.race(executing);
    }
    const promise = extractJobLinks(board).then((result) => jobPosts.push(result));
    promise.finally(() => {
      console.debug(`[${board.name}]`, 'cleanup');
      executing.delete(board.name);
    });
    executing.add(board.name);
    allPromises.push(promise);
  }

  await Promise.all(allPromises);
  return jobPosts.flat();
}
