import React from 'react';

import FormField from '@/components/Common/FormField';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/shadcn/select';
import { Skeleton } from '@/components/ui/shadcn/skeleton';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/shadcn/toggle-group';
import { cn } from '@/utils/cn';

import FormNote from '@/components/Common/FormNote';
import { CATEGORY_TONES, pickCategoryIcon } from '../constants';
import { HINT, HINT_ERROR } from '@/constants/authUi';
import { SELECT_CONTENT, SELECT_ITEM, SELECT_TRIGGER, TILE } from '../styles';

// The rose dot in the corner of the chosen tile.
const TILE_DOT = "data-[state=on]:after:absolute data-[state=on]:after:top-1.75 data-[state=on]:after:right-1.75 data-[state=on]:after:size-1.25 data-[state=on]:after:rounded-full data-[state=on]:after:bg-primary data-[state=on]:after:content-['']";
const GRID = 'mb-5.25 grid w-full grid-cols-4 gap-2.25 max-[821px]:gap-1.5 max-[651px]:gap-1.75 max-[371px]:grid-cols-3';

export default function Step04Category({ ctx }) {
  const {
    catError, errors, registerFieldRef, catLoading, categories,
    form, setForm, clearErr, profError, onProfessionChange, profLoading, professions
  } = ctx;

  // Radix reports '' when the chosen tile is clicked again — keep the choice.
  const pick = (code) => {
    const cat = categories.find((c) => c.category_code === code);
    if (!cat) return;
    setForm((f) => ({ ...f, categoryCode: cat.category_code, category: cat.category_name, categoryId: cat.category_id }));
    clearErr('category');
  };

  const profPlaceholder = profLoading ? 'Loading professions…' : professions.length === 0 ? 'No professions found' : 'Select your profession';

  return (
    <>
      {catError && <FormNote tone="error" className="mt-0 mb-4">{catError}</FormNote>}

      <div ref={registerFieldRef('category')}>
        {catLoading ? (
          <div className={GRID}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex min-h-19.75 flex-col items-center justify-center gap-2 rounded-[11px] border border-dashed border-border p-2.5">
                <Skeleton className="size-7.25 rounded-[9px]" />
                <Skeleton className="h-2 w-3/5" />
              </div>
            ))}
          </div>
        ) : (
          <ToggleGroup type="single" spacing={1} value={form.categoryCode} onValueChange={pick}
            aria-label="Primary category" className={GRID}>
            {categories.map((cat, index) => {
              const Icon = pickCategoryIcon(cat);
              const tone = CATEGORY_TONES[index % CATEGORY_TONES.length];
              return (
                <ToggleGroupItem
                  key={cat.category_code}
                  value={cat.category_code}
                  title={cat.description || cat.category_name}
                  style={{ '--tile-bg': tone.bg, '--tile-ink': tone.ink }}
                  className={cn(
                    TILE, TILE_DOT,
                    'min-h-19.75 gap-2 rounded-[11px] px-1.25 py-2.5 text-center text-10 leading-[1.35] whitespace-normal',
                    'max-[821px]:text-[9px] max-[651px]:min-h-20.5 max-[651px]:text-10'
                  )}
                >
                  <span className="grid size-7.25 place-items-center rounded-[9px] bg-(--tile-bg) text-(--tile-ink)">
                    <Icon aria-hidden="true" className="size-4 stroke-[1.65]" />
                  </span>
                  <span>{cat.category_name}</span>
                </ToggleGroupItem>
              );
            })}
          </ToggleGroup>
        )}
        {errors.category && <p className={cn(HINT_ERROR, '-mt-3 mb-4')}>{errors.category}</p>}
      </div>

      {form.categoryCode ? (
        <FormField id="frg-prof" label="Profession" fieldRef={registerFieldRef('profession')}
          hint={errors.profession || profError} tone="error">
          <Select value={form.professionCode || ''} onValueChange={onProfessionChange}
            disabled={profLoading || professions.length === 0}>
            <SelectTrigger id="frg-prof" className={SELECT_TRIGGER} aria-invalid={Boolean(errors.profession) || undefined}>
              <SelectValue placeholder={profPlaceholder} />
            </SelectTrigger>
            <SelectContent className={SELECT_CONTENT}>
              {professions.map((p) => (
                <SelectItem key={p.profession_code} value={p.profession_code} className={SELECT_ITEM}>{p.profession_name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
      ) : (
        <p className={HINT}>Choose a category to see relevant professions.</p>
      )}
    </>
  );
}
