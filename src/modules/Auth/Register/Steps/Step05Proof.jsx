import React from 'react';
import { BadgeCheck, FileCheck2, LoaderCircle, Play, RotateCcw, ScanFace, Upload, Video, X } from 'lucide-react';

import { Badge } from '@/components/ui/shadcn/badge';
import { Button } from '@/components/ui/shadcn/button';
import { Card } from '@/components/ui/shadcn/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/shadcn/collapsible';
import { Input } from '@/components/ui/shadcn/input';
import { Label } from '@/components/ui/shadcn/label';
import { Textarea } from '@/components/ui/shadcn/textarea';
import { cn } from '@/utils/cn';

import FormNote from '@/components/Common/FormNote';
import { MAX_GENERIC_FILES } from '../constants';
import { formatDocLabel } from '../helpers';
import { HINT, HINT_ERROR, INPUT, PRIMARY } from '@/constants/authUi';
import { COLLAPSE, COLLAPSE_INNER, DISCLOSURE, DISCLOSURE_MARK, ICON_BUTTON, ROW } from '../styles';

const ACCEPT = '.pdf,.doc,.docx,.jpg,.jpeg,.png,.webp';
const REQUIREMENTS = ['One face only', 'Good lighting', 'No sunglasses', 'Live camera only'];

const ROW_ICON = 'size-4 shrink-0 stroke-[1.65] text-brand-muted';
const ROW_UPLOAD = cn(ROW, 'transition-[border-color,background-color] duration-180 hover:border-primary/30 hover:bg-accent/40 hover:text-secondary-foreground has-[>svg]:px-3 [&_svg]:size-4');
const SELFIE_ACTION = cn(PRIMARY, 'min-h-9.75 gap-2.5 px-4.25 py-2.5 text-11 has-[>svg]:px-4.25');

export default function Step05Proof({ ctx }) {
  const {
    selfieFile, errors, registerFieldRef, setCameraOpen, selfieStatus, selfiePreview, retakeSelfie,
    fileError, requiredDocs, docSlots, removeSlot, docInputRefs, handleSlotFile,
    uploadedFiles, removeGeneric, addGenericFiles, set, form
  } = ctx;

  const st = selfieStatus.state;
  const busy = st === 'checking' || st === 'uploading';
  const done = st === 'done';

  const title = !selfieFile ? 'A quick hello, on camera.'
    : st === 'checking' ? 'Checking liveness…'
      : st === 'uploading' ? 'Uploading verified selfie…'
        : done ? 'You’re all set.'
          : 'Let’s try that again.';
  const body = !selfieFile ? 'Good light. A natural blink. About 10 seconds, guided on screen, to help confirm it’s really you.'
    : busy ? 'Hold on while we confirm this is a live capture.'
      : done ? 'Live face verified & uploaded. Add supporting work below, or submit.'
        : selfieStatus.msg;

  const pickGeneric = () => {
    const inp = document.createElement('input');
    inp.type = 'file'; inp.multiple = true; inp.accept = ACCEPT;
    inp.onchange = (e) => addGenericFiles(e.target.files);
    inp.click();
  };

  const removeButton = (label, onClick) => (
    <Button type="button" variant="ghost" size="icon" onClick={onClick} aria-label={`Remove ${label}`} className={ICON_BUTTON}>
      <X aria-hidden="true" />
    </Button>
  );

  return (
    <>
      {/* ── live selfie ── */}
      <Card
        ref={registerFieldRef('selfie')}
        className={cn(
          'items-center gap-0 rounded-[15px] border-[#DDD5E5] bg-linear-135 from-[#FAF8FC] via-[#EDE7F2] via-62% to-[#F9F6FA] p-5.5 text-center shadow-none',
          errors.selfie && 'border-primary/45'
        )}
      >
        <div className="relative mb-4.25 grid size-21.25 place-items-center overflow-hidden rounded-full border border-[#D5C9DF] bg-[conic-gradient(from_20deg,#FFFEFF,#DED5E7,#FEFCFF,#E6DCEB,#FCF9FD)] shadow-[0_8px_20px_#A58AAC22] after:absolute after:inset-1.75 after:rounded-full after:border after:border-white/85 after:content-['']">
          {selfiePreview
            ? <img src={selfiePreview} alt="Live selfie preview" className="size-full object-cover" />
            : <ScanFace aria-hidden="true" className="size-4 stroke-[1.2] text-[#A7547F]" />}
          {done && (
            <span className="absolute right-1 bottom-1 z-1 grid size-6 place-items-center rounded-full bg-background text-primary shadow-sm">
              <BadgeCheck aria-hidden="true" className="size-4 stroke-[1.65]" />
            </span>
          )}
        </div>

        <h3 className="mb-1.75 text-17 font-medium tracking-[-.3px]">{title}</h3>
        <p className={cn('mb-4.25 max-w-71.25 text-11 leading-[1.65] text-muted-foreground', st === 'error' && 'text-accent-foreground')}>{body}</p>
        {st === 'error' && selfieStatus.hint && <p className="-mt-2.5 mb-4.25 max-w-71.25 text-11 leading-[1.65] text-muted-foreground">{selfieStatus.hint}</p>}

        {!selfieFile && (
          <Button type="button" onClick={() => setCameraOpen(true)} className={SELFIE_ACTION}>
            <Video aria-hidden="true" />
            Start live check
          </Button>
        )}
        {busy && <LoaderCircle aria-label="Working" className="size-5 animate-spin text-primary" />}
        {(done || (st === 'error' && !selfieStatus.fatal)) && (
          <Button type="button" onClick={retakeSelfie} className={SELFIE_ACTION}>
            <RotateCcw aria-hidden="true" />
            {done ? 'Retake' : 'Try again'}
          </Button>
        )}

        <div className="mt-3" aria-live="polite">
          {done && selfieStatus.liveness && (
            <Badge variant="outline" className="rounded-full border-[#D8CBE0] bg-white/70 px-2.25 py-1 text-10 font-normal text-brand-text">
              <BadgeCheck aria-hidden="true" />
              Liveness confirmed
            </Badge>
          )}
          {!selfieFile && <span className="text-11 text-brand-text">{REQUIREMENTS.join(' · ')}</span>}
        </div>
        {errors.selfie && <p className={cn(HINT_ERROR, 'mt-1')}>{errors.selfie}</p>}
      </Card>

      {/* ── supporting documents ── */}
      <div className="mt-5.5 mb-2.75 flex items-center justify-between gap-2.5">
        <span className="text-11 font-medium text-secondary-foreground">
          Supporting documents <small className="ml-1.25 text-10 font-normal text-muted-foreground/75">Optional</small>
        </span>
        {requiredDocs.length === 0 && (
          <span className="text-10 text-muted-foreground/75">{MAX_GENERIC_FILES - uploadedFiles.length} of {MAX_GENERIC_FILES} remaining</span>
        )}
      </div>
      {fileError && <FormNote tone="error" className="mt-0 mb-2">{fileError}</FormNote>}

      <div className="grid gap-2" ref={registerFieldRef('docs')}>
        {requiredDocs.length > 0
          ? requiredDocs.map((docType) => {
            const slot = docSlots[docType];
            const label = formatDocLabel(docType);
            return slot ? (
              <div key={docType} className={ROW}>
                <FileCheck2 aria-hidden="true" className={ROW_ICON} />
                <span className="min-w-0 flex-1 wrap-anywhere">
                  <span className="block text-foreground">{label}</span>
                  <span className="text-10 text-muted-foreground">{slot.name} · {slot.size}</span>
                </span>
                {removeButton(label, () => removeSlot(docType))}
              </div>
            ) : (
              <React.Fragment key={docType}>
                <Input ref={(el) => { docInputRefs.current[docType] = el; }} type="file" accept={ACCEPT} className="hidden"
                  tabIndex={-1} aria-hidden="true"
                  onChange={(e) => { if (e.target.files[0]) handleSlotFile(docType, e.target.files[0]); e.target.value = ''; }} />
                <Button type="button" variant="outline" className={ROW_UPLOAD} onClick={() => docInputRefs.current[docType]?.click()}>
                  <Upload aria-hidden="true" className={ROW_ICON} />
                  <span className="min-w-0 flex-1 text-left wrap-anywhere whitespace-normal">{label}</span>
                  <small className="text-[9px] text-muted-foreground/75">Upload</small>
                </Button>
              </React.Fragment>
            );
          })
          : (
            <>
              {uploadedFiles.map((f) => (
                <div key={f.id} className={ROW}>
                  <FileCheck2 aria-hidden="true" className={ROW_ICON} />
                  <span className="min-w-0 flex-1 wrap-anywhere text-foreground">{f.name}</span>
                  <small className="text-[9px] text-muted-foreground/75">{f.size}</small>
                  {removeButton(f.name, () => removeGeneric(f.id))}
                </div>
              ))}
              {uploadedFiles.length < MAX_GENERIC_FILES && (
                <Button type="button" variant="outline" className={ROW_UPLOAD} onClick={pickGeneric}>
                  <Upload aria-hidden="true" className={ROW_ICON} />
                  <span className="min-w-0 flex-1 text-left whitespace-normal">Awards, contracts, press coverage or credentials</span>
                  <small className="text-[9px] text-muted-foreground/75">Upload</small>
                </Button>
              )}
            </>
          )}
      </div>
      <p className={HINT}>
        PDF, DOC, JPG, PNG or WEBP · up to 10 MB each.
        {requiredDocs.length > 0 && ' These help us review your application faster — you can submit without them.'}
      </p>

      {/* ── press / media ── */}
      <Collapsible defaultOpen={Boolean(form.pressUrls)} className="mt-3.25">
        <CollapsibleTrigger className={DISCLOSURE}>
          <Play aria-hidden="true" className={DISCLOSURE_MARK} />
          Press &amp; media links <span className="text-muted-foreground/60">Optional</span>
        </CollapsibleTrigger>
        <CollapsibleContent className={COLLAPSE}>
          <div className={cn('pt-2', COLLAPSE_INNER)}>
            <Label htmlFor="frg-press" className="mb-1.75 text-11 leading-[1.9] font-medium text-secondary-foreground">One article link per line</Label>
            <Textarea id="frg-press" rows={3} placeholder="https://…" value={form.pressUrls} onChange={set('pressUrls')}
              className={cn(INPUT, 'h-20.5 min-h-20.5 resize-y py-3 field-sizing-fixed')} />
            <p className={HINT}>These are sent with your application.</p>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </>
  );
}
