import { JobPost, JobPostDTO } from '../../models/jobs.model.ts';

export type GetJobPostsRequest = {
  status?: JobPost['status'];
  offset?: number;
  limit?: number;
};

export type GetJobPostsResponse = {
  results: JobPostDTO[];
  totalResults: number;
};
