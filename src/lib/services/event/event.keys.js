export const eventKeys = {
  all: () => ['event'],
  list: (status) => [...eventKeys.all(), 'list', status],
  live: () => [...eventKeys.all(), 'live'],
  detail: (id) => [...eventKeys.all(), 'detail', id],
  qa: (id) => [...eventKeys.detail(id), 'qa'],
  replay: (id) => [...eventKeys.detail(id), 'replay'],
  discussion: (id) => [...eventKeys.detail(id), 'discussion'],
};
