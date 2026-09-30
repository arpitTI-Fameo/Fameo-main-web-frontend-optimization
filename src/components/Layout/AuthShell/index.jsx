// components/Layout/AuthShell/index.jsx
// Page frame for the auth pages (register, login):
//
//   <AuthShell prompt="New to Fameo?" linkLabel="Join the circle" href={ROUTES.REGISTER} footer>
//     …page…
//   </AuthShell>
//
// Logo on the left, "prompt + link" on the right, an optional quiet footer.
// It opts the page into the Fameo theme at a 1:1 scale, and is the motion
// scope: the --frg-* tokens, the shared keyframes, the reduced-motion switch
// (.frg-motion) and three slow ambient blobs behind everything.

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

import AppLogo from '@/components/Common/AppLogo';
import { Button } from '@/components/ui/shadcn/button';
import { AUTH_KEYFRAMES, ENTER, MOTION_TOKENS } from '@/constants/authUi';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/utils/cn';

const BLOB = 'absolute rounded-full bg-[radial-gradient(closest-side,var(--blob),transparent)] opacity-45 [animation-direction:alternate] [animation-iteration-count:infinite] [animation-timing-function:ease-in-out]';
const EDGE_X = 'px-16 max-[821px]:px-8 max-[651px]:px-6';

export default function AuthShell({ prompt, linkLabel, href, footer = false, children }) {
  return (
    <div className={cn('frg-motion fameo-theme fameo-fixed-scale relative isolate flex min-h-svh flex-col bg-background leading-[21px] text-foreground', MOTION_TOKENS)}>
      <style>{AUTH_KEYFRAMES}</style>

      {/* ambient light — soft enough that the page reads the same when still */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <span className={cn(BLOB, '-top-40 -left-32 size-[620px] [--blob:rgb(246_194_211/.55)] [animation-duration:18s] [animation-name:frgDrift1]')} />
        <span className={cn(BLOB, 'top-1/4 -right-44 size-[560px] [--blob:rgb(221_208_240/.5)] [animation-duration:22s] [animation-name:frgDrift2]')} />
        <span className={cn(BLOB, '-bottom-48 left-1/3 size-[520px] [--blob:rgb(250_218_228/.45)] [animation-duration:26s] [animation-name:frgDrift3]')} />
      </div>

      <header className={cn('flex items-center justify-between gap-4 border-b border-border/70 py-3 max-[821px]:py-2.5 max-[651px]:py-2', EDGE_X, ENTER.header)}>
        <Button asChild variant="link" className="h-auto rounded-sm p-0 text-foreground hover:no-underline">
          <Link href={ROUTES.HOME} aria-label="Fameo home">
            <AppLogo className="h-[48px] w-auto max-[651px]:h-[32px]" />
          </Link>
        </Button>
        <div className="flex items-center gap-3">
          {prompt && <span className="text-11 text-muted-foreground/80 max-[651px]:hidden">{prompt}</span>}
          <Button
            asChild
            variant="link"
            className="group/login h-auto min-h-9 gap-1.75 px-0 py-2 text-xs leading-[21px] font-normal text-secondary-foreground has-[>svg]:px-0 hover:text-brand-text hover:no-underline max-[651px]:text-11"
          >
            <Link href={href}>
              {linkLabel}
              <ArrowUpRight
                aria-hidden="true"
                className="size-4 stroke-[1.65] transition-transform duration-300 ease-(--frg-ease) group-hover/login:translate-x-0.5 group-hover/login:-translate-y-0.5"
              />
            </Link>
          </Button>
        </div>
      </header>

      <main className="flex-1">{children}</main>
    </div>
  );
}
