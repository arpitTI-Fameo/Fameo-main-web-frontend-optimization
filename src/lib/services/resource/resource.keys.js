export const resourceKeys = {
  all: () => ['resource'],
  courses: () => [...resourceKeys.all(), 'courses'],
  course: (slug) => [...resourceKeys.courses(), slug],
  articles: () => [...resourceKeys.all(), 'articles'],
  article: (slug) => [...resourceKeys.articles(), slug],
  learnings: () => [...resourceKeys.all(), 'learnings'],
  saved: () => [...resourceKeys.all(), 'saved'],
};
