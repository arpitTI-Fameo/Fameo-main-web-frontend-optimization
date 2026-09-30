'use client';
// modules/Resources/CourseDetail/CourseOverview/index.jsx

import { useEffect, useState } from 'react';
import { ArrowDown, ArrowRight, BookOpen, Check, Clock, Gauge, Layers, Play, Sparkles } from 'lucide-react';
import { COURSES } from '@/constants/courses';
import { ROUTES } from '@/constants/routes';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/shadcn/accordion';
import { Badge } from '@/components/ui/shadcn/badge';
import ArrowButton from '@/components/Common/ArrowButton';
import Breadcrumbs from '@/components/Common/Breadcrumbs';
import CourseCard from '@/components/Common/CourseCard';
import GlassNote from '@/components/Common/GlassNote';
import IconItem from '@/components/Common/IconItem';
import SectionHeading from '@/components/Common/SectionHeading';
import FameoPage from '@/components/Layout/FameoPage';
import { cn } from '@/utils/cn';

import LessonThumb from '../LessonThumb';
import { CURRICULUM_ID, HERO_FALLBACK, QUOTES } from '../constants';
import { courseCrumbs, pad2, splitTitle } from '../helpers';
import { S } from '../styles';

const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;

export default function CourseOverview({ course, allLessons, onOpenLesson }) {
  const [sticky, setSticky] = useState(false);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return; ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        setSticky(y > window.innerHeight * 0.55 &&
          y < document.body.scrollHeight - window.innerHeight * 2);
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const [title, accent] = splitTitle(course.title);
  const chapters = course.chapters || [];
  const nextCourses = COURSES.filter(c => c.slug !== course.slug).slice(0, 3);
  const meta = [plural(allLessons.length, 'lesson'), course.level].filter(Boolean).join(' · ');
  const facts = [
    { icon: BookOpen, label: plural(allLessons.length, 'lesson') },
    { icon: Layers, label: plural(chapters.length, 'chapter') },
    course.duration && { icon: Clock, label: course.duration },
    course.level && { icon: Gauge, label: course.level },
  ].filter(Boolean);

  const start = () => onOpenLesson(allLessons[0].id);
  const jump = () => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.getElementById(CURRICULUM_ID)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  };

  return (
    <FameoPage>
      <Breadcrumbs items={courseCrumbs(course.title)} />

      {/* ── HERO ── */}
      <section className={S.hero}>
        <div className="animate-in fade-in-0 slide-in-from-bottom-2 duration-500 motion-reduce:animate-none">
          <SectionHeading as="h1" size="xl" eyebrow={course.category} title={title} accent={accent} />
          <p className={S.lead}>{course.description || course.subtitle}</p>
          <div className={S.facts}>
            {facts.map(f => <IconItem key={f.label} icon={f.icon} title={f.label} />)}
          </div>
          <div className={S.actions}>
            <ArrowButton variant="primary" icon={ArrowRight} onClick={start}>
              Start learning
            </ArrowButton>
            <ArrowButton icon={ArrowDown} onClick={jump}>View curriculum</ArrowButton>
          </div>
        </div>

        <div className={S.photo}>
          <img
            src={course.heroThumb || course.thumbnail || HERO_FALLBACK}
            alt=""
            draggable="false"
            className="absolute inset-0 size-full object-cover animate-in fade-in-0 duration-700 motion-reduce:animate-none"
            onError={(e) => {
              if (e.currentTarget.src !== HERO_FALLBACK) e.currentTarget.src = HERO_FALLBACK;
            }}
          />
          <GlassNote>
            <Sparkles aria-hidden="true" className="size-4.5 shrink-0 text-primary" />
            <div className="min-w-0">
              <strong className="block truncate text-xs font-medium">{course.subtitle || course.title}</strong>
              <small className="mt-0.5 block text-11 text-muted-foreground">
                Self-paced · Learn on any device
              </small>
            </div>
          </GlassNote>
        </div>
      </section>

      {/* ── WHAT YOU'LL LEARN ── */}
      {course.whatYouLearn?.length > 0 && (
        <section className={S.learn}>
          <SectionHeading eyebrow="What you'll learn" title="Skills you'll" accent="leave with." />
          <ul className={S.learnList}>
            {course.whatYouLearn.map(item => (
              <li key={item} className={S.learnItem}>
                <span aria-hidden="true" className={S.learnIcon}><Check className="size-3" /></span>
                {item}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ── CURRICULUM ── */}
      <section id={CURRICULUM_ID} className="scroll-mt-24 border-t py-10 md:py-14">
        <div className="mb-6 flex flex-col items-start gap-3 md:flex-row md:items-end md:justify-between md:gap-5">
          <SectionHeading
            eyebrow="Curriculum"
            title={`${plural(allLessons.length, 'lesson')},`}
            accent="one chapter at a time."
          />
          <p className="text-xs text-muted-foreground">
            {plural(chapters.length, 'chapter')} · Self-paced
          </p>
        </div>

        <Accordion
          type="multiple"
          defaultValue={chapters.length ? [String(chapters[0].id ?? 0)] : []}
          className="rounded-xl border bg-card px-4 sm:px-6"
        >
          {chapters.map((ch, ci) => (
            <AccordionItem key={ch.id ?? ci} value={String(ch.id ?? ci)}>
              <AccordionTrigger className="items-center gap-4 py-5 hover:no-underline [&>svg]:translate-y-0">
                <span className="w-7 shrink-0 font-serif text-17 font-normal text-muted-foreground/70">
                  {pad2(ci + 1)}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium leading-[1.3] tracking-[-0.02em] text-foreground sm:text-base">
                    {ch.title}
                  </span>
                  <span className="mt-1 block text-11 font-normal text-muted-foreground">
                    {plural(ch.lessons?.length || 0, 'lesson')}
                  </span>
                </span>
              </AccordionTrigger>
              <AccordionContent className="pb-5">
                <ol className="grid gap-1">
                  {(ch.lessons || []).map(l => {
                    const n = allLessons.findIndex(x => x.id === l.id) + 1;
                    const topics = (l.sections || []).map(s => s.heading).slice(0, 3);
                    return (
                      <li key={l.id}>
                        <button
                          type="button"
                          onClick={() => onOpenLesson(l.id)}
                          className="group grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 rounded-lg p-2 text-left outline-none transition-colors hover:bg-muted focus-visible:ring-[3px] focus-visible:ring-ring/50 motion-reduce:transition-none sm:gap-5"
                        >
                          <LessonThumb src={l.thumb} n={n} />
                          <span className="min-w-0">
                            <span className="block text-10 uppercase tracking-[0.16em] text-brand-text">
                              Lesson {pad2(n)}
                            </span>
                            <span className="mt-1 block text-13 font-medium leading-[1.4] text-foreground sm:text-sm">
                              {l.title}
                            </span>
                            {topics.length > 0 && (
                              <span className="mt-2 hidden flex-wrap gap-1.5 sm:flex">
                                {topics.map(t => (
                                  <Badge
                                    key={t}
                                    variant="outline"
                                    className="max-w-full truncate rounded-full px-2.5 py-1 text-10 font-normal text-muted-foreground"
                                  >
                                    {t}
                                  </Badge>
                                ))}
                              </span>
                            )}
                          </span>
                          <span
                            aria-hidden="true"
                            className="grid size-9 place-items-center rounded-full border text-muted-foreground transition-colors group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground motion-reduce:transition-none"
                          >
                            <Play className="size-3.5 translate-x-px fill-current" />
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ol>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* ── QUOTE ── */}
      <section className="border-t py-12 md:py-16">
        <figure className="mx-auto max-w-190 text-center">
          <blockquote className="font-serif text-22 italic leading-[1.4] text-foreground md:text-25">
            &ldquo;{QUOTES[0]}&rdquo;
          </blockquote>
          <figcaption className="mt-5 text-11 uppercase tracking-[0.18em] text-muted-foreground">
            Fameo · {course.category} team
          </figcaption>
        </figure>
      </section>

      {/* ── NEXT COURSES ── */}
      {nextCourses.length > 0 && (
        <section className="border-t pt-10 pb-6 md:pt-14">
          <div className="mb-5 flex items-end justify-between gap-4">
            <SectionHeading title="Continue" accent="your path." />
            <ArrowButton href={ROUTES.COURSES}>All courses</ArrowButton>
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-6 max-[360px]:grid-cols-1 sm:grid-cols-3 sm:gap-x-5">
            {nextCourses.map(c => (
              <CourseCard key={c.slug} course={c} href={ROUTES.COURSE(c.slug)} />
            ))}
          </div>
        </section>
      )}

      {/* ── STICKY START ── */}
      <div
        inert={!sticky}
        className={cn(
          'fixed inset-x-4 bottom-4 z-50 mx-auto flex max-w-md items-center gap-4 rounded-full border bg-card/90 py-2 pr-2 pl-5 shadow-fameo-soft backdrop-blur-md transition-transform duration-500 motion-reduce:transition-none',
          sticky ? 'translate-y-0' : 'translate-y-[calc(100%+var(--spacing)*8)]'
        )}
      >
        <div className="min-w-0 flex-1">
          <p className="truncate text-13 font-medium">{course.title}</p>
          <p className="text-11 text-muted-foreground">{meta}</p>
        </div>
        <ArrowButton
          variant="primary"
          icon={ArrowRight}
          onClick={start}
          className="min-h-10 rounded-full py-2.5 has-[>svg]:px-4.5"
        >
          Start
        </ArrowButton>
      </div>
    </FameoPage>
  );
}
