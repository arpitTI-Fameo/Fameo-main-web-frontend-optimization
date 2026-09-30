// components/Common/Polaroid/index.jsx
// A photo on a white instant-print card with a caption strip underneath.
// Width and tilt come from `className`; the photo keeps a 29:32 frame and
// `imageClassName` can crop in on it (`scale-150 origin-[40%_40%]`).
//
//   <Polaroid src="/assets/…" caption="For your next idea" icon={ArrowUpRight}
//             className="w-40 rotate-12" />
//
// Padding, corners and caption are sized in em off the card's font-size
// (12px by default), so `text-[2.2cqw]` scales the whole card in a container.
// Needs a `.fameo-theme` ancestor for its colors.

import Image from 'next/image';

import { cn } from '@/utils/cn';

export default function Polaroid({ src, alt = '', caption, icon: Icon, sizes = '160px', className, imageClassName }) {
  return (
    <figure
      className={cn(
        'rounded-[1em] bg-card p-[0.58em] text-xs shadow-[0_16px_32px_rgb(57_46_69/0.13)]',
        className
      )}
    >
      <div className="relative aspect-[29/32] overflow-hidden rounded-[0.67em] bg-secondary">
        <Image src={src} alt={alt} fill sizes={sizes} className={cn('object-cover', imageClassName)} />
      </div>
      {caption && (
        <figcaption className="flex items-center gap-[0.33em] px-[0.5em] pt-[0.8em] pb-[0.3em] leading-[1.33] tracking-[0.02em] text-secondary-foreground">
          {caption}
          {Icon && <Icon aria-hidden="true" className="size-[1em] shrink-0" />}
        </figcaption>
      )}
    </figure>
  );
}
