// "A quick mobile check." — the OTP dialog opened by the Verify buttons on the
// Identity step. One send covers both channels, so it walks mobile first, then
// email, exactly like the inline panels it replaced. All state and handlers
// come from RegisterContainer.

import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { ArrowRight, LoaderCircle, Mail, Smartphone, X } from 'lucide-react';

import { Button } from '@/components/ui/shadcn/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/shadcn/dialog';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/shadcn/input-otp';
import { cn } from '@/utils/cn';

import { OTP_LENGTH } from '../constants';
import { PLAIN, PORTAL_THEME, PRIMARY } from '@/constants/authUi';

const STATUS_TONE = {
  pending: 'text-muted-foreground',
  error: 'text-accent-foreground',
  verified: 'text-chart-3',
};

const SLOT = [
  'h-13.75 w-auto flex-1 rounded-[9px] border border-border bg-muted/50 text-[22px] text-foreground shadow-none',
  'first:rounded-[9px] first:border-l last:rounded-[9px]',
  'data-[active=true]:border-primary/40 data-[active=true]:bg-background data-[active=true]:ring-primary/15',
].join(' ');

export default function VerifyDialog({ open, onOpenChange, ctx }) {
  const {
    form, getRaw, phoneVerified, emailVerified, resendIn, sendOtp, otpSending, setOtpValue,
    mobileOtp, mobileRefs, mobileOtpStatus, mobileComplete, mobileShake, verifyMobile,
    emailOtp, emailRefs, emailOtpStatus, emailComplete, emailShake, verifyEmail,
  } = ctx;

  // Mobile until it verifies, then email. Once both are done the container
  // closes the dialog after a beat, so the last status stays visible.
  const kind = phoneVerified ? 'email' : 'mobile';
  const isMobile = kind === 'mobile';
  const digits = isMobile ? mobileOtp : emailOtp;
  const refs = isMobile ? mobileRefs : emailRefs;
  const status = isMobile ? mobileOtpStatus : emailOtpStatus;
  const complete = isMobile ? mobileComplete : emailComplete;
  const shake = isMobile ? mobileShake : emailShake;
  const verify = isMobile ? verifyMobile : verifyEmail;
  const done = phoneVerified && emailVerified;
  const Icon = isMobile ? Smartphone : Mail;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        overlayClassName="bg-[#3023345C] backdrop-blur-[5px]"
        onOpenAutoFocus={(e) => { e.preventDefault(); refs.current[0]?.focus(); }}
        className={cn(PORTAL_THEME, 'top-28.75 block max-w-[370px] translate-y-0 rounded-[20px] border-[#E1D7E6] p-6.5 shadow-[0_22px_75px_#28132D33] sm:max-w-[370px] max-[651px]:top-6')}
      >
        <div className="mb-3 flex justify-end">
          <DialogClose asChild>
            <Button type="button" variant="secondary" size="icon" className="size-7.25 rounded-full hover:bg-accent">
              <X aria-hidden="true" className="size-4 stroke-[1.65]" />
              <span className="sr-only">Close</span>
            </Button>
          </DialogClose>
        </div>

        <div className="grid size-11.5 place-items-center rounded-[13px] border border-[#E5D8E8] bg-linear-135 from-accent to-[#EAE3F0] text-primary">
          <Icon aria-hidden="true" className="size-4 stroke-[1.65]" />
        </div>

        <DialogTitle className="mt-4.5 mb-2.25 text-2xl leading-tight font-medium tracking-[-.7px]">
          {isMobile ? 'A quick mobile check.' : 'A quick email check.'}
        </DialogTitle>
        <DialogDescription className="mb-4.75 text-xs leading-[1.7] text-muted-foreground wrap-anywhere">
          Enter the {OTP_LENGTH}-digit code sent to {isMobile ? `${form.cc} ${getRaw()}` : form.email}.
        </DialogDescription>

        <InputOTP
          key={kind}
          ref={(el) => { refs.current[0] = el; }}
          maxLength={OTP_LENGTH}
          pattern={REGEXP_ONLY_DIGITS}
          inputMode="numeric"
          autoComplete="one-time-code"
          value={digits.join('')}
          onChange={(value) => setOtpValue(kind, value)}
          disabled={done}
          aria-label={`${isMobile ? 'Mobile' : 'Email'} verification code`}
          containerClassName={cn('w-full', shake && 'animate-[frgShake_.4s_cubic-bezier(.22,1,.36,1)]')}
        >
          <InputOTPGroup className="w-full gap-2">
            {digits.map((_, i) => (
              <InputOTPSlot key={i} index={i} aria-invalid={shake || undefined} className={cn(SLOT, shake && 'border-primary/60')} />
            ))}
          </InputOTPGroup>
        </InputOTP>

        {status.msg && (
          <p role="status" className={cn('mt-3 text-11 leading-[1.6]', STATUS_TONE[status.type])}>
            {status.msg}
          </p>
        )}

        <Button
          type="button"
          onClick={verify}
          disabled={!complete || status.type === 'pending' || done}
          className={cn(PRIMARY, 'mt-4.5 w-full gap-3')}
        >
          {status.type === 'pending' ? (
            <>
              <LoaderCircle aria-hidden="true" className="animate-spin" />
              Verifying…
            </>
          ) : (
            <>
              {isMobile ? 'Verify mobile' : 'Verify email'}
              <ArrowRight aria-hidden="true" />
            </>
          )}
        </Button>

        <div className="mt-1 flex items-center justify-between gap-3">
          <Button type="button" variant="link" onClick={sendOtp} disabled={resendIn > 0 || otpSending || done} className={cn(PLAIN, 'text-11')}>
            {otpSending ? 'Sending…' : resendIn > 0 ? `Resend in 00:${String(resendIn).padStart(2, '0')}` : 'Resend code'}
          </Button>
          <span className="text-10 text-muted-foreground/80">{isMobile ? 'Step 1 of 2' : 'Step 2 of 2'}</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
