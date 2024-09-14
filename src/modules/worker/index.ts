import type { ExportedHandler } from '@cloudflare/workers-types';
import { JobDetailsSchema, JobPost, JobPostDTO, JobPostSchema } from '../../models/jobs.model.ts';
import { z } from 'zod';
import { Hono } from 'hono';
import { GetJobPostsResponse } from './request.types.ts';

const app = new Hono<{ Bindings: Env }>();

app.post('/api/job-posts', async ({ env, req, json }) => {
  const jobs = z.array(JobPostSchema).parse(await req.json());
  await storeJobPosts(env, jobs);
  return json(true);
});

app.get('/api/job-posts', async ({ env, req, json }) => {
  const status = req.query('status');
  const offset = req.query('offset') ?? 0;
  const limit = req.query('limit') ?? 24;
  const {
    results: [{ totalResults }],
  } = await env.DB.prepare('SELECT COUNT(*) as totalResults FROM JobPosts WHERE status=?')
    .bind(status)
    .run<{ totalResults: number }>();
  const { results } = await env.DB.prepare('SELECT * FROM JobPosts WHERE status=? LIMIT ? OFFSET ?')
    .bind(status, limit, offset)
    .run<JobPostDTO>();
  return json<GetJobPostsResponse>({ results, totalResults });
});

export default app satisfies ExportedHandler<Env>;

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

app.put('/api/job-posts/:jobId', async ({ env, req, json }) => {
  const jobId = req.param('jobId');
  const jobDetails = JobDetailsSchema.parse(await req.json());
  await env.DB.prepare(
    'UPDATE JobPosts SET category=?, salary=?, location=?, workMode=?, status=? WHERE id=?',
  )
    .bind(
      jobDetails.category,
      jobDetails.salary,
      jobDetails.location,
      jobDetails.workMode.join('|'),
      'crawled' satisfies JobPost['status'],
      jobId
    )
    .run();
  return json({ status: 'updated' });
});
