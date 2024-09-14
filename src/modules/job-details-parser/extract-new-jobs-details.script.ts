import { config } from 'dotenv';
import puppeteer, { Page } from 'puppeteer';
import { JobPostDTO } from '../../models/jobs.model.ts';
import { withPool } from '../../utils/promise.utils.ts';
import { GetJobPostsResponse } from '../worker/request.types.ts';
import { extractJobDetails } from './services/extract-job-details.service.ts';

config();
const browser = await puppeteer.launch({ headless: true });
const start = performance.now();
await retrieveJobDetails();
const end = performance.now();
console.log(`Execution time: ${end - start} ms`);
await browser.close();

async function retrieveJobDetails() {
  const newJobs = await getAllNewJobs();
  await withPool(3, newJobs, async (job) => {
    const page = await browser.newPage();
    try {
      console.debug(`[${job.company}]`, `Loading ${job.link}`);
      await page.goto(job.link);
      const jobDescription = await getDescription(page);
      const jobDetails = await extractJobDetails(jobDescription);
      await fetch(`${process.env.WORKER_URL!}/api/job-posts/${job.id}`, {
        method: 'PUT',
        body: JSON.stringify(jobDetails),
      });
    } catch (error) {
      console.error(`[${job.company}]`, `Unable to load ${job.link}`, error);
    } finally {
      await page.close();
    }
  });
}

async function getAllNewJobs() {
  const allResults: JobPostDTO[] = [];
  let totalResults = Infinity;
  while (allResults.length < totalResults) {
    const response = await getNewJobs({ offset: allResults.length });
    totalResults = response.totalResults;
    allResults.push(...response.results);
  }
  return allResults;
}

async function getNewJobs({ offset = 0, limit = 24 } = {}) {
  const newJobsResponse = await fetch(
    `${process.env.WORKER_URL!}/api/job-posts?status=new&limit=${limit}&offset=${offset}`,
  );
  if (!newJobsResponse.ok) throw Error('Unable to retrieve new jobs');
  return (await newJobsResponse.json()) as GetJobPostsResponse;
}

async function getDescription(page: Page) {
  try {
    return await page
      .locator('::-p-aria([role="main"])')
      .map((el) => el.textContent!)
      .setTimeout(5000)
      .wait();
  } catch {
    return await page
      .locator('body')
      .map((el) => el.textContent!)
      .setTimeout(5000)
      .wait();
  }
}
