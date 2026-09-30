import { cn } from '@/utils/cn';

function Skeleton({ className, ...props }) {
  return (
    <div
      data-slot="skeleton"
      // Fameo theme: the neutral secondary surface. shadcn's bg-accent is the
      // brand rose tint here, which reads as a highlight, not a placeholder.
      className={cn('animate-pulse rounded-md bg-secondary motion-reduce:animate-none', className)}
      {...props}
    />
  );
}

export { Skeleton };
