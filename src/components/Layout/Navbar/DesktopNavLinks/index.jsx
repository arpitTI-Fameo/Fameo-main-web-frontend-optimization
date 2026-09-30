"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MAIN_NAV_LINKS } from '@/constants/megaMenu';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/utils/cn';
import { PILL, PILL_CLEAR, PILL_SOLID } from '../classes';

// `ink`: dark text on a light page at rest. `solid`: scrolled, the row sits
// in a dark glass capsule. The capsule box never changes, so links stay put.
export default function DesktopNavLinks({ ink, solid }) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        PILL,
        'flex h-12 list-none items-center gap-1 px-1.5 max-[900px]:hidden',
        solid ? PILL_SOLID : PILL_CLEAR
      )}
      aria-label="Main navigation"
    >
      {MAIN_NAV_LINKS.map(({ href, label }, i) => {
        const active = pathname === href || (pathname.startsWith(href + '/') && href !== ROUTES.HOME);
        return (
          <React.Fragment key={href}>
            {i > 0 && (
              <div
                className={cn(
                  'size-[3px] shrink-0 rounded-full [transition:background_.45s_var(--ease)]',
                  ink ? 'bg-[rgba(20,15,10,0.12)]' : 'bg-white/40'
                )}
                aria-hidden="true"
              />
            )}
            <Link
              href={href}
              prefetch={href === ROUTES.HOME ? undefined : false}
              className={cn(
                'relative isolate flex h-9 items-center rounded-full px-[18px] font-mono text-[11px] font-light tracking-[.22em] whitespace-nowrap uppercase no-underline',
                '[transition:color_.25s_var(--ease)] motion-reduce:transition-none',
                'max-[1100px]:px-3 max-[1100px]:tracking-[.1em]',
                // the pill that grows behind on hover
                "before:absolute before:inset-0 before:-z-10 before:scale-70 before:rounded-full before:opacity-0 before:content-[''] before:[transition:scale_.3s_var(--ease),opacity_.3s_var(--ease)] hover:before:scale-100 hover:before:opacity-100",
                ink
                  ? 'text-[#8B8781] before:bg-[rgba(20,15,10,0.05)] hover:text-[#16130F]'
                  : 'text-white/80 before:bg-white/10 hover:text-white',
                active && (ink ? 'text-[#16130F]' : 'text-white'),
                // active underline that wipes in
                active && "after:absolute after:right-[23px] after:bottom-[3px] after:left-[21px] after:h-0.5 after:animate-[mnUnderline_.4s_var(--ease)] after:rounded-full after:bg-[#D45A79] after:content-[''] max-[1100px]:after:right-[15px] max-[1100px]:after:left-[13px]"
              )}
              aria-current={pathname === href ? 'page' : undefined}
            >
              {label}
            </Link>
          </React.Fragment>
        );
      })}
    </nav>
  );
}
