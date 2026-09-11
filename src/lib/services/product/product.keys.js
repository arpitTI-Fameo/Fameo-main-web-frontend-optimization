export const productKeys = {
  all: () => ['product'],
  lists: () => [...productKeys.all(), 'list'],
  list: (params) => [...productKeys.lists(), params],
  details: () => [...productKeys.all(), 'detail'],
  detail: (slug) => [...productKeys.details(), slug],
  featured: () => [...productKeys.all(), 'featured'],
  bestsellers: () => [...productKeys.all(), 'bestsellers'],
};
