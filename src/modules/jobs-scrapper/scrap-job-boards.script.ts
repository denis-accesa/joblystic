import { config } from 'dotenv';
import * as fs from 'node:fs';
import puppeteer, { Page } from 'puppeteer';
import { JobPost } from '../../models/jobs.model.ts';
import { AnyJobBoard, boardsData } from './data/boards.data.ts';
import {
  loadPageWithPagination,
  loadPageWithShowMoreButton,
  loadStaticPage,
} from './services/data-loaders.service.ts';
import { pickEngineeringJobs } from './services/pick-engineering-jobs.service.ts';

config();
const browser = await puppeteer.launch({ headless: true });
const start = performance.now();
const jobPosts = await scrapConcurrently(boardsData, 4);
const end = performance.now();
console.log(`Scraped ${jobPosts.length} jobs in ${(end - start) / 1000}s`);
fs.writeFileSync('job-links.json', JSON.stringify(jobPosts, null));
await browser.close();

async function extractJobLinks(company: string, jobBoard: AnyJobBoard) {
  console.info(`[${company}]`, 'Extracting job links');
  const page = await browser.newPage();
  try {
    await page.goto(jobBoard.link);
    const loader = getLoader(jobBoard);
    const allJobs: JobPost[] = [];
    for await (const links of loader(page)) {
      allJobs.push(
        ...links
          .filter((link) => !!link.href.trim())
          .map(
            (link): JobPost => ({
              ...link,
              status: 'new',
              firstSeenOn: new Date(),
              company: company,
            }),
          ),
      );
    }

    if (!allJobs.length) {
      console.warn(`[${company}]`, `No job links found`);
    } else {
      console.log(`[${company}]`, `Found ${allJobs.length} job links for ${company}`);
    }
    const engineeringJobTitles = new Set(await pickEngineeringJobs(allJobs));
    console.debug(`[${company}]`, `Found ${engineeringJobTitles.size} engineering jobs`);
    const engineeringJobs = allJobs.filter((job) => engineeringJobTitles.has(job.title));
    console.debug(`[${company}]`, `Removed ${allJobs.length - engineeringJobs.length} jobs`);
    return engineeringJobs;
  } catch (error) {
    console.error(`[${company}]`, `Unable to load ${jobBoard.link}`, error);
    return [];
  } finally {
    console.debug(`[${company}]`, 'Closing page for', company);
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

async function scrapConcurrently(jobBoards: Record<string, AnyJobBoard>, maxConcurrent: number) {
  const jobPosts: JobPost[][] = [];
  const executing = new Set<string>();
  const allPromises: Promise<unknown>[] = [];

  for (const [company, board] of Object.entries(jobBoards)) {
    console.debug(`[${company}]`, 'Queued');
    if (executing.size >= maxConcurrent) {
      console.debug(`[${company}]`, 'waiting');
      await Promise.race(executing);
    }
    const promise = extractJobLinks(company, board).then((result) => jobPosts.push(result));
    promise.finally(() => {
      console.debug(`[${company}]`, 'cleanup');
      executing.delete(company);
    });
    executing.add(company);
    allPromises.push(promise);
  }

  await Promise.all(allPromises);
  return jobPosts.flat();
}
