// components/Common/FormField/index.jsx
// A labelled form control with an optional hint underneath:
//
//   <FormField id="first" label="First name" hint={error} tone="error">
//     <Input id="first" … />
//   </FormField>
//
// `aside` sits at the right end of the label row (a status, a small action).
// `fieldRef` lands on the wrapper, for scroll-to-first-error. While anything
// inside has focus, the label turns rose and eases 2px to the right.
// Needs a `.fameo-theme` ancestor for its colors.

import { Label } from '@/components/ui/shadcn/label';
import { cn } from '@/utils/cn';

const TONES = {
  muted: 'text-muted-foreground/85',
  error: 'text-accent-foreground',
  success: 'text-chart-3',
  warning: 'text-chart-4',
};

export default function FormField({
  id,
  label,
  aside,
  hint,
  hintId,
  tone = 'muted',
  fieldRef,
  className,
  children,
}) {
  return (
    <div ref={fieldRef} className={cn('group/field min-w-0', className)}>
      {(label || aside) && (
        <div className="mb-1.75 flex items-center justify-between gap-2">
          {label && (
            <Label
              htmlFor={id}
              className="text-11 leading-[1.9] font-medium text-secondary-foreground transition-[color,translate] duration-300 ease-[cubic-bezier(.2,.8,.2,1)] group-focus-within/field:translate-x-0.5 group-focus-within/field:text-brand-text"
            >
              {label}
            </Label>
          )}
          {aside}
        </div>
      )}
      {children}
      {hint && (
        <p id={hintId} className={cn('mt-1.75 text-10 leading-[1.6]', TONES[tone])}>
          {hint}
        </p>
      )}
    </div>
  );
}
