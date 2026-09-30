'use client';
// Left column of the login page: the story line and the two interlocking
// silver rings with a rose asterisk at their meeting point. Collapses to just
// the heading on phones.
//
// Motion: the headline rises and inks in (StoryHeadline), the rings arrive,
// each floats on its own beat, lean toward each other on hover and tilt with
// the pointer (not on touch, not with reduced motion); the asterisk turns.

import { useRef, useState } from 'react';
import { Asterisk, Sparkles } from 'lucide-react';

import Eyebrow from '@/components/Common/Eyebrow';
import StoryHeadline from '@/components/Common/StoryHeadline';
import { ENTER } from '@/constants/authUi';
import { cn } from '@/utils/cn';

import { RING, RING_ONE_BG, RING_TWO_BG } from '../styles';

const TILT_QUERY = '(hover: hover) and (prefers-reduced-motion: no-preference)';

export default function LoginStory() {
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
    <aside className="min-w-0 max-[651px]:mx-auto max-[651px]:max-w-97.5 max-[651px]:pb-7">
      <Eyebrow variant="soft" className={cn('gap-2.25 text-10 font-normal tracking-[2px] text-[#91788C] before:bg-[#C9B4C3]', ENTER.rule)}>
        <span className={ENTER.eyebrowText}>Right where you belong</span>
      </Eyebrow>

      <StoryHeadline
        lead="Your people."
        accent="Your place."
        className="mt-6.5 mb-4.5 text-[49px] leading-[1.07] tracking-[-1.9px] min-[1100px]:text-[55px] max-[851px]:text-[42px] max-[651px]:mt-4 max-[651px]:mb-0 max-[651px]:text-[34px] max-[651px]:tracking-[-1.2px]"
      />
      <p className={cn('max-w-71.25 text-13 leading-[1.8] text-muted-foreground max-[651px]:hidden', ENTER.d420)}>
        Pick up where you left off.
        <br />
        Good connections have a way of continuing.
      </p>

      <div
        aria-hidden="true"
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className="group/rings relative isolate mt-7 h-60 max-w-87.5 before:absolute before:inset-x-[-10px] before:top-5 before:bottom-0 before:-z-1 before:bg-[radial-gradient(ellipse,#EDE7F37A,transparent_67%)] before:content-[''] max-[651px]:hidden"
      >
        <div
          className="absolute inset-0 transition-transform duration-350 ease-out [transform-style:preserve-3d]"
          style={{ transform: `perspective(900px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)` }}
        >
          <div className={cn('absolute inset-0', ENTER.card)}>
            <div className="absolute inset-0 animate-[frgFloat_6.5s_ease-in-out_infinite]">
              <div className={cn(RING, RING_ONE_BG, 'top-4.75 left-12 -rotate-32 group-hover/rings:-rotate-26 max-[851px]:left-4')} />
            </div>
            <div className="absolute inset-0 animate-[frgFloat_7.5s_ease-in-out_-2s_infinite]">
              <div className={cn(RING, RING_TWO_BG, 'top-9 left-35.25 rotate-32 group-hover/rings:rotate-26 max-[851px]:left-27')} />
            </div>
            <div className="absolute top-26.5 left-38.75 grid size-10 place-items-center rounded-full border border-[#E9CADB] bg-linear-135 from-[#FFF9FC] to-[#F4DFEB] text-[#C8487A] shadow-[0_5px_12px_#70486C0A] max-[851px]:left-30.5">
              <Asterisk className="size-4 animate-[frgSpin_18s_linear_infinite] stroke-[1.25]" />
            </div>
          </div>
        </div>

        <div className={cn('absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 text-10 tracking-[.4px] text-[#9D8AA6]', ENTER.d860)}>
          <Sparkles className="size-4 animate-[frgTwinkle_4.2s_ease-in-out_1.8s_infinite] stroke-[1.65] text-[#AF7196]" />
          A familiar place. Fresh possibilities.
        </div>
      </div>
    </aside>
  );
}
