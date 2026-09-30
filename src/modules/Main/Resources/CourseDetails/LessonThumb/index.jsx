// modules/Resources/CourseDetail/LessonThumb/index.jsx
// A lesson's 16:10 thumbnail, its number set in the corner. Zooms on hover of
// the nearest `group`.

import { cn } from '@/utils/cn';

import { pad2 } from '../helpers';

export default function LessonThumb({ src, n, className }) {
  return (
    <span
      className={cn(
        'relative block aspect-[16/10] w-26 shrink-0 overflow-hidden rounded-md bg-secondary sm:w-34',
        className
      )}
    >
      {src && (
        <img
          src={src}
          alt=""
          loading="lazy"
          draggable="false"
          className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.05] motion-reduce:transition-none"
        />
      )}
      <span aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-foreground/55 to-transparent to-60%" />
      {n != null && (
        <span aria-hidden="true" className="absolute bottom-1 left-2 font-serif text-17 leading-normal text-white">
          {pad2(n)}
        </span>
      )}
    </span>
  );
}
