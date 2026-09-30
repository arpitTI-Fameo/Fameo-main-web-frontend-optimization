import React from 'react';
import { EyeOff, MapPin } from 'lucide-react';

import FormField from '@/components/Common/FormField';
import { Button } from '@/components/ui/shadcn/button';
import { Input } from '@/components/ui/shadcn/input';
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from '@/components/ui/shadcn/input-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/shadcn/select';
import { cn } from '@/utils/cn';

import FormNote from '@/components/Common/FormNote';
import { GENDER_OPTIONS } from '../constants';
import { GROUP, GROUP_INPUT, INLINE_LINK, INPUT } from '@/constants/authUi';
import { GRID, SELECT_CONTENT, SELECT_ITEM, SELECT_TRIGGER } from '../styles';

export default function Step02Profile({ ctx }) {
  const {
    registerFieldRef, errors, usernameStatus, form, setField, setUsernameStatus,
    statesError, onStateChange, statesLoading, states,
    citiesError, onCityChange, citiesLoading, cities,
    pinStatus, pinMismatch, applyPinLocation
  } = ctx;

  const usernameBad = Boolean(errors.username) || ['taken', 'invalid', 'error'].includes(usernameStatus);
  const usernameHint = usernameStatus === 'checking' ? 'Checking availability…'
    : usernameStatus === 'available' ? `@${form.username} is available — fameo.vip/@${form.username} is yours`
      : usernameStatus === 'taken' ? `@${form.username} is already taken — please use another username`
        : usernameStatus === 'error' ? 'We couldn’t check that username just now — please try again'
          : errors.username || '';

  const pinBad = Boolean(errors.pincode) || pinStatus.state === 'invalid';
  const pinHint = errors.pincode ? errors.pincode
    : pinStatus.state === 'invalid' ? 'A PIN code is 6 digits and can’t start with 0.'
      : pinStatus.state === 'checking' ? 'Checking this PIN code…'
        : pinStatus.state === 'found' ? [pinStatus.data.area, pinStatus.data.district, pinStatus.data.state].filter(Boolean).join(' · ')
          : '';

  const cityPlaceholder = !form.stateId ? 'Choose a state first'
    : citiesLoading ? 'Loading cities…'
      : cities.length === 0 ? 'No cities found'
        : 'Select city';

  return (
    <>
      <div className={GRID}>
        <FormField id="frg-user" label="Username" fieldRef={registerFieldRef('username')} hint={usernameHint}
          tone={usernameStatus === 'available' ? 'success' : usernameBad ? 'error' : 'muted'}>
          <InputGroup className={GROUP}>
            <InputGroupAddon className="pr-0 pl-3.25">
              <InputGroupText className="text-13 font-normal text-brand-muted">@</InputGroupText>
            </InputGroupAddon>
            <InputGroupInput id="frg-user" className={cn(GROUP_INPUT, 'pl-1.5')} placeholder="your.name" value={form.username}
              onChange={(e) => { setField('username', e.target.value.replace(/[^A-Za-z0-9_.]/g, '').slice(0, 30)); setUsernameStatus(null); }}
              autoComplete="username" aria-invalid={usernameBad || undefined} />
          </InputGroup>
        </FormField>

        <FormField id="frg-gender" label="Gender" fieldRef={registerFieldRef('gender')} hint={errors.gender} tone="error">
          <Select value={form.gender || ''} onValueChange={(v) => setField('gender', v)}>
            <SelectTrigger id="frg-gender" className={SELECT_TRIGGER} aria-invalid={Boolean(errors.gender) || undefined}>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent className={SELECT_CONTENT}>
              {GENDER_OPTIONS.map((g) => <SelectItem key={g.value} value={g.value} className={SELECT_ITEM}>{g.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </FormField>

        <FormField id="frg-state" label="State" fieldRef={registerFieldRef('state')} hint={errors.state || statesError} tone="error">
          <Select value={form.stateId ? String(form.stateId) : ''} onValueChange={onStateChange} disabled={statesLoading}>
            <SelectTrigger id="frg-state" className={SELECT_TRIGGER} aria-invalid={Boolean(errors.state) || undefined}>
              <SelectValue placeholder={statesLoading ? 'Loading states…' : 'Select state'} />
            </SelectTrigger>
            <SelectContent className={SELECT_CONTENT}>
              {states.map((s) => <SelectItem key={s.id} value={String(s.id)} className={SELECT_ITEM}>{s.state_name}</SelectItem>)}
            </SelectContent>
          </Select>
        </FormField>

        <FormField id="frg-city" label="City" fieldRef={registerFieldRef('city')} hint={errors.city || citiesError} tone="error">
          <Select value={form.cityId ? String(form.cityId) : ''} onValueChange={onCityChange}
            disabled={!form.stateId || citiesLoading}>
            <SelectTrigger id="frg-city" className={SELECT_TRIGGER} aria-invalid={Boolean(errors.city) || undefined}>
              <SelectValue placeholder={cityPlaceholder} />
            </SelectTrigger>
            <SelectContent className={SELECT_CONTENT}>
              {cities.map((c) => <SelectItem key={c.id} value={String(c.id)} className={SELECT_ITEM}>{c.city_name}</SelectItem>)}
            </SelectContent>
          </Select>
        </FormField>

        <FormField id="frg-pin" label="PIN code" fieldRef={registerFieldRef('pincode')} className="col-span-full"
          hint={pinHint} tone={pinBad ? 'error' : pinStatus.state === 'found' && !pinMismatch ? 'success' : 'muted'}>
          <Input id="frg-pin" className={INPUT} inputMode="numeric" maxLength={6} autoComplete="postal-code"
            placeholder="6-digit PIN code" value={form.pincode} aria-invalid={pinBad || undefined}
            onChange={(e) => setField('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))} />
        </FormField>
      </div>

      {pinStatus.state === 'found' && !form.stateId && (
        <FormNote tone="success" icon={MapPin}>
          This PIN is in <b className="font-medium">{[pinStatus.data.district, pinStatus.data.state].filter(Boolean).join(', ')}</b>.{' '}
          <Button type="button" variant="link" onClick={applyPinLocation} className={cn(INLINE_LINK, 'font-medium text-current')}>
            Fill state and city for me
          </Button>
        </FormNote>
      )}
      {pinMismatch && (
        <FormNote tone="warning">
          <b className="font-medium">This PIN code is in {pinStatus.data.state}</b>, but you selected {form.state}.{' '}
          <Button type="button" variant="link" onClick={applyPinLocation} className={cn(INLINE_LINK, 'font-medium text-current')}>
            Use {pinStatus.data.district || pinStatus.data.state} instead
          </Button>
        </FormNote>
      )}

      <FormNote icon={EyeOff}>Your personal details and exact location aren’t displayed on your public profile.</FormNote>
    </>
  );
}
