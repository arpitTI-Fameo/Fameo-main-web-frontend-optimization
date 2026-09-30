import React, { useState } from 'react';
import { Check, Play, X } from 'lucide-react';

import CalendarPicker from '@/components/Common/CalendarPicker';
import FormField from '@/components/Common/FormField';
import { Button } from '@/components/ui/shadcn/button';
import { Checkbox } from '@/components/ui/shadcn/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/shadcn/collapsible';
import { Input } from '@/components/ui/shadcn/input';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/shadcn/input-group';
import { Label } from '@/components/ui/shadcn/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/shadcn/select';
import { cn } from '@/utils/cn';

import FormNote from '@/components/Common/FormNote';
import { TickIcon } from '../icons';
import { COUNTRY_CODES, mobileLenRange, POLICY_LINKS } from '../constants';
import { minDobISO, maxDobISO } from '../helpers';
import { ENTER, GROUP, GROUP_INPUT, HINT_ERROR, INLINE_LINK, INPUT } from '@/constants/authUi';
import { COLLAPSE, COLLAPSE_INNER, DATE_CONTENT, DATE_TRIGGER, DISCLOSURE, DISCLOSURE_MARK, GRID, GROUP_ACTION, GROUP_ACTION_DONE, GROUP_VERIFIED, ICON_BUTTON, PILL_LAYER, SELECT_CONTENT, SELECT_ITEM } from '../styles';

// The box pops and the tick wipes in when checked.
const CONSENT_BOX = [
  'mt-0.5 size-3.5 rounded-[3px] border-[#C9C1CF] bg-background [&_svg]:size-2.75',
  'transition-[background-color,border-color,box-shadow] duration-200 focus-visible:ring-3 focus-visible:ring-primary/22',
  'data-[state=checked]:animate-[frgPop_.32s_var(--frg-ease)] [&_svg]:animate-[frgTick_.28s_ease_.06s_both]',
].join(' ');
// An unticked row after pressing Continue while consents are missing.
const CONSENT_NUDGE_ROW = 'animate-[frgWiggle_.42s_ease]';
const CONSENT_NUDGE_BOX = 'border-primary ring-3 ring-primary/14';

const PILL_ORDER = { idle: 0, loading: 1, done: 2 };
const CONSENT_LABEL = 'block text-10 leading-[1.7] font-normal text-muted-foreground max-[651px]:text-11';

/* The Verify pill inside the mobile / email fields: idle → loading (the code
   is being sent — one send covers both) → done (verified). Its three faces
   share one grid cell and slide past each other. After the code is sent the
   idle pill reopens the OTP dialog. */
function VerifyButton({ state, disabled, onClick, label, buttonRef }) {
  const at = PILL_ORDER[state];
  const face = (i) => cn(PILL_LAYER, at === i ? 'translate-y-0 opacity-100' : at > i ? '-translate-y-2.25 opacity-0' : 'translate-y-2.25 opacity-0');
  return (
    <InputGroupButton
      ref={buttonRef}
      size="sm"
      onClick={onClick}
      disabled={state !== 'idle' || disabled}
      aria-live="polite"
      aria-label={state === 'done' ? `${label} verified` : `Verify ${label}`}
      className={cn(GROUP_ACTION, 'grid place-items-center', state === 'done' && GROUP_ACTION_DONE)}
    >
      <span className={face(0)}>Verify</span>
      <span className={face(1)}>
        <span className="size-3 animate-spin rounded-full border-[1.6px] border-brand-text/20 border-t-brand-text" />
      </span>
      <span className={face(2)}>
        {state === 'done' && <TickIcon className="size-2.75" />}
        Verified
      </span>
    </InputGroupButton>
  );
}

export default function Step01Identity({ ctx }) {
  const {
    referralFromLink, referralStatus, form, set, errors, registerFieldRef,
    ageOk, underage, onDobChange, age,
    phoneVerified, otpSent, resetOtp, setForm, clearErr, showMobileErr, onMobileChange, markTouched, mobileErrMsg,
    emailVerified, showEmailErr, emailWarn, onEmailChange, emailErrMsg,
    onReferralChange, validateReferral, removeReferral,
    otpSending, openVerify,
    consents, toggleConsent, setActivePolicy,
    intro, consentNudge,
  } = ctx;

  // Page-load cascade, only on the first visit to this step.
  const enter = (key) => (intro ? ENTER[key] : '');

  // Which pill asked for the code, so only that one spins while it sends.
  const [pending, setPending] = useState(null);
  const verifyFrom = (kind) => () => { setPending(kind); openVerify(); };
  const pillState = (kind, verified) => (verified ? 'done' : otpSending && !otpSent && pending === kind ? 'loading' : 'idle');

  // The referral section starts closed, but can't close over a code in it.
  const [referralOpen, setReferralOpen] = useState(false);
  const hasReferral = Boolean(form.referralCode) || Boolean(errors.referral);

  const canSend = otpSent || !otpSending;
  const verifyRef = (el) => { registerFieldRef('otp-send')(el); if (!phoneVerified) registerFieldRef('otp-panel')(el); };
  const emailVerifyRef = (el) => { if (phoneVerified) registerFieldRef('otp-panel')(el); };

  const dobTone = underage || errors.dob ? 'error' : ageOk ? 'success' : 'muted';
  const dobHint = underage ? `You're ${age} — Fameo is only for people 18 and older. You won't be able to continue with this date of birth.`
    : ageOk ? `You're ${age} — eligibility confirmed. We've checked the 18+ box for you.`
      : errors.dob || '';

  const openPolicy = (i) => (e) => { e.preventDefault(); e.stopPropagation(); setActivePolicy(POLICY_LINKS[i]); };
  const policyLink = (i, text) => (
    <Button type="button" variant="link" className={INLINE_LINK} onClick={openPolicy(i)}>{text}</Button>
  );

  return (
    <>
      {/* invite banner — only when the visitor arrived via a referral link */}
      {referralFromLink && referralStatus.state === 'valid' && (
        <FormNote tone="success" className="mt-0 mb-5">
          <b className="font-medium">You&apos;ve been invited.</b>{' '}
          {referralStatus.data?.discount
            ? `Your friend's code gets you ${referralStatus.data.discount}% off your first plan.`
            : 'Your invite code has been applied.'}
          {' '}It&apos;s already filled in below — nothing to enter.
        </FormNote>
      )}
      {referralFromLink && referralStatus.state === 'invalid' && (
        <FormNote tone="warning" className="mt-0 mb-5">
          <b className="font-medium">The invite code in your link could not be verified.</b>{' '}
          You can clear it below and continue, or check the link your friend sent.
        </FormNote>
      )}

      <div className={GRID}>
        <FormField id="frg-first" label="First name" fieldRef={registerFieldRef('fname')} hint={errors.fname} tone="error" className={enter('d560')}>
          <Input id="frg-first" className={INPUT} placeholder="e.g. Arya" value={form.fname} onChange={set('fname')}
            autoComplete="given-name" aria-invalid={Boolean(errors.fname) || undefined} />
        </FormField>

        <FormField id="frg-last" label="Last name" fieldRef={registerFieldRef('lname')} hint={errors.lname} tone="error" className={enter('d560')}>
          <Input id="frg-last" className={INPUT} placeholder="e.g. Shah" value={form.lname} onChange={set('lname')}
            autoComplete="family-name" aria-invalid={Boolean(errors.lname) || undefined} />
        </FormField>

        <FormField id="frg-dob" label="Date of birth" fieldRef={registerFieldRef('dob')} className={cn('max-[651px]:col-span-full', enter('d620'))}
          hint={dobHint} hintId="frg-dob-help" tone={dobTone}>
          <CalendarPicker id="frg-dob" value={form.dob} onChange={onDobChange} min={minDobISO()} max={maxDobISO()}
            placeholder="dd/mm/yyyy" className={DATE_TRIGGER} contentClassName={DATE_CONTENT}
            aria-invalid={underage || Boolean(errors.dob) || undefined} aria-describedby="frg-dob-help" />
        </FormField>

        <FormField
          id="frg-mobile"
          label="Mobile number"
          fieldRef={registerFieldRef('mobile')}
          className={cn('max-[651px]:col-span-full', enter('d620'))}
          aside={otpSent && (
            <Button type="button" variant="link" onClick={resetOtp} className={cn(INLINE_LINK, 'text-10')}>Change mobile / email</Button>
          )}
          hint={showMobileErr ? (errors.phone || mobileErrMsg) : ''}
          tone="error"
        >
          <InputGroup className={cn(GROUP, 'h-11.75', phoneVerified && GROUP_VERIFIED)}>
            <InputGroupAddon className="ml-0 py-0 pl-0 has-[>button]:ml-0">
              <Select
                value={form.cc}
                disabled={otpSent}
                onValueChange={(cc) => { setForm((f) => ({ ...f, cc, mobile: f.mobile.slice(0, mobileLenRange(cc)[1]) })); clearErr('phone'); }}
              >
                <SelectTrigger
                  aria-label="Country code"
                  className="h-7 w-[73px] gap-1 rounded-none border-0 border-r border-border bg-transparent px-2 text-11 text-foreground shadow-none focus-visible:ring-0 data-[size=default]:h-7 max-[821px]:w-15.5 max-[651px]:w-16 max-[651px]:text-13 [&>svg]:size-3"
                >
                  {/* Just the code in the field; the list also shows the country. */}
                  <SelectValue>{form.cc}</SelectValue>
                </SelectTrigger>
                <SelectContent className={SELECT_CONTENT}>
                  {COUNTRY_CODES.map((x) => (
                    <SelectItem key={x.d} value={x.d} className={SELECT_ITEM}>
                      {x.d} <span className="text-muted-foreground">{x.c}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </InputGroupAddon>
            <InputGroupInput id="frg-mobile" type="tel" inputMode="numeric" autoComplete="tel"
              placeholder="Mobile number" value={form.mobile} onChange={onMobileChange} disabled={otpSent}
              onBlur={markTouched('mobile')} aria-invalid={showMobileErr || undefined} className={GROUP_INPUT} />
            <InputGroupAddon align="inline-end" className="pr-2 has-[>button]:mr-0">
              <VerifyButton label="mobile number" state={pillState('phone', phoneVerified)}
                disabled={!canSend} onClick={verifyFrom('phone')} buttonRef={verifyRef} />
            </InputGroupAddon>
          </InputGroup>
        </FormField>

        <FormField
          id="frg-email"
          label="Email address"
          fieldRef={registerFieldRef('email')}
          className={cn('col-span-full', enter('d680'))}
          hint={showEmailErr ? (errors.email || emailErrMsg) : emailWarn}
          tone={showEmailErr ? 'error' : 'warning'}
        >
          <InputGroup className={cn(GROUP, emailVerified && GROUP_VERIFIED)}>
            <InputGroupInput id="frg-email" type="email" placeholder="you@example.com" value={form.email}
              onChange={onEmailChange} disabled={otpSent} autoComplete="email" onBlur={markTouched('email')}
              aria-invalid={showEmailErr || undefined} className={GROUP_INPUT} />
            <InputGroupAddon align="inline-end" className="pr-2 has-[>button]:mr-0">
              <VerifyButton label="email address" state={pillState('email', emailVerified)}
                disabled={!canSend} onClick={verifyFrom('email')} buttonRef={emailVerifyRef} />
            </InputGroupAddon>
          </InputGroup>
        </FormField>
      </div>

      {/* ── referral code (optional) ── */}
      <Collapsible open={referralOpen || hasReferral} onOpenChange={setReferralOpen} className={cn('mt-4.25', enter('d740'))}>
        <CollapsibleTrigger className={DISCLOSURE}>
          <Play aria-hidden="true" className={DISCLOSURE_MARK} />
          Have a referral code? <span className="text-muted-foreground/60">Optional</span>
        </CollapsibleTrigger>
        <CollapsibleContent className={COLLAPSE}>
          <div className={cn('pt-2', COLLAPSE_INNER)}>
            <FormField
              id="frg-referral"
              label="Referral code"
              fieldRef={registerFieldRef('referral')}
              hint={referralStatus.state === 'checking' ? 'Checking code…'
                : referralStatus.state === 'valid' ? referralStatus.msg
                  : errors.referral || 'Have a code from a friend? Enter it to get your joining discount.'}
              tone={errors.referral ? 'error' : referralStatus.state === 'valid' ? 'success' : 'muted'}
            >
              <Input id="frg-referral" className={cn(INPUT, 'tracking-[.06em] uppercase')} placeholder="FAMEO-XXXXXX"
                value={form.referralCode} onChange={onReferralChange}
                onBlur={() => form.referralCode.trim() && referralStatus.state !== 'valid' && validateReferral()}
                autoComplete="off" aria-invalid={Boolean(errors.referral) || undefined} />
            </FormField>

            {referralStatus.state === 'valid' && (
              <FormNote tone="success" icon={Check}>
                <span className="flex items-start gap-2.5">
                  <span className="min-w-0 flex-1">
                    <span className="block font-medium">
                      Referral applied{referralStatus.data?.tier ? ` · Tier ${referralStatus.data.tier}` : ''}
                    </span>
                    {referralStatus.data?.discount ? `${referralStatus.data.discount}% off your first plan` : 'Discount will apply at checkout'} · code {form.referralCode}
                  </span>
                  <Button type="button" variant="ghost" size="icon" onClick={removeReferral} title="Remove code"
                    aria-label="Remove referral code" className={ICON_BUTTON}>
                    <X aria-hidden="true" />
                  </Button>
                </span>
              </FormNote>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* ── confirmations ── */}
      <div className={cn('mt-3.25 grid gap-2.5 border-t border-border/70 pt-4.5', enter('d800'))}>
        <div ref={registerFieldRef('age')}>
          {/* keyed on the nudge so a repeat press replays the shake */}
          <div key={`age-${consentNudge}`} className={cn('flex items-start gap-2.25', consentNudge > 0 && !consents.age && CONSENT_NUDGE_ROW)}>
            <Checkbox id="frg-age" checked={consents.age} disabled={underage}
              onCheckedChange={() => { if (!underage) toggleConsent('age'); }}
              aria-invalid={underage || Boolean(errors.age) || undefined}
              className={cn(CONSENT_BOX, consentNudge > 0 && !consents.age && CONSENT_NUDGE_BOX)} />
            <Label htmlFor="frg-age" className={CONSENT_LABEL}>
              I’m 18 or older and eligible to join Fameo.
              {consents.age && ageOk && <span className="text-chart-3"> Confirmed from your date of birth.</span>}
            </Label>
          </div>
          {(underage || errors.age) && (
            <p className={cn(HINT_ERROR, 'mt-1 pl-5.75')}>
              {underage ? 'Your date of birth shows you are under 18, so this cannot be confirmed.' : errors.age}
            </p>
          )}
        </div>

        <div ref={registerFieldRef('terms')}>
          <div key={`terms-${consentNudge}`} className={cn('flex items-start gap-2.25', consentNudge > 0 && !consents.terms && CONSENT_NUDGE_ROW)}>
            <Checkbox id="frg-terms" checked={consents.terms} onCheckedChange={() => toggleConsent('terms')}
              aria-invalid={Boolean(errors.terms) || undefined}
              className={cn(CONSENT_BOX, consentNudge > 0 && !consents.terms && CONSENT_NUDGE_BOX)} />
            <Label htmlFor="frg-terms" className={CONSENT_LABEL}>
              I agree to the {policyLink(1, 'Terms')}, {policyLink(0, 'Privacy Policy')} and {policyLink(2, 'Cookie Policy')}.
            </Label>
          </div>
          {errors.terms && <p className={cn(HINT_ERROR, 'mt-1 pl-5.75')}>{errors.terms}</p>}
        </div>
      </div>
    </>
  );
}
