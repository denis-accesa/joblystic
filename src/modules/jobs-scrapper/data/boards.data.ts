export type JobBoard = {
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

export const boardsData = {
  Cloudflare: {
    link: 'https://www.cloudflare.com/careers/jobs/',
    regex: /cloudflare\/jobs\/[a-zA-Z0-9\-]+/,
    loader: 'static',
  },
  GitLab: {
    link: 'https://about.gitlab.com/jobs/all-jobs/',
    regex: /gitlab\/jobs\/[a-zA-Z0-9\-]+/,
    loader: 'static',
  },
  Atlassian: {
    link: 'https://www.atlassian.com/company/careers/all-jobs',
    regex: /company\/careers\/details\/[a-zA-Z0-9\-]+/,
    loader: 'static',
  },
  HashiCorp: {
    link: 'https://www.hashicorp.com/careers/open-positions',
    regex: /career\/[a-zA-Z0-9\-]+/,
    loader: 'show-more-button',
    loaderOptions: {
      buttonLabel: 'Load more',
    },
  },
  Docker: {
    link: 'https://www.docker.com/career-openings/',
    regex: /docker\/[a-zA-Z0-9\-]+/,
    loader: 'static',
  },
  // Elastic: {
  //   link: 'https://jobs.elastic.co/jobs/department/engineering/',
  //   regex: /jobs\.elastic\.co\/jobs\/engineering/,
  //   loader: 'static',
  // },
  // Okta: {
  //   link: 'https://www.okta.com/company/careers/#careers-job-postings',
  //   regex: /company\/careers\/[a-zA-Z0-9\-]+/,
  //   loader: 'static',
  // },
  // Netlify: {
  //   link: 'https://www.netlify.com/careers/',
  //   regex: /netlify\/jobs\/[a-zA-Z0-9\-]+/,
  //   loader: 'static',
  // },
  // MongoDB: {
  //   link: 'https://www.mongodb.com/company/careers/teams/engineering',
  //   regex: /careers\/job\/\?[a-zA-Z0-9\-]+/,
  //   loader: 'static',
  // },
  // Fastly: {
  //   link: 'https://www.fastly.com/about/careers/current-openings/',
  //   regex: /fastly.com\/about\/jobs/,
  //   loader: 'static',
  // },
  // Auth0: {
  //   link: 'https://www.okta.com/company/careers/#careers-job-postings',
  //   regex: /company\/careers\/[a-zA-Z0-9\-]+\/[a-zA-Z0-9\-]+/,
  //   loader: 'static',
  // },
  // Vercel: {
  //   link: 'https://vercel.com/careers',
  //   regex: /careers\/[a-zA-Z0-9\-]+/,
  //   loader: 'static',
  // },
  // Salesforce: {
  //   link: 'https://careers.salesforce.com/en/jobs/',
  //   regex: /jobs\/[a-zA-Z0-9\-]+/,
  //   loader: 'pagination',
  //   loaderOptions: {
  //     nextButtonLabel: 'Next page',
  //   },
  // },
  // RedHat: {
  //   link: 'https://redhat.wd5.myworkdayjobs.com/jobs/',
  //   regex: /jobs\/job\/[a-zA-Z0-9\-]+/,
  //   loader: 'pagination',
  //   loaderOptions: {
  //     nextButtonLabel: 'next',
  //   },
  // },
  // Stripe: {
  //   link: 'https://stripe.com/jobs/search',
  //   regex: /jobs\/[a-zA-Z0-9\-]+/,
  //   loader: 'pagination',
  //   loaderOptions: {
  //     nextButtonLabel: 'Next',
  //   },
  // },
  // Snowflake: {
  //   link: 'https://careers.snowflake.com/us/en/search-results',
  //   regex: /\/job\/[a-zA-Z0-9\-]+/,
  //   loader: 'pagination',
  //   loaderOptions: {
  //     nextButtonLabel: 'View next page',
  //   },
  // },
  // // TODO Unknown timeout
  // Datadog: {
  //   link: 'https://careers.datadoghq.com/engineering/',
  //   regex: /careers\/detail\/[a-zA-Z0-9\-]+/,
  //   loader: 'pagination',
  //   loaderOptions: {
  //     nextButtonLabel: 'Next Page',
  //   },
  // },
  // // TODO Weird pagination
  // Confluent: {
  //   link: 'https://careers.confluent.io/search/engineering/jobs',
  //   regex: /careers\/job\/[a-zA-Z0-9\-]+/,
  //   loader: 'pagination',
  //   loaderOptions: {
  //     nextButtonLabel: 'next',
  //   },
  // },
  // // TODO Aria label is on li, not on button
  // PagerDuty: {
  //   link: 'https://careers.pagerduty.com/jobs/search?page=1&query=',
  //   regex: /careers\/job\/[a-zA-Z0-9\-]+/,
  //   loader: 'pagination',
  //   loaderOptions: {
  //     nextButtonLabel: '>',
  //   },
  // },
  // // TODO Dynamic aria label
  // NewRelic: {
  //   link: 'https://newrelic.com/about/careers',
  //   regex: /about\/careers\/job\/[a-zA-Z0-9\-]+/,
  //   loader: 'pagination',
  //   loaderOptions: {
  //     nextButtonLabel: 'Go to Next Page',
  //   },
  // },
  // // TODO Cookies
  // Twilio: {
  //   link: 'https://www.twilio.com/en-us/company/jobs',
  //   regex: /twilio\/jobs\/[a-zA-Z0-9\-]+/,
  //   loader: 'show-more-button',
  //   loaderOptions: {
  //     buttonLabel: 'View more',
  //   },
  // },
  // // TODO Links are hidden by default. 1 Job has multiple locations with different links
  // DigitalOcean: {
  //   link: 'https://www.digitalocean.com/careers/',
  //   regex: /careers\/job\/[a-zA-Z0-9\-]+/,
  //   loader: 'static',
  // },
  // // TODO Weird show more as a link
  // Splunk: {
  //   link: 'https://www.splunk.com/en_us/careers.html',
  //   regex: /en_us\/careers\/jobs\/[a-zA-Z0-9\-]+/,
  //   loader: 'show-more-button',
  //   loaderOptions: {
  //     buttonLabel: 'Show more',
  //   },
  // },
} satisfies Record<string, AnyJobBoard>;
