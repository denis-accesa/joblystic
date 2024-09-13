import { z } from 'zod';

export const JobDetailsSchema = z.object({
  category: z.enum(['frontend', 'backend', 'fullstack', 'data', 'platform']),
  salary: z.string().optional(),
  location: z.string(),
  workMode: z.array(z.enum(['remote', 'hybrid', 'onsite'])),
})

export const JobPostSchema = z.object({
  company: z.string(),
  title: z.string(),
  href: z.string(),
  status: z.enum(['new', 'crawled', 'disabled']),
  firstSeenOn: z.date(),
  details: JobDetailsSchema.optional(),
});

export type JobDetails = z.infer<typeof JobDetailsSchema>;
export type JobPost = z.infer<typeof JobPostSchema>;

