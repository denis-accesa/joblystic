export type JobBoard = {
  name: string;
  link: string;
  regex: RegExp;
};

export type StaticJobBoard = JobBoard & {
  loader: 'static';
};

export type InfiniteScrollJobBoard = JobBoard & {
  loader: 'infinite-scroll';
};

export type ShowMoreButtonJobBoard = JobBoard & {
  loader: 'show-more-button';
  loaderOptions: {
    buttonLabel: string;
  };
};

export type PaginatedJobBoard = JobBoard & {
  loader: 'pagination';
  loaderOptions: {
    nextButtonLabel: string;
  };
};

export type AnyJobBoard =
  | StaticJobBoard
  | InfiniteScrollJobBoard
  | ShowMoreButtonJobBoard
  | PaginatedJobBoard;

export const boardsData: AnyJobBoard[] = [
  {
    name: 'Cloudflare',
    link: 'https://www.cloudflare.com/careers/jobs/',
    regex: /cloudflare\/jobs\/[a-zA-Z0-9\-]+/,
    loader: 'static',
  },
  {
    name: 'GitLab',
    link: 'https://about.gitlab.com/jobs/all-jobs/',
    regex: /gitlab\/jobs\/[a-zA-Z0-9\-]+/,
    loader: 'static',
  },
  {
    name: 'Atlassian',
    link: 'https://www.atlassian.com/company/careers/all-jobs',
    regex: /company\/careers\/details\/[a-zA-Z0-9\-]+/,
    loader: 'static',
  },
  {
    name: 'HashiCorp',
    link: 'https://www.hashicorp.com/careers/open-positions',
    regex: /career\/[a-zA-Z0-9\-]+/,
    loader: 'show-more-button',
    loaderOptions: {
      buttonLabel: 'Load more',
    },
  },
  {
    name: 'Docker',
    link: 'https://www.docker.com/career-openings/',
    regex: /docker\/[a-zA-Z0-9\-]+/,
    loader: 'static',
  },
  {
    name: 'Elastic',
    link: 'https://jobs.elastic.co/jobs/department/engineering/',
    regex: /jobs\.elastic\.co\/jobs\/engineering/,
    loader: 'static',
  },
  {
    name: 'Okta',
    link: 'https://www.okta.com/company/careers/#careers-job-postings',
    regex: /company\/careers\/[a-zA-Z0-9\-]+/,
    loader: 'static',
  },
  {
    name: 'Netlify',
    link: 'https://www.netlify.com/careers/',
    regex: /netlify\/jobs\/[a-zA-Z0-9\-]+/,
    loader: 'static',
  },
  {
    name: 'MongoDB',
    link: 'https://www.mongodb.com/company/careers/teams/engineering',
    regex: /careers\/job\/\?[a-zA-Z0-9\-]+/,
    loader: 'static',
  },
  {
    name: 'Fastly',
    link: 'https://www.fastly.com/about/careers/current-openings/',
    regex: /fastly.com\/about\/jobs/,
    loader: 'static',
  },
  {
    name: 'Auth0',
    link: 'https://www.okta.com/company/careers/#careers-job-postings',
    regex: /company\/careers\/[a-zA-Z0-9\-]+\/[a-zA-Z0-9\-]+/,
    loader: 'static',
  },
  {
    name: 'Vercel',
    link: 'https://vercel.com/careers',
    regex: /careers\/[a-zA-Z0-9\-]+/,
    loader: 'static',
  },
  {
    name: 'Salesforce',
    link: 'https://careers.salesforce.com/en/jobs/',
    regex: /jobs\/[a-zA-Z0-9\-]+/,
    loader: 'pagination',
    loaderOptions: {
      nextButtonLabel: 'Next page',
    },
  },

  {
    name: 'Red Hat',
    link: 'https://redhat.wd5.myworkdayjobs.com/jobs/',
    regex: /jobs\/job\/[a-zA-Z0-9\-]+/,
    loader: 'pagination',
    loaderOptions: {
      nextButtonLabel: 'next',
    },
  },

  {
    name: 'Stripe',
    link: 'https://stripe.com/jobs/search',
    regex: /jobs\/[a-zA-Z0-9\-]+/,
    loader: 'pagination',
    loaderOptions: {
      nextButtonLabel: 'Next',
    },
  },
  {
    name: 'Snowflake',
    link: 'https://careers.snowflake.com/us/en/search-results',
    regex: /\/job\/[a-zA-Z0-9\-]+/,
    loader: 'pagination',
    loaderOptions: {
      nextButtonLabel: 'View next page',
    },
  },
  // TODO Pagination
  // Unknown timeout
  // {
  //   name: "Datadog",
  //   link: "https://careers.datadoghq.com/engineering/",
  //   regex: /careers\/detail\/[a-zA-Z0-9\-]+/,
  //   loader: 'pagination',
  //   loaderOptions: {
  //     nextButtonLabel: 'Next Page'
  //   }
  // },
  // TODO No aria label
  // {
  //   name: "Confluent",
  //   link: "https://www.confluent.io/careers/",
  //   regex: /careers\/job\/[a-zA-Z0-9\-]+/
  // },
  // TODO Aria label is on li, not on button
  // {
  //   name: "PagerDuty",
  //   link: "https://careers.pagerduty.com/jobs/search",
  //   regex: /careers\/job\/[a-zA-Z0-9\-]+/
  // },
  // TODO Dynamic aria label
  // {
  //   name: 'New Relic',
  //   link: 'https://newrelic.com/about/careers',
  //   regex: /about\/careers\/job\/[a-zA-Z0-9\-]+/,
  // },
  // TODO Cookies
  // {
  //   name: "Twilio",
  //   link: "https://www.twilio.com/en-us/company/jobs",
  //   regex: /twilio\/jobs\/[a-zA-Z0-9\-]+/,
  //   loader: 'show-more-button',
  //   loaderOptions: {
  //     buttonLabel: 'View more',
  //   },
  // },
  // TODO Links are hidden by default. 1 Job has multiple locations with different links
  // {
  //   name: "DigitalOcean",
  //   link: "https://www.digitalocean.com/careers/",
  //   regex: /careers\/job\/[a-zA-Z0-9\-]+/
  // },
  //  TODO Weird show more as a link
  // {
  //   name: "Splunk",
  //   link: "https://www.splunk.com/en_us/careers.html",
  //   regex: /en_us\/careers\/jobs\/[a-zA-Z0-9\-]+/
  // },
];
