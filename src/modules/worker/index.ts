import type { ExportedHandler } from '@cloudflare/workers-types';
import { JobPost, JobPostSchema } from '../../models/jobs.model.ts';
import { z } from 'zod';

export default {
  async fetch(request, env): Promise<Response> {
    const jobs = z.array(JobPostSchema).parse(await request.json());
    await storeJobPosts(env, jobs);
    const { results } = await env.DB.prepare('SELECT * FROM JobPosts').run();
    return Response.json(results);
  },
} satisfies ExportedHandler<Env>;

function storeJobPosts(env: Env, jobs: JobPost[]) {
  return Promise.all([
    jobs.map(async (job) => {
      await env.DB.prepare(
        `INSERT OR IGNORE INTO JobPosts (company, title, link, status, firstSeenOn) VALUES (?, ?, ?, ?, ?)`,
      )
        .bind(job.company, job.title, job.link, job.status, job.firstSeenOn.toISOString())
        .run();
    }),
  ]);
}
