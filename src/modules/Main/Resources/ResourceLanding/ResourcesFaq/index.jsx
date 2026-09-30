'use client';
// modules/Resources/ResourcesFaq/index.jsx

import { Minus, Plus } from 'lucide-react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/shadcn/accordion';
import SectionHeading from '@/components/Common/SectionHeading';

import { FAQS } from '../constants';

export default function ResourcesFaq({ openFaq, setOpenFaq }) {
    return (
    <section className="mx-auto mb-10 max-w-187.5">
      <SectionHeading
        align="center"
        eyebrow="A little clarity"
        title="Good questions."
        accent="Straight answers."
        className="mb-6"
      />
      <Accordion
        type="single"
        collapsible
        value={openFaq >= 0 ? String(openFaq) : ''}
        onValueChange={(v) => setOpenFaq(v === '' ? -1 : Number(v))}
      >
        {FAQS.map(([q, a], i) => (
          <AccordionItem key={i} value={String(i)} className="last:border-b">
            <AccordionTrigger className="group items-center rounded-none py-4.75 text-sm hover:no-underline [&>svg]:hidden">
              {q}
              <span aria-hidden="true" className="shrink-0 text-primary">
                <Plus className="size-5 stroke-[1.5] group-data-[state=open]:hidden" />
                <Minus className="hidden size-5 stroke-[1.5] group-data-[state=open]:block" />
              </span>
            </AccordionTrigger>
            <AccordionContent className="pr-9 pb-4.75 text-13 leading-[1.75] text-muted-foreground">
              {a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
    );
}
