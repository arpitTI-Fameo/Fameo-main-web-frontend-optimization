'use client';
// modules/Resources/CourseBrowse/index.jsx

import { COURSE_CATEGORIES } from '@/constants/courses';

import ChipGroup from '@/components/Common/ChipGroup';
import CourseCard from '@/components/Common/CourseCard';

const CATEGORY_ITEMS = COURSE_CATEGORIES.map(cat => ({ value: cat, label: cat }));

export default function CourseBrowse({ browseRef, activeCat, setActiveCat, browseList, prefetchCourse, openCourse }) {
    return (
    <div className="scroll-mt-24" ref={browseRef}>
      <ChipGroup
        size="sm"
        aria-label="Course topics"
        className="mb-5"
        items={CATEGORY_ITEMS}
        value={activeCat}
        onValueChange={(cat) => { if (cat) setActiveCat(cat); }}
      />
      <p aria-live="polite" className="mb-4 text-xs text-muted-foreground">
        {activeCat === "All" ? "Explore the library" : `${activeCat} · Your selected focus`}
      </p>
      <div className="grid grid-cols-2 gap-x-3 gap-y-5 max-[360px]:grid-cols-1 sm:grid-cols-3 sm:gap-x-5 sm:gap-y-6">
        {browseList.map(c => (
          <CourseCard
            key={c.id || c.slug}
            course={c}
            onOpen={openCourse}
            onPrefetch={prefetchCourse}
          />
        ))}
      </div>
    </div>
    );
}
