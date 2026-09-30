'use client';
// modules/Resources/CourseShowcase/index.jsx

import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';

import { Badge } from '@/components/ui/shadcn/badge';
import { Button } from '@/components/ui/shadcn/button';
import { Card } from '@/components/ui/shadcn/card';
import ArrowButton from '@/components/Common/ArrowButton';
import Eyebrow from '@/components/Common/Eyebrow';
import SectionHeading from '@/components/Common/SectionHeading';

const ROUND_BTN = 'size-9.25 rounded-full shadow-none pointer-coarse:size-11';

export default function CourseShowcase({ showPausedRef, showcase, showIdx, prefetchCourse, openCourse, goShow }) {
    const course = showcase[showIdx];
    if (!course) return null;

    return (
    <div>
      <div className="mb-5 flex flex-col items-start gap-3 md:flex-row md:items-end md:justify-between md:gap-5">
        <SectionHeading title="Your next chapter" accent="starts with a little know-how." />
        <p className="text-xs leading-[1.75] text-muted-foreground md:max-w-56.25">
          Go deeper into the skills that move your creative life forward.
        </p>
      </div>

      <div
        onMouseEnter={() => { showPausedRef.current = true; }}
        onMouseLeave={() => { showPausedRef.current = false; }}
      >
        <Card
          key={course.id || showIdx}
          onMouseEnter={() => prefetchCourse(course)}
          className="grid gap-0 overflow-hidden rounded-xl bg-linear-115 from-muted to-card py-0 shadow-none animate-in fade-in-0 duration-500 motion-reduce:animate-none sm:grid-cols-[1.25fr_1fr]"
        >
          <button
            type="button"
            onClick={() => openCourse(course)}
            aria-label={`Open ${course.title}`}
            className="group relative min-h-51.25 overflow-hidden outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 sm:min-h-68.5"
          >
            <img
              src={course.heroThumb || course.thumbnail}
              alt=""
              draggable="false"
              className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none"
            />
            <span aria-hidden="true" className="absolute inset-x-0 top-[40%] bottom-0 bg-linear-to-b from-transparent to-foreground/45" />
            <Badge
              variant="secondary"
              className="absolute bottom-4.5 left-4.75 z-[1] gap-1.5 rounded-full bg-card/95 px-3 py-2 text-11 font-normal text-secondary-foreground [&>svg]:size-3.5 [&>svg]:text-primary"
            >
              <Sparkles aria-hidden="true" />
              In the spotlight
            </Badge>
          </button>

          <div className="flex flex-col items-start justify-center p-6 md:px-7 md:py-7">
            <Eyebrow>{course.category}</Eyebrow>
            <h3 className="mt-3.5 mb-3 text-27 font-medium leading-[1.13] tracking-[-0.02em] md:text-30">
              {course.title}
            </h3>
            <p className="line-clamp-3 text-13 leading-[1.75] text-muted-foreground">
              {course.description || course.subtitle}
            </p>
            <ArrowButton className="mt-3" onClick={() => openCourse(course)}>
              Explore the course
            </ArrowButton>
          </div>
        </Card>

        <div className="mt-3.5 mb-8 flex items-center justify-between gap-4">
          <span className="hidden text-11 text-muted-foreground sm:inline">The featured edit</span>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" size="icon" className={ROUND_BTN} onClick={() => goShow(showIdx - 1)} aria-label="Previous featured course">
              <ArrowLeft aria-hidden="true" />
            </Button>
            <div className="flex gap-1 px-2">
              {showcase.map((c, i) => (
                <button
                  key={c.id || i}
                  type="button"
                  onClick={() => goShow(i)}
                  aria-label={`Show ${c.title}`}
                  aria-current={i === showIdx ? 'true' : undefined}
                  className="h-6.25 w-5.25 rounded-sm py-2.75 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 pointer-coarse:w-7 after:block after:h-0.75 after:rounded-full after:bg-input after:transition-colors after:content-[''] aria-[current=true]:after:bg-primary"
                />
              ))}
            </div>
            <Button variant="outline" size="icon" className={ROUND_BTN} onClick={() => goShow(showIdx + 1)} aria-label="Next featured course">
              <ArrowRight aria-hidden="true" />
            </Button>
          </div>
        </div>
      </div>
    </div>
    );
}
