'use client';
// components/Common/ChipGroup/index.jsx
// Single-select row of pill toggles (shadcn ToggleGroup). Wraps on narrow screens.
//
//   <ChipGroup items={[{ value, label, icon? }]} value={v} onValueChange={setV} />
//
// Radix reports '' when the pressed chip is clicked again; callers decide what
// that means. Needs a `.fameo-theme` ancestor for its colors.

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/shadcn/toggle-group';
import { cn } from '@/utils/cn';

const SIZES = {
  md: 'min-h-10 px-3.5 py-2.5 text-xs [&_svg:not([class*=size-])]:size-3.75',
  sm: 'min-h-9 px-3 py-2 text-11',
};

export default function ChipGroup({
  items,
  value,
  onValueChange,
  size = 'md',
  className,
  ...props
}) {
  return (
    <ToggleGroup
      type="single"
      spacing={2}
      value={value}
      onValueChange={onValueChange}
      className={cn('w-full flex-wrap justify-start', className)}
      {...props}
    >
      {items.map(({ value: itemValue, label, icon: Icon }) => (
        <ToggleGroupItem
          key={itemValue}
          value={itemValue}
          className={cn(
            'h-auto rounded-full border border-border bg-card font-normal text-foreground',
            'hover:bg-muted hover:text-foreground',
            'data-[state=on]:border-primary/35 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground',
            '[&_svg]:text-muted-foreground [&[data-state=on]_svg]:text-primary',
            'transition-colors duration-200 motion-reduce:transition-none',
            SIZES[size]
          )}
        >
          {Icon && <Icon aria-hidden="true" />}
          {label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
