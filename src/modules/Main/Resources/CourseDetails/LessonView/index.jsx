'use client';
// modules/Resources/CourseDetail/LessonView/index.jsx

import { Fragment, useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { ROUTES } from '@/constants/routes';

import { Button } from '@/components/ui/shadcn/button';
import { Card } from '@/components/ui/shadcn/card';
import { Progress } from '@/components/ui/shadcn/progress';
import ArrowButton from '@/components/Common/ArrowButton';
import Breadcrumbs from '@/components/Common/Breadcrumbs';
import Eyebrow from '@/components/Common/Eyebrow';
import FameoPage from '@/components/Layout/FameoPage';
import { cn } from '@/utils/cn';

import LessonThumb from '../LessonThumb';
import { QUOTES } from '../constants';
import { pad2, toParagraphs } from '../helpers';

const sectionId = (i) => `lesson-s${i}`;

export default function LessonView({ course, lesson, allLessons, onNav, onBackToCourse }) {
  const [progress, setProgress] = useState(0);
  const [activeSec, setActiveSec] = useState(0);

  const idx = allLessons.findIndex(l => l.id === lesson.id);
  const prev = idx > 0 ? allLessons[idx - 1] : null;
  const next = idx < allLessons.length - 1 ? allLessons[idx + 1] : null;
  const sections = lesson.sections || [];

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return; ticking = true;
      requestAnimationFrame(() => {
        const h = document.documentElement;
        setProgress((h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight)) * 100);
        let cur = 0;
        sections.forEach((_, i) => {
          const el = document.getElementById(sectionId(i));
          if (el && el.getBoundingClientRect().top < window.innerHeight * 0.4) cur = i;
        });
        setActiveSec(cur);
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [sections.length, lesson.id]);

  const jumpTo = i => e => {
    e.preventDefault();
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.getElementById(sectionId(i))?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  };

  const meta = [course.category, `Lesson ${idx + 1} of ${allLessons.length}`, `${course.level} · Self-paced`];

  return (
    <FameoPage>
      {/* Reading progress, above the fixed site nav. */}
      <Progress
        value={progress}
        aria-label="Reading progress"
        className="fixed inset-x-0 top-0 z-[1000] h-0.5 rounded-none bg-transparent"
      />

      <Breadcrumbs
        items={[
          { label: 'Learning centre', href: ROUTES.RESOURCES },
          { label: course.title, onClick: onBackToCourse },
          { label: `Lesson ${idx + 1}` },
        ]}
      />

      <div className="grid gap-10 pt-6 pb-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,3.4fr)] lg:gap-12 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,3fr)_minmax(0,1.1fr)]">

        {/* ── CONTENTS RAIL ── */}
        <aside className="hidden self-start lg:sticky lg:top-24 lg:block">
          <p className="text-10 uppercase tracking-[0.18em] text-muted-foreground">In this lesson</p>
          <nav aria-label="In this lesson" className="mt-4 border-l">
            {sections.map((s, i) => (
              <a
                key={s.id || i}
                href={`#${sectionId(i)}`}
                onClick={jumpTo(i)}
                aria-current={i === activeSec ? 'location' : undefined}
                className={cn(
                  '-ml-px flex gap-3 border-l-2 border-transparent py-2 pl-4 text-xs leading-[1.5] text-muted-foreground transition-colors hover:text-foreground motion-reduce:transition-none',
                  'aria-[current=location]:border-primary aria-[current=location]:font-medium aria-[current=location]:text-foreground'
                )}
              >
                <span className="font-serif italic text-muted-foreground/80">{pad2(i + 1)}</span>
                {s.heading}
              </a>
            ))}
          </nav>
          <div className="mt-8">
            <Progress value={((idx + 1) / allLessons.length) * 100} aria-label="Position in course" className="h-1 bg-secondary" />
            <p className="mt-2 text-11 text-muted-foreground">
              Lesson {idx + 1} of {allLessons.length}
            </p>
          </div>
        </aside>

        {/* ── ARTICLE ── */}
        <article key={lesson.id} className="min-w-0 animate-in fade-in-0 duration-500 motion-reduce:animate-none">
          <Eyebrow>
            {lesson.chapter?.title} · Lesson {pad2(idx + 1)}
          </Eyebrow>
          <h1 className="mt-4 text-27 font-medium leading-[1.15] tracking-[-0.03em] text-foreground sm:text-34">
            {lesson.title}
          </h1>
          {lesson.intro && (
            <p className="mt-4 whitespace-pre-line font-serif text-17 italic leading-[1.6] text-muted-foreground">
              {lesson.intro}
            </p>
          )}
          <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 border-b pb-6 text-11 uppercase tracking-[0.14em] text-muted-foreground">
            {meta.map((m, i) => (
              <Fragment key={m}>
                {i > 0 && <span aria-hidden="true" className="size-0.75 rounded-full bg-input" />}
                <span>{m}</span>
              </Fragment>
            ))}
          </div>

          {sections.map((sec, si) => {
            const paras = toParagraphs(sec.body);
            const img = sec.image || (si === 0 ? lesson.thumb : null);
            return (
              <section key={sec.id || si} id={sectionId(si)} className="relative mt-12 scroll-mt-28">
                <h2 className="text-17 font-medium leading-[1.3] tracking-[-0.02em] text-foreground sm:text-22">
                  <span className="mr-3 font-serif font-normal italic text-muted-foreground/70">{pad2(si + 1)}</span>
                  {sec.heading}
                </h2>

                {/* Margin notes: inline under the heading; from xl, out in the right
                    column (one grid gap over, 1.1/3 of the article wide). */}
                {sec.notes?.length > 0 && (
                  <div className="mt-5 space-y-3 xl:absolute xl:top-1 xl:left-[calc(100%+var(--spacing)*12)] xl:mt-0 xl:w-[calc(100%*1.1/3)] xl:space-y-7">
                    {sec.notes.map((nt, ni) => (
                      <aside
                        key={ni}
                        className="rounded-r-md border-l-2 border-primary bg-accent/60 px-4 py-3.5 xl:rounded-none xl:border-t-2 xl:border-l-0 xl:bg-transparent xl:px-0 xl:pt-4 xl:pb-0"
                      >
                        {nt.label && (
                          <p className="text-10 font-medium uppercase tracking-[0.18em] text-brand-text">{nt.label}</p>
                        )}
                        <p className="mt-2 text-xs leading-[1.7] text-muted-foreground">{nt.text}</p>
                      </aside>
                    ))}
                  </div>
                )}

                {img && (
                  <figure className="relative my-7 overflow-hidden rounded-lg bg-secondary">
                    <img src={img} alt="" loading="lazy" draggable="false" className="aspect-video w-full object-cover" />
                    <figcaption className="absolute inset-x-0 bottom-0 bg-linear-to-t from-foreground/60 to-transparent px-5 pt-8 pb-3 text-10 uppercase tracking-[0.14em] text-white/85">
                      {sec.heading}
                    </figcaption>
                  </figure>
                )}

                {paras.map((p, pi) => (
                  <p
                    key={pi}
                    className={cn(
                      'mb-4 text-sm leading-[1.85] text-secondary-foreground',
                      pi === 0 && 'first-letter:float-left first-letter:mt-1 first-letter:mr-2.5 first-letter:font-serif first-letter:text-[calc(var(--spacing)*11.5)] first-letter:leading-[0.8] first-letter:text-primary'
                    )}
                  >
                    {p}
                  </p>
                ))}

                {sec.keyPoints?.length > 0 && (
                  <Card className="mt-8 gap-0 rounded-lg border-l-2 border-l-primary bg-muted p-6 shadow-none">
                    <p className="flex items-center gap-2 text-11 font-medium uppercase tracking-[0.18em] text-brand-text">
                      <Sparkles aria-hidden="true" className="size-3.5" />
                      Key points
                    </p>
                    <ul className="mt-3 divide-y">
                      {sec.keyPoints.map((pt, pi) => (
                        <li key={pi} className="flex gap-3 py-2.5 text-13 leading-[1.7] text-secondary-foreground">
                          <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 rounded-full bg-primary/70" />
                          {pt}
                        </li>
                      ))}
                    </ul>
                  </Card>
                )}

                {si === sections.length - 1 && sections.length > 1 && (
                  // Top rule only: the lesson nav's rule below closes it.
                  <blockquote className="mt-10 border-t pt-7 text-center font-serif text-22 italic leading-[1.45] text-foreground">
                    &ldquo;{QUOTES[(idx + 1) % QUOTES.length]}&rdquo;
                  </blockquote>
                )}
              </section>
            );
          })}

          {/* ── LESSON NAV ── */}
          <nav aria-label="Lessons" className="mt-14 flex items-center justify-between gap-4 border-t pt-8">
            <Button
              variant="outline"
              disabled={!prev}
              onClick={() => prev && onNav(prev.id)}
              className="h-auto min-h-11 gap-2 rounded-full bg-card px-5 text-xs font-normal shadow-none"
            >
              <ArrowLeft aria-hidden="true" />
              Previous
            </Button>
            {next ? (
              <ArrowButton variant="primary" icon={ArrowRight} onClick={() => onNav(next.id)}>
                Next lesson
              </ArrowButton>
            ) : (
              <ArrowButton variant="primary" icon={ArrowRight} onClick={onBackToCourse}>
                Back to the course
              </ArrowButton>
            )}
          </nav>

          {next && (
            <div className="mt-10">
              <p className="mb-3 text-10 uppercase tracking-[0.18em] text-muted-foreground">Up next</p>
              <button
                type="button"
                onClick={() => onNav(next.id)}
                className="group grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 rounded-xl border bg-card p-3 text-left shadow-fameo-soft outline-none transition-shadow hover:shadow-fameo-rose focus-visible:ring-[3px] focus-visible:ring-ring/50 motion-reduce:transition-none sm:gap-5"
              >
                <LessonThumb src={next.thumb} n={idx + 2} />
                <span className="min-w-0">
                  <span className="block truncate text-10 uppercase tracking-[0.16em] text-brand-text">
                    Lesson {pad2(idx + 2)} · {next.chapter?.title}
                  </span>
                  <span className="mt-1 block text-13 font-medium leading-[1.4] text-foreground sm:text-sm">
                    {next.title}
                  </span>
                </span>
                <ArrowRight
                  aria-hidden="true"
                  className="mr-2 size-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-foreground motion-reduce:transition-none"
                />
              </button>
            </div>
          )}
        </article>

        {/* Right gutter for the margin notes. */}
        <div aria-hidden="true" className="hidden xl:block" />
      </div>
    </FameoPage>
  );
}
