// components/Common/FormNote/index.jsx
// A boxed note under a form, built on shadcn Alert.
//
//   <FormNote icon={EyeOff}>Your exact location isn’t shown.</FormNote>  quiet info
//   <FormNote tone="error">Verify both your mobile and email.</FormNote>  a problem
//
// Tones: info (default), error, success, warning. Only `error` is announced
// (role="alert"); the others are plain content.
// Needs a `.fameo-theme` ancestor for its colors.

import { Alert, AlertDescription } from '@/components/ui/shadcn/alert';
import { cn } from '@/utils/cn';

const TONES = {
  info: 'mt-5 rounded-[10px] bg-linear-115 from-muted to-[#F0EDF4] px-3.5 py-3 text-muted-foreground [&>svg]:text-brand-muted',
  error: 'mt-3 rounded-lg bg-accent px-2.75 py-2.25 leading-[1.7] text-accent-foreground',
  success: 'mt-3 rounded-lg bg-[#EEF6F2] px-2.75 py-2.25 leading-[1.7] text-chart-3',
  warning: 'mt-3 rounded-lg bg-[#FFF6EB] px-2.75 py-2.25 leading-[1.7] text-chart-4',
};

export default function FormNote({ tone = 'info', icon: Icon, className, children }) {
  return (
    <Alert
      role={tone === 'error' ? 'alert' : undefined}
      className={cn(
        'border-0 text-11 leading-[1.6] has-[>svg]:gap-x-2.5 [&>svg]:size-4 [&>svg]:translate-y-px [&>svg]:stroke-[1.65]',
        TONES[tone],
        className
      )}
    >
      {Icon && <Icon aria-hidden="true" />}
      <AlertDescription className="block text-[length:inherit] leading-[inherit] text-current">{children}</AlertDescription>
    </Alert>
  );
}
