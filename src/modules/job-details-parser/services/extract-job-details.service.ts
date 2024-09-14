import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { JobDetailsSchema } from '../../../models/jobs.model.ts';

export async function extractJobDetails(jobDescription: string) {
  const client = new OpenAI();
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
${jobDescription}
</job>
`,
      },
    ],
    response_format: zodResponseFormat(JobDetailsSchema, 'jobDetails'),
    temperature: 0.2,
  });
  console.debug('[extractJobDetails]', `Spent ${response.usage?.total_tokens} tokens`);
  return response.choices[0].message.parsed!;
}
