// components/Common/StoryHeadline/index.jsx
// The two-line editorial headline of the auth pages:
//
//   <StoryHeadline lead="Your people." accent="Your place." className="text-[49px] …" />
//   <StoryHeadline lead="Your next circle" pre="starts" accent="with you." />
//
// `lead` is line one; line two is `pre` (optional) then the rose serif
// `accent`, underlined by a hand-drawn stroke. Each line rises out of its own
// clipping mask, the accent inks in, then the underline draws. Re-key it to
// replay. Size, tracking and margins come from `className`.
// Needs `.fameo-theme`, the --frg-* tokens and AUTH_KEYFRAMES (AuthShell).

import { ENTER } from '@/constants/authUi';
import { cn } from '@/utils/cn';

// Clips the rising text, with room below for descenders and the underline.
const LINE = 'block overflow-hidden pb-4.5 -mb-4.5';

export default function StoryHeadline({ lead, pre, accent, className }) {
  return (
    <h1 className={cn('font-medium', className)}>
      <span className={LINE}>
        <span className={cn('block', ENTER.line1)}>{lead}</span>
      </span>
      <span className={LINE}>
        <span className={cn('block', ENTER.line2)}>
          {pre && <>{pre}{' '}</>}
          <em className="relative inline-block font-serif font-normal text-primary">
            <span className={cn('inline-block', ENTER.ink)}>{accent}</span>
            <svg aria-hidden="true" viewBox="0 0 200 12" preserveAspectRatio="none" className="absolute -bottom-2.25 left-[2%] h-3 w-[98%] overflow-visible">
              <path
                pathLength={1}
                d="M3 9.5C48 3.5 118 2 197 5.5"
                className={cn('fill-none stroke-primary opacity-50 [stroke-dasharray:1] [stroke-dashoffset:1] [stroke-linecap:round] [stroke-width:2]', ENTER.swash)}
              />
            </svg>
          </em>
        </span>
      </span>
    </h1>
  );
}
