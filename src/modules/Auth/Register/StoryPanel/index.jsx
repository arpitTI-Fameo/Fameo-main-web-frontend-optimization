'use client';
// Left column of the register flow: the step's story line, and a silver
// application card that fills in with the name, username and category as
// they are entered. Collapses to just the heading on phones.
//
// Motion: the headline rises line by line (re-keyed per step, so each new
// story plays in), the card floats, catches a passing sheen and tilts toward
// the pointer (not on touch, not with reduced motion), and the rings orbit.

import { useRef, useState } from 'react';
import { Asterisk, Sparkles } from 'lucide-react';

import Eyebrow from '@/components/Common/Eyebrow';
import StoryHeadline from '@/components/Common/StoryHeadline';
import { Card } from '@/components/ui/shadcn/card';
import { cn } from '@/utils/cn';

import { FingerprintIcon } from '../icons';
import { ENTER } from '@/constants/authUi';

const TILT_QUERY = '(hover: hover) and (prefers-reduced-motion: no-preference)';

export default function StoryPanel({ story, stepKey, name, username, category }) {
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const canTilt = useRef(null);

  const onMove = (e) => {
    canTilt.current ??= window.matchMedia(TILT_QUERY).matches;
    if (!canTilt.current) return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    setTilt({ rx: +((0.5 - py) * 10).toFixed(2), ry: +((px - 0.5) * 14).toFixed(2) });
  };
  const onLeave = () => setTilt({ rx: 0, ry: 0 });

  return (
    <aside className="min-w-0 pt-5.75 max-[651px]:pt-0 max-[651px]:pb-5.75">
      <Eyebrow variant="soft" className={cn('gap-2.25 text-10 font-normal tracking-[2px] before:bg-[#C9B4C3] max-[651px]:text-[9px]', ENTER.rule)}>
        <span className={ENTER.eyebrowText}>Your place in the circle</span>
      </Eyebrow>

      <StoryHeadline
        key={`h-${stepKey}`}
        lead={story.lead}
        pre={story.pre}
        accent={story.accent}
        className="mt-6 mb-4 max-w-90 text-[43px] leading-[1.08] tracking-[-1.8px] min-[1100px]:text-[50px] max-[821px]:text-[33px] max-[821px]:tracking-[-1px] max-[651px]:mt-3.25 max-[651px]:mb-0 max-[651px]:max-w-none max-[651px]:text-[31px]"
      />
      <p key={`p-${stepKey}`} className={cn('max-w-70 text-13 leading-[1.8] text-muted-foreground max-[651px]:hidden', ENTER.d420)}>{story.sub}</p>

      <div
        aria-hidden="true"
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className="relative -mx-2 mt-3.75 min-h-[282px] overflow-hidden px-2 pt-10.5 pb-8.75 min-[1100px]:mt-6 max-[821px]:min-h-60 max-[821px]:px-0.5 max-[821px]:pt-8 max-[821px]:pb-5 max-[651px]:hidden"
      >
        {/* orbit rings, each carrying a dot */}
        <div className={cn('absolute top-2 left-3.5 size-[274px] max-[821px]:left-0 max-[821px]:size-[210px]', ENTER.rings)}>
          <div className="absolute inset-0 animate-[frgSpin_48s_linear_infinite] rounded-full border border-[#E8E2EB] bg-[radial-gradient(ellipse,#F4EAF17A,transparent_67%)]">
            <span className="absolute -top-0.75 left-1/2 size-1.25 -translate-x-1/2 rounded-full bg-primary shadow-[0_0_0_3px_rgb(233_30_99/.14)]" />
          </div>
          <div className="absolute inset-5.5 animate-[frgSpinRev_36s_linear_infinite] rounded-full border border-[#EBE7EF]">
            <span className="absolute -bottom-0.5 left-1/2 size-1 -translate-x-1/2 rounded-full bg-[#B58AA2]" />
          </div>
        </div>

        {/* tilt → float → entrance → card, so the transforms never fight */}
        <div
          className="relative z-1 max-w-75 transition-transform duration-350 ease-out [transform-style:preserve-3d]"
          style={{ transform: `perspective(900px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)` }}
        >
          <div className="animate-[frgFloat_6.5s_ease-in-out_infinite]">
            <div className={ENTER.card}>
              <Card className="relative min-h-[182px] w-full -rotate-7 gap-0 overflow-hidden rounded-[19px] border-[#D7CEDF] bg-[linear-gradient(125deg,#FCFBFD_2%,#E5DFEA_37%,#FDFBFE_61%,#DDD4E4)] p-5.5 text-foreground shadow-[0_20px_30px_#59415E12,inset_0_0_0_1px_#FFFFFFD9] max-[821px]:min-h-[155px] max-[821px]:p-4">
                <div className="flex items-center justify-between text-[9px] tracking-[1.9px] text-[#776880] max-[821px]:text-[8px] max-[821px]:tracking-[1px]">
                  <span>FAMEO · CREATOR NETWORK</span>
                  <Asterisk className="size-4.5 animate-[frgSpin_18s_linear_infinite] stroke-[1.65] text-[#A8557D]" />
                </div>
                <div className="mt-6.75 mb-1.25 text-25 leading-[1.2] font-medium tracking-[-.6px] wrap-anywhere max-[821px]:text-xl">
                  {name || 'Uniquely you.'}
                </div>
                <div className="text-11 text-[#847089] wrap-anywhere">{username ? `@${username}` : 'Your story belongs here.'}</div>
                <div className="mt-5.75 flex items-center justify-between gap-2.5 text-10 text-[#6F5B7B]">
                  <span>{category || 'A new beginning'}</span>
                  <span className="flex shrink-0 items-center gap-1.25">
                    <Sparkles className="size-4 animate-[frgTwinkle_4.2s_ease-in-out_1.8s_infinite] stroke-[1.65]" />
                    Your next chapter
                  </span>
                </div>
                {/* a band of light that passes every 7s */}
                <span className="pointer-events-none absolute -top-[20%] -bottom-[20%] left-0 w-[36%] animate-[frgSheen_7s_ease-in-out_2.2s_infinite_both] bg-[linear-gradient(90deg,transparent,rgb(255_255_255/.75),transparent)]" />
              </Card>
            </div>
          </div>
        </div>

        <div className={cn('relative z-2 mx-auto mt-6.75 flex items-center justify-center gap-2 text-11 text-[#897B90]', ENTER.d860)}>
          <FingerprintIcon
            className="size-4 animate-[frgBreathe_3.2s_ease-in-out_2.6s_infinite] text-[#A07090]"
            pathClassName="[stroke-dasharray:1] [stroke-dashoffset:1] animate-[frgDraw_1.4s_ease_.9s_forwards]"
          />
          A real identity. A world of possibility.
        </div>
      </div>
    </aside>
  );
}
