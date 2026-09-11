import React from 'react';
import { GENDER_OPTIONS } from '../../constants';

export default function Step02Profile({ ctx }) {
  const {
    registerFieldRef, errors, usernameStatus, form, setField, setUsernameStatus,
    statesError, onStateChange, statesLoading, states,
    citiesError, onCityChange, citiesLoading, cities,
    pinStatus, pinMismatch, applyPinLocation
  } = ctx;

  return (
    <>
      <div className="frg-rule">PUBLIC USERNAME</div>
      <div className="frg-field" ref={registerFieldRef('username')}>
        <label className="frg-label" htmlFor="frg-user">Username <span className="req">*</span></label>
        <div className="frg-user-row">
          <span className="frg-at">@</span>
          <div className={`frg-uline${usernameStatus === 'available' ? ' ok' : (errors.username || usernameStatus === 'taken' || usernameStatus === 'invalid') ? ' err' : ''}`}>
            <input id="frg-user" className="frg-input" placeholder="ada.lovelace" value={form.username}
              onChange={e => { setField('username', e.target.value.replace(/[^A-Za-z0-9_.]/g, '').slice(0, 30)); setUsernameStatus(null); }}
              autoComplete="username" />
          </div>
        </div>
        <div className={`frg-help${usernameStatus === 'available' ? ' ok' : (errors.username || usernameStatus === 'taken' || usernameStatus === 'invalid' || usernameStatus === 'error') ? ' err' : ''}`}>
          {usernameStatus === 'checking' ? 'Checking availability…'
            : usernameStatus === 'available' ? `✓ @${form.username} is available — fameo.vip/@${form.username} is yours`
            : usernameStatus === 'taken' ? `@${form.username} is already taken — please use another username`
            : usernameStatus === 'error' ? 'We couldn’t check that username just now — please try again'
            : errors.username ? errors.username
            : '1–30 characters · letters, numbers, dots and underscores'}
        </div>
      </div>

      <div className="frg-rule">PERSONAL DETAILS</div>
      <div className="frg-field" ref={registerFieldRef('gender')}>
        <label className="frg-label" htmlFor="frg-gender">Gender <span className="req">*</span></label>
        <div className={`frg-uline${errors.gender ? ' err' : ''}`}><div className="frg-selwrap">
          <select id="frg-gender" className="frg-select2" value={form.gender} onChange={e => setField('gender', e.target.value)}>
            <option value="">Select gender</option>
            {GENDER_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div></div>
        {errors.gender && <div className="frg-help err">{errors.gender}</div>}
      </div>

      <div className="frg-rule">LOCATION</div>

      <div className="frg-row2">
        <div className="frg-field" ref={registerFieldRef('state')}>
          <label className="frg-label" htmlFor="frg-state">State <span className="req">*</span></label>
          {statesError && <div className="frg-note red">{statesError}</div>}
          <div className={`frg-uline${errors.state ? ' err' : ''}`}><div className="frg-selwrap">
            <select id="frg-state" className="frg-select2" value={form.stateId || ''} onChange={e => onStateChange(e.target.value)} disabled={statesLoading}>
              <option value="">{statesLoading ? 'Loading states…' : 'Select state'}</option>
              {states.map(s => <option key={s.id} value={s.id}>{s.state_name}</option>)}
            </select>
          </div></div>
          {errors.state && <div className="frg-help err">{errors.state}</div>}
        </div>

        <div className="frg-field" ref={registerFieldRef('city')}>
          <label className="frg-label" htmlFor="frg-city">City <span className="req">*</span></label>
          {citiesError && <div className="frg-help err">{citiesError}</div>}
          <div className={`frg-uline${errors.city ? ' err' : ''}`}><div className="frg-selwrap">
            <select id="frg-city" className="frg-select2" value={form.cityId || ''} onChange={e => onCityChange(e.target.value)} disabled={!form.stateId || citiesLoading}>
              <option value="">{!form.stateId ? 'Select a state first' : citiesLoading ? 'Loading cities…' : cities.length === 0 ? 'No cities found' : 'Select city'}</option>
              {cities.map(c => <option key={c.id} value={c.id}>{c.city_name}</option>)}
            </select>
          </div></div>
          {errors.city && <div className="frg-help err">{errors.city}</div>}
        </div>
      </div>

      <div className="frg-field" ref={registerFieldRef('pincode')}>
        <label className="frg-label" htmlFor="frg-pin">PIN code <span className="req">*</span></label>
        <div className={`frg-uline${errors.pincode || pinStatus.state === 'invalid' ? ' err' : pinStatus.state === 'found' && !pinMismatch ? ' ok' : ''}`}>
          <input id="frg-pin" className="frg-input" inputMode="numeric" maxLength={6} autoComplete="postal-code"
            placeholder="e.g. 400001" value={form.pincode}
            onChange={e => setField('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))} />
        </div>
        <div className={`frg-help${errors.pincode || pinStatus.state === 'invalid' ? ' err' : pinStatus.state === 'found' && !pinMismatch ? ' ok' : ''}`}>
          {errors.pincode ? errors.pincode
            : pinStatus.state === 'invalid' ? 'A PIN code is 6 digits and can’t start with 0.'
            : pinStatus.state === 'checking' ? 'Checking this PIN code…'
            : pinStatus.state === 'found' ? [pinStatus.data.area, pinStatus.data.district, pinStatus.data.state].filter(Boolean).join(' · ')
            : 'Your 6-digit PIN code'}
        </div>

        {pinStatus.state === 'found' && !form.stateId && (
          <div className="frg-note green">
            This PIN is in <b>{[pinStatus.data.district, pinStatus.data.state].filter(Boolean).join(', ')}</b>.{' '}
            <a onClick={applyPinLocation} role="button" tabIndex={0}
              onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), applyPinLocation())}>
              Fill state and city for me
            </a>
          </div>
        )}
        {pinMismatch && (
          <div className="frg-note amber">
            <b>This PIN code is in {pinStatus.data.state}</b>, but you selected {form.state}.{' '}
            <a onClick={applyPinLocation} role="button" tabIndex={0}
              onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), applyPinLocation())}>
              Use {pinStatus.data.district || pinStatus.data.state} instead
            </a>
          </div>
        )}
      </div>
    </>
  );
}
