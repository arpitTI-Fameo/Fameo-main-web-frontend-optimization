export const orderKeys = {
  all: () => ['order'],
  lists: () => [...orderKeys.all(), 'list'],
  list: (params) => [...orderKeys.lists(), params],
  details: () => [...orderKeys.all(), 'detail'],
  detail: (id) => [...orderKeys.details(), id],
  track: (id) => [...orderKeys.all(), 'track', id],
};
