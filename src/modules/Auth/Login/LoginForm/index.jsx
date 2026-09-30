'use client';
// The sign-in form. All state and the submit path come from LoginContainer;
// this only draws them. There is no <form> element (Enter and the button both
// call handleLogin directly), exactly as before.
//
// Two display-only additions from the handoff: show / hide password, and a
// "Caps Lock is on" hint. Neither touches the values or the submit.

import { useState } from 'react';
import { ArrowRight, Eye, EyeOff, Fingerprint, LoaderCircle, LockKeyhole, Smartphone, UserRound } from 'lucide-react';

import FormField from '@/components/Common/FormField';
import FormNote from '@/components/Common/FormNote';
import { Button } from '@/components/ui/shadcn/button';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/shadcn/input-group';
import { ENTER, GROUP, GROUP_INPUT, PRIMARY } from '@/constants/authUi';
import { cn } from '@/utils/cn';

import { FIELD, FIELD_ICON, FIELD_INPUT, REVEAL, SIGN_IN } from '../styles';

export default function LoginForm({ register, loading, error, invalid, ready, isSessionExpired, handleLogin }) {
  const [reveal, setReveal] = useState(false);
  const [caps, setCaps] = useState(false);

  const onKeyDown = (e) => e.key === 'Enter' && handleLogin();
  const readCaps = (e) => setCaps(Boolean(e.getModifierState?.('CapsLock')));

  return (
    <div className="mx-auto w-full max-w-90 max-[651px]:max-w-none">
      <div className={cn('mb-6.25 max-[651px]:mb-5', ENTER.d380)}>
        <span className="grid size-10 place-items-center rounded-[12px] border border-[#DED4E5] bg-linear-135 from-[#FDFBFF] to-[#E9E1F0] text-[#A56F94] shadow-[inset_0_0_0_1px_#FFFFFFA6]">
          <Fingerprint aria-hidden="true" className="size-4 stroke-[1.3]" />
        </span>
      </div>

      <h2 className={cn('mb-3 text-30 leading-[1.12] font-medium tracking-[-1px] max-[651px]:text-[28px]', ENTER.d420)}>Welcome back.</h2>
      <p className={cn('mb-7.25 max-w-85 text-xs leading-[1.75] text-[#8A7D93] max-[651px]:mb-6.25', ENTER.d500)}>
        Sign in with the same account you use
        <br />
        on the Fameo app.
      </p>

      {isSessionExpired && (
        <FormNote tone="warning" icon={LockKeyhole} className="mt-0 mb-5">
          Your session has expired. Please sign in again.
        </FormNote>
      )}

      <FormField id="lg-username" label="Username" className={cn('mb-4.25', ENTER.d560)}>
        <InputGroup className={cn(GROUP, FIELD)}>
          <InputGroupAddon className={FIELD_ICON}>
            <UserRound aria-hidden="true" />
          </InputGroupAddon>
          <InputGroupInput
            id="lg-username"
            type="text"
            placeholder="Your username"
            autoComplete="username"
            autoCapitalize="none"
            spellCheck={false}
            aria-invalid={invalid.username || undefined}
            aria-describedby="lg-error"
            className={cn(GROUP_INPUT, FIELD_INPUT)}
            {...register('username')}
            onKeyDown={onKeyDown}
          />
        </InputGroup>
      </FormField>

      <FormField
        id="lg-password"
        label="Password"
        className={cn('mb-4.25', ENTER.d620)}
        hint={caps ? 'Caps Lock is on' : ''}
        tone="warning"
      >
        <InputGroup className={cn(GROUP, FIELD)}>
          <InputGroupAddon className={FIELD_ICON}>
            <LockKeyhole aria-hidden="true" />
          </InputGroupAddon>
          <InputGroupInput
            id="lg-password"
            type={reveal ? 'text' : 'password'}
            placeholder="Your password"
            autoComplete="current-password"
            aria-invalid={invalid.password || undefined}
            aria-describedby="lg-error"
            className={cn(GROUP_INPUT, FIELD_INPUT)}
            {...register('password')}
            onKeyDown={(e) => { readCaps(e); onKeyDown(e); }}
            onKeyUp={readCaps}
          />
          <InputGroupAddon align="inline-end" className="pr-1 has-[>button]:mr-0">
            <InputGroupButton
              size="icon-sm"
              onClick={() => setReveal((v) => !v)}
              aria-label={reveal ? 'Hide password' : 'Show password'}
              aria-pressed={reveal}
              className={REVEAL}
            >
              {reveal ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </FormField>

      <div id="lg-error">{error && <FormNote tone="error" className="mt-2.5">{error}</FormNote>}</div>

      <div className={ENTER.d680}>
        <Button
          type="button"
          onClick={handleLogin}
          disabled={loading}
          className={cn(
            PRIMARY, SIGN_IN,
            'group/cta relative overflow-hidden transition-[background-color,translate,scale,opacity,filter,box-shadow] duration-300',
            ready
              ? 'shadow-[0_10px_22px_-12px_rgb(233_30_99/.75)] hover:shadow-[0_14px_26px_-12px_rgb(233_30_99/.85)] active:translate-y-0 active:scale-98'
              : 'shadow-[0_5px_15px_rgb(233_30_99/.08)]'
          )}
        >
          {/* one pass of light the moment both fields are filled */}
          {ready && (
            <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 w-[40%] animate-[frgShine_1.1s_ease_.1s_both] bg-[linear-gradient(90deg,transparent,rgb(255_255_255/.45),transparent)]" />
          )}
          {loading ? 'Signing in…' : 'Sign in'}
          <span className="grid place-items-center *:col-start-1 *:row-start-1">
            <ArrowRight
              aria-hidden="true"
              className={cn(
                'transition-[opacity,translate] duration-300',
                loading ? 'translate-x-2 opacity-0' : ready && 'group-hover/cta:animate-[frgNudge_.9s_ease-in-out_infinite]'
              )}
            />
            <LoaderCircle aria-hidden="true" className={cn('size-3.25! animate-spin transition-opacity duration-300', loading ? 'opacity-100' : 'opacity-0')} />
          </span>
        </Button>
      </div>

      <p className={cn('mt-4 flex items-center justify-center gap-1.75 text-center text-10 leading-[1.6] text-[#9D8BA8]', ENTER.d740)}>
        <Smartphone aria-hidden="true" className="size-3 stroke-[1.65] text-[#AD91B8]" />
        One account. Wherever you connect.
      </p>
    </div>
  );
}
