// modules/Resources/CourseDetail/styles.js
// Layout classes for the top of the course page, shared with CourseSkeleton so
// the loading screen occupies exactly the space the loaded page will. Change
// them here, never in only one of the two components.

export const S = {
  hero: 'grid items-center gap-7 pt-6 pb-10 sm:grid-cols-[1.05fr_1fr] sm:gap-6 md:gap-11 md:pb-14',
  lead: 'mt-5 line-clamp-3 min-h-[3lh] max-w-105 text-sm leading-[1.75] text-muted-foreground',
  facts: 'mt-6 flex flex-wrap items-center gap-x-5 gap-y-2.5',
  actions: 'mt-7 flex flex-wrap items-center gap-5',
  photo: 'relative h-64 overflow-hidden rounded-xl rounded-tl-[calc(var(--spacing)*21.25)] bg-secondary sm:h-78 md:h-90',
  learn: 'grid gap-6 border-t py-10 md:grid-cols-[1fr_1.6fr] md:gap-11 md:py-14',
  learnList: 'grid gap-3 sm:grid-cols-2',
  learnItem: 'flex items-start gap-3 rounded-lg border bg-card p-4 text-13 leading-[1.6] text-secondary-foreground',
  learnIcon: 'grid size-5 shrink-0 place-items-center rounded-full bg-accent text-primary',
};
