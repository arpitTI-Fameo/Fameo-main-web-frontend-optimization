export const creatorKeys = {
  all: () => ['creator'],
  lists: () => [...creatorKeys.all(), 'list'],
  detail: (id) => [...creatorKeys.all(), 'detail', id],
  me: () => [...creatorKeys.all(), 'me'],
};
