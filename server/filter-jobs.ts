import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { config } from 'dotenv';
import jobs from '../job-links.json';
import { z } from 'zod';

config();
const client = new OpenAI({
  // apiKey: process.env['OPENAI_API_KEY'], // This is the default and can be omitted
});

const jobTitles = jobs.map((job) => `* ${job.title}`);

const stringArray = z.array(z.string());

const categorizedJobsSchema = z.object({
  frontend: stringArray,
  backend: stringArray,
  fullstack: stringArray,
  data: stringArray,
  platform: stringArray,
});

const response = await client.beta.chat.completions.parse({
  model: 'gpt-4o-mini',
  messages: [
    {
      role: 'user',
      content: `
I have a list of job titles, and I would like you to help categorize them into one of three categories: frontend, backend, or data. The categorization should be based on the common responsibilities and technologies associated with the roles. Please categorize each job title as follows:

Frontend engineering: Jobs that typically involve UI/UX development, HTML, CSS, JavaScript frameworks (React, Angular, Vue, etc.), and design-related responsibilities.
Backend engineering: Jobs that focus on server-side development, databases, APIs, and programming languages like Python, Java, C#, Node.js, etc.
Data engineering: Jobs that involve data engineering, data science, machine learning, statistics, or working with data pipelines and analytics.
Platform engineering: Jobs that involve building and maintaining the infrastructure, deployment pipelines, and cloud services.
Fullstack engineering: Jobs that require a combination of frontend and backend skills.


If one job does not fit into any category, remove it from the output.
Categorize this jobs:

Frontend developer
Web developer
cooker
backend engineer
Front-end engineer (DSL)
full-stack developer @ core
recruiter
`.trim(),
    },
    {
      role: 'assistant',
      content: `
frontend
* Frontend developer
* Web developer
* Front-end engineer (DSL)

backend
* backend engineer

full stack
full-stack developer @ core
`,
    },
    {
      role: 'user',
      content: `
Categorize this jobs:

${jobTitles.join('\n')}
`,
    },
  ],
  response_format: zodResponseFormat(categorizedJobsSchema, 'jobCategories'),
});

console.log(response.choices[0].message.content);
console.log(response.choices[0].message.parsed);
console.log(response.usage);
