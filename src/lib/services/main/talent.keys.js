export const talentKeys = {
  all: () => ['talent'],
  jobs: () => [...talentKeys.all(), 'jobs'],
  job: (id) => [...talentKeys.jobs(), id],
  applications: () => [...talentKeys.all(), 'applications'],
};
