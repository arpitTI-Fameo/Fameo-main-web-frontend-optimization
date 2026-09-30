// components/Common/Breadcrumbs/index.jsx
// Trail of links above a page title (shadcn Breadcrumb). The last entry is the
// current page; earlier ones take `href` (next/link) or `onClick` (a button).
//
//   <Breadcrumbs items={[{ label: 'Learning centre', href }, { label: 'Courses' }]} />
//
// Needs a `.fameo-theme` ancestor for its colors.

import { Fragment } from 'react';
import Link from 'next/link';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/shadcn/breadcrumb';
import { cn } from '@/utils/cn';

const LINK =
  'rounded-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50';

export default function Breadcrumbs({ items, className }) {
  return (
    <Breadcrumb className={className}>
      <BreadcrumbList className="flex-nowrap gap-1.5 text-xs sm:gap-2">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <Fragment key={i}>
              <BreadcrumbItem className={cn(isLast ? 'min-w-0' : 'shrink-0')}>
                {isLast ? (
                  <BreadcrumbPage className="truncate">{item.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild className={LINK}>
                    {item.href ? (
                      <Link href={item.href}>{item.label}</Link>
                    ) : (
                      <button type="button" onClick={item.onClick}>
                        {item.label}
                      </button>
                    )}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
