import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { config } from 'dotenv';
import job from '../job-description.json';
import { z } from 'zod';

config();
const client = new OpenAI();

const jobSchema = z.object({
  category: z.enum(['frontend', 'backend', 'fullstack', 'data', 'platform']),
  salary: z.string().optional(),
  location: z.string(),
  remote: z.array(z.enum(['remote', 'hybrid', 'onsite'])),
});

const response = await client.beta.chat.completions.parse({
  model: 'gpt-4o-mini',
  messages: [
    {
      role: 'user',
      content: `
Extract from the following job description this fields. Rely only on knowledge from the job description:
* Category in: frontend, backend, fullstack, data, platform
* Salary (if it's present)
* Location
* If it allows remote, hybrid, or it's onsite

<job>
${job.description}
</job>
`,
    },
  ],
  response_format: zodResponseFormat(jobSchema, 'job'),
  temperature: 0.2,
});

console.log(response.choices[0].message.parsed);
console.log(response.usage);
