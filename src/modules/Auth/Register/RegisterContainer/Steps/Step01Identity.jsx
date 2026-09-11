import React from 'react';
import { Tick, Check } from '../../icons';
import { COUNTRY_CODES, mobileLenRange, OTP_LENGTH, POLICY_LINKS } from '../../constants';
import { minDobISO, maxDobISO } from '../../helpers';

export default function Step01Identity({ ctx }) {
  const {
    referralFromLink, referralStatus, form, set, errors, registerFieldRef,
    ageOk, underage, onDobChange, age,
    phoneVerified, otpSent, resetOtp, setForm, clearErr, showMobileErr, mobileOk, onMobileChange, markTouched, mobileErrMsg, mobileHint,
    emailVerified, showEmailErr, emailWarn, onEmailChange, emailOk, emailErrMsg,
    onReferralChange, validateReferral, removeReferral,
    sendOtp, otpSending, mobileShake, getRaw, mobileOtp, mobileRefs, otpDigit, otpKey, mobileOtpStatus, mobileComplete, verifyMobile, resendIn,
    emailShake, emailOtp, emailRefs, emailOtpStatus, emailComplete, verifyEmail,
    consents, toggleConsent, setActivePolicy
  } = ctx;

  return (
    <>
      {/* invite banner — only when the visitor arrived via a referral link */}
      {referralFromLink && referralStatus.state === 'valid' && (
        <div className="frg-note green">
          <b>You&apos;ve been invited.</b>{' '}
          {referralStatus.data?.discount
            ? `Your friend's code gets you ${referralStatus.data.discount}% off your first plan.`
            : 'Your invite code has been applied.'}
          {' '}It&apos;s already filled in below — nothing to enter.
        </div>
      )}
      {referralFromLink && referralStatus.state === 'invalid' && (
        <div className="frg-note amber">
          <b>The invite code in your link could not be verified.</b>{' '}
          You can clear it below and continue, or check the link your friend sent.
        </div>
      )}

      <div className="frg-rule">PERSONAL DETAILS</div>
      <div className="frg-row2">
        <div className="frg-field" ref={registerFieldRef('fname')}>
          <label className="frg-label" htmlFor="frg-first">First name <span className="req">*</span></label>
          <div className={`frg-uline${errors.fname ? ' err' : ''}`}>
            <input id="frg-first" className="frg-input" placeholder="Ada" value={form.fname} onChange={set('fname')} autoComplete="given-name" />
          </div>
          {errors.fname && <div className="frg-help err">{errors.fname}</div>}
        </div>
        <div className="frg-field" ref={registerFieldRef('lname')}>
          <label className="frg-label" htmlFor="frg-last">Last name <span className="req">*</span></label>
          <div className={`frg-uline${errors.lname ? ' err' : ''}`}>
            <input id="frg-last" className="frg-input" placeholder="Lovelace" value={form.lname} onChange={set('lname')} autoComplete="family-name" />
          </div>
          {errors.lname && <div className="frg-help err">{errors.lname}</div>}
        </div>
      </div>

      <div className="frg-field" ref={registerFieldRef('dob')}>
        <label className="frg-label" htmlFor="frg-dob">
          Date of birth <span className="req">*</span>
          {ageOk && <span className="frg-pill ok"><span className="dot" /> 18+ CONFIRMED</span>}
          {underage && <span className="frg-pill err"><span className="dot" /> UNDER 18</span>}
        </label>
        <div className={`frg-uline${underage || errors.dob ? ' err' : ''}`}>
          <input id="frg-dob" className="frg-input" type="date" value={form.dob} onChange={onDobChange}
            min={minDobISO()} max={maxDobISO()} aria-invalid={underage || undefined} aria-describedby="frg-dob-help" />
        </div>
        <div id="frg-dob-help" className={`frg-help${underage || errors.dob ? ' err' : ageOk ? ' ok' : ''}`} role={underage ? 'alert' : undefined}>
          {underage ? `You're ${age} — Fameo is only for people 18 and older. You won't be able to continue with this date of birth.`
            : ageOk ? `You're ${age} — eligibility confirmed. We've checked the 18+ box for you.`
            : errors.dob ? errors.dob
            : 'You must be 18 or older to create a Fameo account.'}
        </div>
      </div>

      <div className="frg-rule">CONTACT VERIFICATION</div>

      <div className="frg-field" ref={registerFieldRef('mobile')}>
        <label className="frg-label" htmlFor="frg-mobile">
          Mobile number <span className="req">*</span>
          <span className={`frg-pill${phoneVerified ? ' ok' : ''}`}><span className="dot" /> {phoneVerified ? 'VERIFIED' : 'UNVERIFIED'}</span>
          {otpSent && <button type="button" className="frg-change" onClick={resetOtp}>Change mobile / email</button>}
        </label>
        <div className="frg-mobile">
          <div className="frg-cc">
            <span className="iso">{COUNTRY_CODES.find(x => x.d === form.cc)?.c}</span>
            <select className="frg-select" value={form.cc}
              onChange={e => { const cc = e.target.value; setForm(f => ({ ...f, cc, mobile: f.mobile.slice(0, mobileLenRange(cc)[1]) })); clearErr('phone'); }}
              disabled={otpSent} aria-label="Country code">
              {COUNTRY_CODES.map(x => <option key={x.c + x.d} value={x.d}>{x.d}</option>)}
            </select>
          </div>
          <div className={`frg-uline${showMobileErr ? ' err' : mobileOk ? ' ok' : ''}`}>
            <input id="frg-mobile" className="frg-input" type="tel" inputMode="numeric" autoComplete="tel"
              placeholder="Mobile number (without country code)" value={form.mobile}
              onChange={onMobileChange} disabled={otpSent}
              onBlur={markTouched('mobile')}
              aria-invalid={showMobileErr || undefined} />
          </div>
        </div>
        <div className={`frg-help${showMobileErr ? ' err' : mobileOk ? ' ok' : ''}`}>
          {showMobileErr ? (errors.phone || mobileErrMsg)
            : mobileOk ? 'Looks good'
            : `Digits only · ${mobileHint} for ${form.cc}`}
        </div>
      </div>

      <div className="frg-field" ref={registerFieldRef('email')}>
        <label className="frg-label" htmlFor="frg-email">
          Email address <span className="req">*</span>
          <span className={`frg-pill${emailVerified ? ' ok' : ''}`}><span className="dot" /> {emailVerified ? 'VERIFIED' : 'UNVERIFIED'}</span>
        </label>
        <div className={`frg-uline${showEmailErr ? ' err' : form.email && emailOk ? ' ok' : ''}`}>
          <input id="frg-email" className="frg-input" type="email" placeholder="you@example.com"
            value={form.email} onChange={onEmailChange} disabled={otpSent} autoComplete="email"
            onBlur={markTouched('email')} aria-invalid={showEmailErr || undefined} />
        </div>
        <div className={`frg-help${showEmailErr ? ' err' : emailWarn ? ' warn' : form.email && emailOk ? ' ok' : ''}`}>
          {showEmailErr ? (errors.email || emailErrMsg)
            : emailWarn ? emailWarn
            : form.email && emailOk ? 'Looks good'
            : "We'll send a verification code to this address"}
        </div>
      </div>

      {/* ── referral code (optional) ── */}
      <div className="frg-field" ref={registerFieldRef('referral')}>
        <label className="frg-label" htmlFor="frg-referral">
          Referral code <span className="opt">Optional</span>
          {referralStatus.state === 'valid' && <span className="frg-pill ok"><span className="dot" /> APPLIED</span>}
        </label>
        <div className={`frg-uline${errors.referral ? ' err' : referralStatus.state === 'valid' ? ' ok' : ''}`}>
          <input id="frg-referral" className="frg-input mono" placeholder="FAMEO-XXXXXX"
            value={form.referralCode} onChange={onReferralChange}
            onBlur={() => form.referralCode.trim() && referralStatus.state !== 'valid' && validateReferral()}
            autoComplete="off" aria-invalid={!!errors.referral || undefined} />
        </div>
        <div className={`frg-help${errors.referral ? ' err' : referralStatus.state === 'valid' ? ' ok' : ''}`}>
          {referralStatus.state === 'checking' ? 'Checking code…'
            : referralStatus.state === 'valid' ? referralStatus.msg
            : errors.referral ? errors.referral
            : 'Have a code from a friend? Enter it to get your joining discount.'}
        </div>

        {referralStatus.state === 'valid' && (
          <div className="frg-ref-applied">
            <span className="frg-ref-ico">✓</span>
            <span className="frg-ref-txt">
              <span className="frg-ref-ttl">Referral applied{referralStatus.data?.tier ? ` · Tier ${referralStatus.data.tier}` : ''}</span>
              <span className="frg-ref-sub">
                {referralStatus.data?.discount ? `${referralStatus.data.discount}% off your first plan` : 'Discount will apply at checkout'} · code {form.referralCode}
              </span>
            </span>
            <button className="frg-ref-rm" onClick={removeReferral} title="Remove code" type="button">×</button>
          </div>
        )}
      </div>

      {!otpSent && (
        <button className="frg-otp" ref={registerFieldRef('otp-send')} disabled={!(mobileOk && emailOk) || otpSending} onClick={sendOtp}>
          {otpSending ? <span className="frg-spin" /> : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
          )}
          {otpSending ? 'SENDING…' : 'SEND OTP TO MOBILE & EMAIL'}
        </button>
      )}
      {errors.verify && !otpSent && <div className="frg-help err" style={{ marginTop: 10 }}>{errors.verify}</div>}

      {otpSent && !phoneVerified && (
        <div className={`frg-otp-panel${mobileShake ? ' shake' : ''}`} ref={registerFieldRef('otp-panel')}>
          <div className="frg-otp-panel-title">STEP 1 — ENTER THE {OTP_LENGTH}-DIGIT CODE SENT TO {form.cc} {getRaw()}</div>
          <div className="frg-otp-digits">
            {mobileOtp.map((d, i) => (
              <input key={i} ref={el => (mobileRefs.current[i] = el)}
                className={`frg-otp-digit${d ? ' filled' : ''}`} inputMode="numeric"
                autoComplete={i === 0 ? 'one-time-code' : 'off'} maxLength={OTP_LENGTH} value={d}
                onChange={e => otpDigit('mobile', i, e.target.value)} onKeyDown={e => otpKey('mobile', i, e)}
                onFocus={e => e.target.select()} aria-label={`Mobile OTP digit ${i + 1}`} />
            ))}
          </div>
          {mobileOtpStatus.msg && <div className={`frg-otp-status ${mobileOtpStatus.type}`}>{mobileOtpStatus.msg}</div>}
          <div className="frg-otp-actions">
            <button type="button" className="frg-verify" disabled={!mobileComplete || mobileOtpStatus.type === 'pending'} onClick={verifyMobile}>VERIFY MOBILE →</button>
            <button type="button" className="frg-resend" disabled={resendIn > 0} onClick={sendOtp}>
              {resendIn > 0 ? `RESEND IN 00:${String(resendIn).padStart(2, '0')}` : 'RESEND CODE'}
            </button>
          </div>
        </div>
      )}

      {otpSent && phoneVerified && (
        <div className="frg-otp-done" role="status"><Tick /> MOBILE VERIFIED</div>
      )}
      {otpSent && phoneVerified && !emailVerified && (
        <div className={`frg-otp-panel${emailShake ? ' shake' : ''}`} ref={registerFieldRef('otp-panel')}>
          <div className="frg-otp-panel-title">STEP 2 — ENTER THE {OTP_LENGTH}-DIGIT CODE SENT TO {form.email}</div>
          <div className="frg-otp-digits">
            {emailOtp.map((d, i) => (
              <input key={i} ref={el => (emailRefs.current[i] = el)}
                className={`frg-otp-digit${d ? ' filled' : ''}`} inputMode="numeric"
                autoComplete={i === 0 ? 'one-time-code' : 'off'} maxLength={OTP_LENGTH} value={d}
                onChange={e => otpDigit('email', i, e.target.value)} onKeyDown={e => otpKey('email', i, e)}
                onFocus={e => e.target.select()} aria-label={`Email OTP digit ${i + 1}`} />
            ))}
          </div>
          {emailOtpStatus.msg && <div className={`frg-otp-status ${emailOtpStatus.type}`}>{emailOtpStatus.msg}</div>}
          <div className="frg-otp-actions">
            <button type="button" className="frg-verify" disabled={!emailComplete || emailOtpStatus.type === 'pending'} onClick={verifyEmail}>VERIFY EMAIL →</button>
            <button type="button" className="frg-resend" disabled={resendIn > 0} onClick={sendOtp}>
              {resendIn > 0 ? `RESEND IN 00:${String(resendIn).padStart(2, '0')}` : 'RESEND CODE'}
            </button>
          </div>
        </div>
      )}
      {emailVerified && <div className="frg-otp-done" role="status"><Tick /> MOBILE & EMAIL VERIFIED</div>}
      {errors.verify && otpSent && !(phoneVerified && emailVerified) && <div className="frg-help err" style={{ marginTop: 10 }}>{errors.verify}</div>}

      <div className="frg-rule">YOUR CONFIRMATION</div>
      <Check
        on={consents.age}
        toggle={() => { if (underage) return; toggleConsent('age'); }}
        locked={underage} err={underage || !!errors.age}
        refCb={registerFieldRef('age')}
        errText={underage ? 'Your date of birth shows you are under 18, so this cannot be confirmed.' : errors.age || undefined}
      >
        I confirm that I am 18 years of age or older and legally eligible to create an account on Fameo.
        {consents.age && ageOk && <span className="frg-check-note"> (Auto-confirmed from your date of birth ✓)</span>}
      </Check>
      <Check on={consents.terms} toggle={() => toggleConsent('terms')} err={!!errors.terms}
        refCb={registerFieldRef('terms')} errText={errors.terms || undefined}>
        I have read and agree to Fameo&apos;s{' '}
        <a onClick={e => { e.stopPropagation(); setActivePolicy(POLICY_LINKS[1]); }}>Terms of Service</a>,{' '}
        <a onClick={e => { e.stopPropagation(); setActivePolicy(POLICY_LINKS[0]); }}>Privacy Policy</a>, and{' '}
        <a onClick={e => { e.stopPropagation(); setActivePolicy(POLICY_LINKS[2]); }}>Cookie Policy</a>.
      </Check>
    </>
  );
}
