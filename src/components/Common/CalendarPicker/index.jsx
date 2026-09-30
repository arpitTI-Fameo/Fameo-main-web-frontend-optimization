'use client';
// components/Common/CalendarPicker/index.jsx
// A date field: a shadcn Popover + Calendar behind a button that shows the
// chosen day ("12 April 1996"). Month and year dropdowns make far-back dates,
// like a date of birth, quick to reach.
//
//   <CalendarPicker value="1996-04-12" min="1926-09-30" max="2008-09-30"
//     onChange={(e) => save(e.target.value)} />
//
// `value`, `min` and `max` are YYYY-MM-DD strings. onChange receives an
// input-like event, so it drops into existing `e.target.value` handlers.
// `className` styles the trigger; `contentClassName` the popover, which
// renders in a portal — pass `fameo-theme` there for the theme tokens.

import { useState } from 'react';
import { CalendarIcon } from 'lucide-react';

import { Button } from '@/components/ui/shadcn/button';
import { Calendar } from '@/components/ui/shadcn/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/shadcn/popover';
import { cn } from '@/utils/cn';

const toDate = (iso) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || '');
  return m ? new Date(+m[1], +m[2] - 1, +m[3]) : undefined;
};
const pad = (n) => String(n).padStart(2, '0');
const toISO = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const DISPLAY = { day: 'numeric', month: 'long', year: 'numeric' };

export default function CalendarPicker({
  value,
  onChange,
  min,
  max,
  id,
  className,
  contentClassName,
  placeholder = 'Select a date',
  'aria-invalid': ariaInvalid,
  'aria-describedby': ariaDescribedby,
}) {
  const [open, setOpen] = useState(false);
  const selected = toDate(value);
  const minDate = toDate(min);
  const maxDate = toDate(max);

  const pick = (day) => {
    if (!day) return;
    onChange({ target: { value: toISO(day) } });
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          aria-invalid={ariaInvalid}
          aria-describedby={ariaDescribedby}
          data-empty={selected ? undefined : ''}
          className={cn('w-full justify-between font-normal data-[empty]:text-muted-foreground', className)}
        >
          {selected ? selected.toLocaleDateString('en-GB', DISPLAY) : placeholder}
          <CalendarIcon aria-hidden="true" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className={cn('w-auto overflow-hidden p-0', contentClassName)}>
        <Calendar
          mode="single"
          captionLayout="dropdown"
          selected={selected}
          defaultMonth={selected || maxDate}
          startMonth={minDate}
          endMonth={maxDate}
          disabled={[minDate && { before: minDate }, maxDate && { after: maxDate }].filter(Boolean)}
          onSelect={pick}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  );
}
