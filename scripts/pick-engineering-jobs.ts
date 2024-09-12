import { config } from 'dotenv';
import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { z } from 'zod';
import jobs from '../job-links.json';

config();
const client = new OpenAI();

const jobTitles = jobs.map((job) => `* ${job.title}`);

const stringArray = z.array(z.string());

const response = await client.beta.chat.completions.parse({
  model: 'gpt-4o-mini',
  messages: [
    {
      role: 'user',
      content: `
I have a list of jobs of different categories, and I'd like you to filter it returning only jobs that are related to software engineering.
Some examples of software engineering jobs are: software engineer, software developer, software architect, frontend engineer, backend engineer, data engineer, platform engineer, technical support, fullstack engineer.
Pick software engineering related jobs from this list:

${jobTitles.join('\n')}
`,
    },
  ],
  response_format: zodResponseFormat(
    z.object({ softwareEngineeringJobs: stringArray }),
    'jobCategories',
  ),
  temperature: 0.2,
});

console.log(response.choices[0].message.parsed);
console.log(response.choices[0].message.parsed?.softwareEngineeringJobs.length, 'jobs');
console.log(response.usage);
