import { Ollama } from 'ollama';
import puppeteer from 'puppeteer';

const models = {
  llama: 'llama3.1',
  mistral: 'mistral-nemo',
};

const ollama = new Ollama();
const browser = await puppeteer.launch({ headless: false });

const start = performance.now();
await scrapAll();
const end = performance.now();

console.log('Taken time:', (end - start) / 1000);
async function scrapAll() {
  for (const url of [
    'https://www.8vc.com/jobs#job-listings',
    'https://www.joinviolet.com/careers',
    'https://careers.strong.io/',
    'https://jobs.lever.co/modern-age',
    'https://fleetstudio.freshteam.com/jobs',
    'https://job-boards.greenhouse.io/wellsaidlabs',
    'https://boards.greenhouse.io/embed/job_board?for=matik&b=https%3A%2F%2Fwww.matik.io%2Fcareer',
  ]) {
    const allLinks = await scrapeJobPage(url);
    const jobLinks = await extractJobLinks(allLinks, models.llama);
    const basePath = await extractBasePath(jobLinks, models.llama);
    console.log(basePath);
  }
}

async function scrapeJobPage(url: string) {
  const page = await browser.newPage();
  await page.goto(url);
  await page.waitForNetworkIdle();
  const linkElements = await page.evaluate(() => {
    const linkElements = document.querySelectorAll('a');
    return Array.from(linkElements).map((link) => `<a href="${link.href}">${link.textContent}</a>`);
  });
  await page.close();
  return linkElements;
}

async function extractJobLinks(links: string[], model: string) {
  const response = await ollama.chat({
    model,
    format: 'json',
    options: { temperature: 0.2 },
    messages: [
      {
        role: 'user',
        content: `
\`\`\`
  ${links.join('\n')}
\`\`\`

From the previous anchor elements extract all the links that look like a job offer. If there are no jobs, return an empty array. Answer with an object matching this type:
\`{ links: string[] }\`
  `,
      },
    ],
  });
  return JSON.parse(response.message.content).links as string[];
}

async function extractBasePath(links: string[], model: string): Promise<string> {
  const response = await ollama.chat({
    model,
    format: 'json',
    options: { temperature: 0.2 },
    messages: [
      {
        role: 'user',
        content: `
\`\`\`
  ${links.join(',')}
\`\`\`

From the previous links extract the base url for all links. Answer with a string matching this type:
\`{ basePath: string }\`
  `,
      },
    ],
  });
  return JSON.parse(response.message.content).basePath;
}
