import React from 'react';
import { Camera, Layers2, Link2, Play, SquarePlay } from 'lucide-react';

import FormField from '@/components/Common/FormField';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/shadcn/collapsible';
import { Input } from '@/components/ui/shadcn/input';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/shadcn/toggle-group';
import { cn } from '@/utils/cn';

import FormNote from '@/components/Common/FormNote';
import { PLATFORMS } from '../constants';
import { cleanUrl } from '../helpers';
import { HINT_ERROR, INPUT } from '@/constants/authUi';
import { COLLAPSE, COLLAPSE_INNER, DISCLOSURE, DISCLOSURE_MARK, TILE } from '../styles';

const PLATFORM_ICONS = { Instagram: Camera, YouTube: SquarePlay, Both: Layers2 };

export default function Step03Socials({ ctx }) {
  const { form, setForm, clearErr, errors, setField, registerFieldRef, ytOk, igOk } = ctx;

  const showIg = form.primaryPlatform === 'Instagram' || form.primaryPlatform === 'Both';
  const showYt = form.primaryPlatform === 'YouTube' || form.primaryPlatform === 'Both';
  const igBad = Boolean((form.instagram && !igOk) || errors.instagram);
  const ytBad = Boolean((form.youtube && !ytOk) || errors.youtube);

  // Radix reports '' when the pressed tile is clicked again — keep the choice.
  const pick = (value) => {
    if (!value) return;
    setForm((f) => ({ ...f, primaryPlatform: value }));
    clearErr('platform', 'youtube', 'instagram');
  };

  return (
    <>
      <div ref={registerFieldRef('platform')} className="mb-6">
        <ToggleGroup
          type="single"
          spacing={1}
          value={form.primaryPlatform}
          onValueChange={pick}
          aria-label="Primary platform"
          className="grid w-full grid-cols-3 gap-2.5"
        >
          {PLATFORMS.map(({ value, label }) => {
            const Icon = PLATFORM_ICONS[value];
            return (
              <ToggleGroupItem key={value} value={value} className={cn(TILE, 'group/tile min-h-22.25 gap-2.75 rounded-xl px-2 py-3.75 text-xs')}>
                <Icon aria-hidden="true" className="size-4! stroke-[1.65] text-brand-muted group-data-[state=on]/tile:text-primary" />
                <span>{label}</span>
              </ToggleGroupItem>
            );
          })}
        </ToggleGroup>
        {errors.platform && <p className={HINT_ERROR}>{errors.platform}</p>}
      </div>

      <div className="grid gap-4.75">
        {showIg && (
          <FormField id="frg-ig" label="Instagram profile URL" fieldRef={registerFieldRef('instagram')} tone="error"
            hint={igBad ? 'That link doesn’t look like a profile. Use https://instagram.com/yourhandle' : ''}>
            <Input id="frg-ig" type="url" className={INPUT} placeholder="https://instagram.com/yourhandle"
              value={form.instagram} onChange={(e) => setField('instagram', cleanUrl(e.target.value))} aria-invalid={igBad || undefined} />
          </FormField>
        )}
        {showYt && (
          <FormField id="frg-yt" label="YouTube channel URL" fieldRef={registerFieldRef('youtube')} tone="error"
            hint={ytBad ? 'That link doesn’t look like a channel. Use youtube.com/@handle, /channel/ID, /c/name or /user/name' : ''}>
            <Input id="frg-yt" type="url" className={INPUT} placeholder="https://youtube.com/@yourchannel"
              value={form.youtube} onChange={(e) => setField('youtube', cleanUrl(e.target.value))} aria-invalid={ytBad || undefined} />
          </FormField>
        )}
      </div>

      <FormNote icon={Link2}>A public link is all we need here. You won’t be asked for your social account password.</FormNote>

      <Collapsible className="mt-4.25">
        <CollapsibleTrigger className={DISCLOSURE}>
          <Play aria-hidden="true" className={DISCLOSURE_MARK} />
          How social profiles are reviewed
        </CollapsibleTrigger>
        <CollapsibleContent className={COLLAPSE}>
          <p className={cn('max-w-105 pt-2 text-xs leading-[1.65] text-muted-foreground', COLLAPSE_INNER)}>
            Follower counts are never added together. If you link both platforms, the higher single-platform count is used.
          </p>
        </CollapsibleContent>
      </Collapsible>
    </>
  );
}
