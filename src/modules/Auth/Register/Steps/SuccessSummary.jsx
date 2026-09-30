import React from 'react';
import { Asterisk, Mail } from 'lucide-react';

import Eyebrow from '@/components/Common/Eyebrow';
import { Badge } from '@/components/ui/shadcn/badge';
import { Card } from '@/components/ui/shadcn/card';

import FormNote from '@/components/Common/FormNote';

/* The application receipt. It is deliberately NOT a verified-member badge:
   the status is always "Under review" until QC1 decides. */
export default function SuccessSummary({ ctx }) {
  const { summary, form } = ctx;

  const rows = [
    ['Category', summary?.category],
    ['Profession', summary?.profession],
    ['Platform', summary?.platform === 'Both' ? 'Instagram & YouTube' : summary?.platform],
    ...(summary?.referral ? [['Referral', summary.referral]] : []),
    [summary?.appIdIsLocal ? 'Reference' : 'Application', summary?.appId],
    ['Submitted', summary?.date],
  ];

  return (
    <section className="mx-auto grid max-w-250 grid-cols-[.9fr_1.1fr] items-center gap-12.5 px-15 pt-15 pb-17.5 max-[821px]:gap-6.5 max-[821px]:px-7 max-[821px]:py-11.25 max-[651px]:flex max-[651px]:flex-col max-[651px]:items-stretch max-[651px]:gap-6 max-[651px]:px-6 max-[651px]:py-7.5">
      <div>
        <Eyebrow variant="soft" className="gap-2.25 text-10 font-normal tracking-[2px] before:bg-[#C9B4C3]">
          Application received
        </Eyebrow>
        <h2 className="mt-5.75 mb-4.25 text-[40px] leading-[1.1] font-medium tracking-[-1.4px] max-[651px]:mt-3.75 max-[651px]:text-[33px]">
          You’ve made
          <br />
          your <em className="font-serif font-normal text-primary">introduction.</em>
        </h2>
        <p className="text-13 leading-[1.8] text-muted-foreground">
          Your application is now in review. This is the beginning of something more personal.
        </p>

        <FormNote icon={Mail}>
          You’ll receive an email once a decision is made
          {form?.email && <> at <strong className="font-medium text-foreground wrap-anywhere">{form.email}</strong></>}.
        </FormNote>

        {summary?.referralMissed && (
          <FormNote tone="warning">
            <b className="font-medium">Your referral code wasn&apos;t applied.</b> Your application went through
            normally, but the code had already been claimed. Ask your friend for another one.
          </FormNote>
        )}
      </div>

      <Card className="relative gap-0 overflow-hidden rounded-[21px] border-[#D8D0E2] bg-[linear-gradient(125deg,#FBF9FD,#E5DEEB_45%,#FBF9FD_73%,#EAE3F0)] p-6.75 shadow-[0_22px_40px_#6A467411] before:pointer-events-none before:absolute before:-top-28.75 before:-right-30 before:size-[310px] before:rounded-full before:border before:border-[#C9BED44D] before:content-['']">
        <div className="relative flex items-center justify-between text-10 tracking-[1.7px] text-[#86758E]">
          <span>FAMEO · YOUR NEXT CHAPTER</span>
          <Asterisk aria-hidden="true" className="size-4 stroke-[1.2] text-[#AE5480]" />
        </div>
        <div className="mt-10.75 text-30 leading-[1.2] font-medium tracking-[-.9px] wrap-anywhere">{summary?.name || '—'}</div>
        <div className="mt-1.75 mb-6.75 text-xs text-[#9A7EA0] wrap-anywhere">{summary ? `@${summary.username}` : ''}</div>

        {rows.map(([k, v]) => (
          <div key={k} className="flex justify-between gap-5 border-t border-[#D9CFDF] py-3 text-11 text-[#776082]">
            <span>{k}</span>
            <strong className="text-right font-medium text-[#56435F] wrap-anywhere">{v || '—'}</strong>
          </div>
        ))}

        <div className="mt-5 flex items-center justify-between gap-2.5 text-10 text-[#8F7B98]">
          <span>APPLICATION</span>
          <Badge variant="outline" className="gap-1.5 rounded-full border-[#D8CBE0] bg-white/70 px-2.25 py-1.5 text-10 font-normal text-[#886092] before:size-1.25 before:rounded-full before:bg-[#B17498] before:content-['']">
            Under review
          </Badge>
        </div>
      </Card>
    </section>
  );
}
