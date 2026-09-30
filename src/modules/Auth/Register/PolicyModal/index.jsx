'use client';

import { useState } from 'react';
import { ArrowUpRight, FileText, LoaderCircle, X } from 'lucide-react';

import { Button } from '@/components/ui/shadcn/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/shadcn/dialog';

/* ── Policy Modal ──────────────────────────────────────────────────────────
   The published policy page in an iframe, with an "Open" link for a new tab.
   Radix handles Escape, outside click, focus trap and the body scroll lock. */
export default function PolicyModal({ policy, onClose }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent
        showCloseButton={false}
        overlayClassName="bg-[#3023345C] backdrop-blur-[5px]"
        className="fameo-theme fameo-fixed-scale flex h-[92dvh] max-h-200 max-w-195 flex-col gap-0 overflow-hidden rounded-[20px] border-[#E1D7E6] p-0 shadow-[0_22px_75px_#28132D33] sm:max-w-195 max-[651px]:top-auto max-[651px]:bottom-0 max-[651px]:translate-y-0 max-[651px]:rounded-b-none"
      >
        <div className="flex shrink-0 items-center gap-3 border-b border-border/70 px-5.5 py-4">
          <div className="grid size-10 shrink-0 place-items-center rounded-[11px] border border-[#E5D8E8] bg-linear-135 from-accent to-[#EAE3F0] text-primary">
            <FileText aria-hidden="true" className="size-4 stroke-[1.65]" />
          </div>
          <div className="min-w-0 flex-1">
            <DialogDescription className="text-[9px] tracking-[1.8px] text-brand-muted uppercase">Legal · Fameo</DialogDescription>
            <DialogTitle className="truncate text-lg leading-tight font-medium tracking-[-.4px]">{policy.label}</DialogTitle>
          </div>
          <Button asChild variant="outline" size="sm" className="h-8 gap-1.25 rounded-lg border-border px-2.75 text-11 font-normal text-secondary-foreground shadow-none has-[>svg]:px-2.75 hover:border-primary/40 hover:bg-transparent hover:text-brand-text">
            <a href={policy.href} target="_blank" rel="noopener noreferrer" title="Open in new tab">
              Open
              <ArrowUpRight aria-hidden="true" className="size-4 stroke-[1.65]" />
            </a>
          </Button>
          <DialogClose asChild>
            <Button type="button" variant="secondary" size="icon" className="size-8 rounded-full hover:bg-accent">
              <X aria-hidden="true" className="size-4 stroke-[1.65]" />
              <span className="sr-only">Close</span>
            </Button>
          </DialogClose>
        </div>

        <div className="relative flex-1 overflow-hidden">
          {!loaded && (
            <div className="absolute inset-0 z-1 flex flex-col items-center justify-center gap-3 bg-background">
              <LoaderCircle aria-hidden="true" className="size-7 animate-spin text-primary" />
              <span className="text-11 text-muted-foreground">Loading document…</span>
            </div>
          )}
          <iframe
            className="block size-full border-0 bg-white"
            src={policy.href}
            title={policy.label}
            onLoad={() => setLoaded(true)}
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
