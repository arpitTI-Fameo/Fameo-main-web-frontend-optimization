'use client';

import React, { useState, useEffect, useRef } from 'react';
import logo from '@/app/assets/logo.png';
import { CSS } from '../styles';
import { Tick, GreenTick, EyeGlyph, Check } from '../icons';
import PolicyModal from '../PolicyModal';
import LiveSelfieCapture from '../LiveSelfieCapture';
import { API_BASE, apiCall, REFERRAL_VALIDATE, readReferralFromUrl, LIVE_SELFIE_ENDPOINT } from '../api';
import {
  MAX_GENERIC_FILES, MAX_FILE_BYTES, ACCEPTED_DOC_EXT, COUNTRY_CODES,
  mobileLenRange, validateMobile, PATTERNS, validateEmail, PIN_PATTERN,
  normName, lookupPincode, pickCategoryIcon, GENDER_OPTIONS, POLICY_LINKS,
  STEPS, OTP_LENGTH, RESEND_SECONDS,
} from '../constants';
import {
  isRealDate, calcAge, maxDobISO, minDobISO, fmtSize, formatDocLabel,
  cleanUrl, friendlyOtpError, friendlyRegisterError, livenessHint, isFatalLiveness,
} from '../helpers';

/* ═══════════════════════════════════════════════════════════════════════════
   FAMEO REGISTER FLOW — Doc 1 design system + Doc 2 API-driven steps
   ─────────────────────────────────────────────────────────────────────────
     STEP 01 — IDENTITY   name · dob (18+ gate) · country/mobile/email · referral
     STEP 02 — PROFILE    username · gender · pin → state/city
     STEP 03 — SOCIALS    primary platform · youtube url · instagram url
     STEP 04 — CATEGORY   category grid (API) · profession (API)
     STEP 05 — PROOF      LIVE selfie (blink liveness) · docs · press urls
     SUCCESS              application summary
   ═══════════════════════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════════════════════════ */
export default function RegisterContainer({ onComplete, logo: logoProp }) {
  const brandLogo = logoProp ?? logo;
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState('fwd');

  const [form, setForm] = useState({
    fname: '', lname: '', dob: '', cc: '+91', mobile: '', email: '',
    username: '', gender: '',
    stateId: null, state: '', stateCode: '', cityId: null, city: '', pincode: '',
    primaryPlatform: '', youtube: '', instagram: '',
    categoryCode: '', category: '', categoryId: null,
    professionCode: '', profession: '', professionId: null,
    pressUrls: '',
    referralCode: '',
  });
  const [consents, setConsents] = useState({ age: false, terms: false });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [activePolicy, setActivePolicy] = useState(null);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  /* OTP */
  const [otpSent, setOtpSent] = useState(false);
  const [otpSending, setOtpSending] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [mobileOtp, setMobileOtp] = useState(Array(OTP_LENGTH).fill(''));
  const [emailOtp, setEmailOtp] = useState(Array(OTP_LENGTH).fill(''));
  const [mobileOtpStatus, setMobileOtpStatus] = useState({ msg: '', type: '' });
  const [emailOtpStatus, setEmailOtpStatus] = useState({ msg: '', type: '' });
  const [mobileShake, setMobileShake] = useState(false);
  const [emailShake, setEmailShake] = useState(false);
  const [resendIn, setResendIn] = useState(0);
  const mobileRefs = useRef([]);
  const emailRefs = useRef([]);

  /* referral */
  const [referralStatus, setReferralStatus] = useState({ state: 'idle', msg: '', data: null });
  const [referralFromLink, setReferralFromLink] = useState(false);
  const referralCheckRef = useRef(null);

  /* async lookups */
  const [usernameStatus, setUsernameStatus] = useState(null);
  const usernameCheckRef = useRef(null);
  const [states, setStates] = useState([]);
  const [statesLoading, setStatesLoading] = useState(true);
  const [statesError, setStatesError] = useState('');
  const [cities, setCities] = useState([]);
  const [citiesLoading, setCitiesLoading] = useState(false);
  const [citiesError, setCitiesError] = useState('');
  const [categories, setCategories] = useState([]);
  const [catLoading, setCatLoading] = useState(true);
  const [catError, setCatError] = useState('');
  const [professions, setProfessions] = useState([]);
  const [profLoading, setProfLoading] = useState(false);
  const [profError, setProfError] = useState('');
  const [selectedProfObj, setSelectedProfObj] = useState(null);

  /* pincode → state / city */
  const [pinStatus, setPinStatus] = useState({ state: 'idle', data: null });
  const pendingCityRef = useRef(null);

  /* selfie + docs */
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [docSlots, setDocSlots] = useState({});
  const [fileError, setFileError] = useState('');
  const docInputRefs = useRef({});
  const [selfieFile, setSelfieFile] = useState(null);
  const [selfiePreview, setSelfiePreview] = useState(null);
  const [selfieUrl, setSelfieUrl] = useState(null);
  const [selfieStatus, setSelfieStatus] = useState({ state: 'idle', msg: '', hint: '', liveness: '', fatal: false });
  const [cameraOpen, setCameraOpen] = useState(false);

  const [registering, setRegistering] = useState(false);
  const [registerError, setRegisterError] = useState('');
  const uploadedDocsRef = useRef(null);
  const [summary, setSummary] = useState(null);

  const cardRef = useRef(null);

  /* refs used to scroll to the first invalid field on submit */
  const fieldRefs = useRef({});
  const registerFieldRef = (id) => (el) => { if (el) fieldRefs.current[id] = el; };
  const focusField = (id) => {
    const el = fieldRefs.current[id];
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    const focusable = el.matches('input,select,textarea,button')
      ? el
      : el.querySelector('input,select,textarea,button,[tabindex]');
    setTimeout(() => { try { (focusable || el).focus({ preventScroll: true }); } catch { /* noop */ } }, 320);
  };

  const getRaw = () => form.mobile.replace(/\D/g, '');

  /* central error helper — clears one or more error keys */
  const clearErr = (...keys) => setErrors(er => {
    const n = { ...er };
    keys.forEach(k => { delete n[k]; });
    return n;
  });
  const markTouched = (k) => () => setTouched(t => ({ ...t, [k]: true }));

  /* resend ticker */
  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setTimeout(() => setResendIn(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendIn]);

  /* load states + categories on mount */
  useEffect(() => {
    setStatesLoading(true); setStatesError('');
    fetch(`${API_BASE}/api/v1/locations/master-state`).then(r => r.json())
      .then(res => { if (res.success && Array.isArray(res.data)) setStates(res.data); else setStatesError('Could not load states.'); })
      .catch(() => setStatesError('Network error loading states.'))
      .finally(() => setStatesLoading(false));

    setCatLoading(true); setCatError('');
    fetch(`${API_BASE}/api/v1/masters/categories`).then(r => r.json())
      .then(res => { if (res.success && Array.isArray(res.data)) setCategories(res.data); else setCatError('Could not load categories. Please refresh.'); })
      .catch(() => setCatError('Network error loading categories.'))
      .finally(() => setCatLoading(false));
  }, []);

  /* prefill + validate a referral code arriving from an invite link */
  useEffect(() => {
    const code = readReferralFromUrl();
    if (!code) return;
    setForm(f => ({ ...f, referralCode: code }));
    setReferralFromLink(true);
    // Pass the code explicitly — setForm hasn't flushed yet, so the closure
    // inside validateReferral would still see an empty referralCode.
    validateReferral(code);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* load cities on state change */
  useEffect(() => {
    if (!form.stateId) { setCities([]); return; }
    setCitiesLoading(true); setCitiesError(''); setCities([]);
    fetch(`${API_BASE}/api/v1/locations/master-cities?state_id=${form.stateId}`).then(r => r.json())
      .then(res => { if (res.success && Array.isArray(res.data)) setCities(res.data); else setCitiesError('Could not load cities.'); })
      .catch(() => setCitiesError('Network error loading cities.'))
      .finally(() => setCitiesLoading(false));
  }, [form.stateId]);

  /* load professions on category change */
  useEffect(() => {
    if (!form.categoryCode) { setProfessions([]); setSelectedProfObj(null); return; }
    setProfLoading(true); setProfError(''); setProfessions([]); setSelectedProfObj(null);
    setForm(f => ({ ...f, profession: '', professionCode: '', professionId: null }));
    fetch(`${API_BASE}/api/v1/masters/categories/${form.categoryCode}/professions`).then(r => r.json())
      .then(res => { if (res.success && Array.isArray(res.data)) setProfessions(res.data); else setProfError('Could not load professions for this category.'); })
      .catch(() => setProfError('Network error loading professions.'))
      .finally(() => setProfLoading(false));
  }, [form.categoryCode]);

  const set = k => e => { setForm(f => ({ ...f, [k]: e.target.value })); clearErr(k); };
  const setField = (k, v) => { setForm(f => ({ ...f, [k]: v })); clearErr(k); };

  /* ── DOB / age gate ── */
  const age = calcAge(form.dob);
  const ageOk = age !== null && age >= 18;
  const underage = age !== null && age < 18;
  const onDobChange = e => {
    const dob = e.target.value;
    setForm(f => ({ ...f, dob }));
    const a = calcAge(dob);
    setConsents(prev => ({ ...prev, age: a !== null && a >= 18 }));
    clearErr('dob', 'consent', 'age');
  };

  /* ── contact change resets OTP ── */
  const resetOtp = () => {
    setOtpSent(false); setPhoneVerified(false); setEmailVerified(false);
    setMobileOtp(Array(OTP_LENGTH).fill('')); setEmailOtp(Array(OTP_LENGTH).fill(''));
    setMobileOtpStatus({ msg: '', type: '' }); setEmailOtpStatus({ msg: '', type: '' });
    setResendIn(0);
  };
  const onMobileChange = e => {
    setForm(f => ({ ...f, mobile: e.target.value.replace(/\D/g, '').slice(0, mobileLenRange(f.cc)[1]) }));
    clearErr('phone');
    if (otpSent || phoneVerified || emailVerified) resetOtp();
  };
  const onEmailChange = e => {
    // Lowercase so You@GMAIL.com and you@gmail.com can't create two accounts.
    setForm(f => ({ ...f, email: e.target.value.trim().toLowerCase() }));
    clearErr('email');
    if (otpSent || phoneVerified || emailVerified) resetOtp();
  };

  /* ── live mobile / email validity ──────────────────────────────────────────
     `hard` problems (wrong leading digit, too long, two @) show as you type.
     Soft ones (still too short) wait for blur or a submit attempt so the field
     isn't red from the first keystroke.
     ---------------------------------------------------------------------- */
  const mobileRaw = getRaw();
  const mobileCheck = validateMobile(form.cc, mobileRaw);
  const mobileOk = mobileCheck.ok;
  const mobileHint = mobileCheck.hint;
  const mobileErrMsg = mobileCheck.msg || 'Enter a valid mobile number.';
  const showMobileErr = Boolean(errors.phone || (mobileRaw && !mobileOk && (mobileCheck.hard || touched.mobile || submitAttempted)));

  const emailCheck = validateEmail(form.email);
  const emailOk = emailCheck.ok;
  const emailErrMsg = emailCheck.msg;
  const emailWarn = emailCheck.warn || '';
  const showEmailErr = Boolean(errors.email || (form.email && !emailOk && (emailCheck.hard || touched.email || submitAttempted)));

  const userPatternOk = PATTERNS.username.test(form.username);

  /* ── referral code ── */
  const onReferralChange = e => {
    const v = e.target.value.replace(/[^A-Za-z0-9-]/g, '').slice(0, 30).toUpperCase();
    setForm(f => ({ ...f, referralCode: v }));
    clearErr('referral');
    setReferralFromLink(false);
    setReferralStatus({ state: 'idle', msg: '', data: null });
  };
  /* Returns { ok, msg }. Callers (link prefill · blur · submit) can pass the
     code explicitly, so they never depend on form state having flushed. An
     in-flight check is reused rather than duplicated. */
  const validateReferral = (codeArg) => {
    const code = String(codeArg ?? form.referralCode).trim();
    if (!code) { setReferralStatus({ state: 'idle', msg: '', data: null }); clearErr('referral'); return Promise.resolve({ ok: true, msg: '' }); }
    if (referralCheckRef.current?.code === code) return referralCheckRef.current.promise;
    if (!PATTERNS.referral.test(code)) {
      const msg = 'Codes are 4–30 letters, numbers or dashes.';
      setReferralStatus({ state: 'invalid', msg, data: null });
      setErrors(er => ({ ...er, referral: msg }));
      return Promise.resolve({ ok: false, msg });
    }
    setReferralStatus({ state: 'checking', msg: 'Checking code…', data: null });
    const promise = (async () => {
      try {
        const res = await apiCall(REFERRAL_VALIDATE(code), 'GET');
        const data = res?.data || res;
        const valid = res?.success !== false && (data?.valid !== false);
        if (!valid) {
          const msg = res?.message || 'This referral code is not valid.';
          setReferralStatus({ state: 'invalid', msg, data: null });
          setErrors(er => ({ ...er, referral: msg }));
          return { ok: false, msg };
        }
        const tier = data?.couponTier || data?.tier;
        const discount = data?.discountPercent ?? data?.discount;
        const msg = discount ? `Valid — ${discount}% off applied` : 'Referral code applied';
        setReferralStatus({ state: 'valid', msg, data: { code, tier, discount } });
        clearErr('referral');
        return { ok: true, msg };
      } catch (err) {
        console.error('[referral-validate]', err);
        const msg = err?.serverMessage || 'We couldn’t check that code. Please try again, or clear the field to continue.';
        setReferralStatus({ state: 'invalid', msg, data: null });
        setErrors(er => ({ ...er, referral: msg }));
        return { ok: false, msg };
      } finally {
        if (referralCheckRef.current?.code === code) referralCheckRef.current = null;
      }
    })();
    referralCheckRef.current = { code, promise };
    return promise;
  };
  const removeReferral = () => {
    setForm(f => ({ ...f, referralCode: '' }));
    setReferralFromLink(false);
    setReferralStatus({ state: 'idle', msg: '', data: null });
    clearErr('referral');
  };

  /* ── Send OTP ── */
  const sendOtp = async () => {
    const e = {};
    if (!form.fname.trim()) e.fname = 'First name is required';
    if (!form.lname.trim()) e.lname = 'Last name is required';
    if (!mobileOk) e.phone = mobileErrMsg;
    if (!emailOk) e.email = emailErrMsg || 'Enter a valid email address (e.g. you@example.com)';
    if (Object.keys(e).length) {
      setErrors(er => ({ ...er, ...e }));
      setTouched(t => ({ ...t, mobile: true, email: true }));
      const order = ['fname', 'lname', 'phone', 'email'];
      const first = order.find(k => e[k]);
      if (first) focusField(first === 'phone' ? 'mobile' : first);
      return;
    }
    setOtpSending(true);
    try {
      const res = await apiCall('/api/v1/auth/send-otp', 'POST', {
        mobile_number: getRaw(),
        mobile_country_code: form.cc,
        email: form.email,
        full_name: `${form.fname} ${form.lname}`.trim(),
      });
      setOtpSent(true);
      setMobileOtp(Array(OTP_LENGTH).fill('')); setEmailOtp(Array(OTP_LENGTH).fill(''));
      setResendIn(RESEND_SECONDS);
      if (res.data?.mobile_otp) console.log('[DEV] Mobile OTP:', res.data.mobile_otp, '| Email OTP:', res.data.email_otp);
      setTimeout(() => mobileRefs.current[0]?.focus(), 60);
    } catch (err) {
      // Raw server/network detail stays in the console; the user sees clean copy.
      console.error('[send-otp]', err);
      const known = (err?.serverMessage || '').toLowerCase();
      const msg = known.includes('already')
        ? 'An account already exists with this number or email. Try logging in instead.'
        : 'Could not send the code right now. Check your number and try again.';
      setErrors(er => ({ ...er, phone: msg }));
      focusField('mobile');
    } finally { setOtpSending(false); }
  };

  /* ── OTP digit handling ── */
  const otpDigit = (kind, i, val) => {
    const v = val.replace(/\D/g, '');
    const [, setArr, refs] = kind === 'mobile'
      ? [mobileOtp, setMobileOtp, mobileRefs] : [emailOtp, setEmailOtp, emailRefs];
    if (kind === 'mobile') setMobileOtpStatus({ msg: '', type: '' }); else setEmailOtpStatus({ msg: '', type: '' });
    setArr(prev => {
      const next = [...prev];
      if (v.length <= 1) next[i] = v;
      else v.slice(0, OTP_LENGTH - i).split('').forEach((ch, j) => { next[i + j] = ch; });
      return next;
    });
    if (v) refs.current[Math.min(i + v.length, OTP_LENGTH - 1)]?.focus();
  };
  const otpKey = (kind, i, e) => {
    const [arr, setArr, refs] = kind === 'mobile'
      ? [mobileOtp, setMobileOtp, mobileRefs] : [emailOtp, setEmailOtp, emailRefs];
    if (e.key === 'Backspace' && !arr[i] && i > 0) { refs.current[i - 1]?.focus(); setArr(p => { const n = [...p]; n[i - 1] = ''; return n; }); }
    if (e.key === 'ArrowLeft' && i > 0) refs.current[i - 1]?.focus();
    if (e.key === 'ArrowRight' && i < OTP_LENGTH - 1) refs.current[i + 1]?.focus();
  };

  const verifyMobile = async () => {
    const otp = mobileOtp.join('');
    if (otp.length !== OTP_LENGTH) return;
    setMobileOtpStatus({ msg: 'Verifying…', type: 'pending' });
    try {
      await apiCall('/api/v1/auth/verify-otp', 'POST', { mobile_number: getRaw(), mobile_country_code: form.cc, otp });
      setPhoneVerified(true);
      setMobileOtpStatus({ msg: 'MOBILE VERIFIED ✓', type: 'verified' });
      clearErr('verify');
      setTimeout(() => emailRefs.current[0]?.focus(), 80);
    } catch (err) {
      console.error('[verify-otp]', err);
      setMobileOtpStatus({ msg: friendlyOtpError(err?.serverMessage || err?.message), type: 'error' });
      setMobileShake(true); setTimeout(() => setMobileShake(false), 420);
    }
  };
  const verifyEmail = async () => {
    const otp = emailOtp.join('');
    if (otp.length !== OTP_LENGTH) return;
    setEmailOtpStatus({ msg: 'Verifying…', type: 'pending' });
    try {
      await apiCall('/api/v1/auth/verify-email-otp', 'POST', { email: form.email, otp });
      setEmailVerified(true);
      setEmailOtpStatus({ msg: 'EMAIL VERIFIED ✓', type: 'verified' });
      clearErr('verify');
    } catch (err) {
      console.error('[verify-email-otp]', err);
      setEmailOtpStatus({ msg: friendlyOtpError(err?.serverMessage || err?.message), type: 'error' });
      setEmailShake(true); setTimeout(() => setEmailShake(false), 420);
    }
  };

  /* ── username check ─────────────────────────────────────────────────────
     The old onBlur-only version raced Continue: blur fired the request on
     mousedown, then click ran validation while status was still null, so the
     first click did nothing. Now the check is debounced as you type, and
     Continue awaits the in-flight promise instead of racing it.
     -------------------------------------------------------------------- */
  const checkUsername = (nameArg) => {
    const username = String(nameArg ?? form.username).trim();
    if (!username) { setUsernameStatus(null); return Promise.resolve(null); }
    if (!PATTERNS.username.test(username)) {
      setUsernameStatus('invalid');
      setErrors(er => ({ ...er, username: 'Use 1–30 letters, numbers, dots or underscores.' }));
      return Promise.resolve('invalid');
    }
    if (usernameCheckRef.current?.username === username) return usernameCheckRef.current.promise;
    setUsernameStatus('checking');
    const promise = (async () => {
      try {
        const res = await apiCall(`/api/v1/auth/check-username?username=${encodeURIComponent(username)}`, 'GET');
        const available = res?.data?.available === true;
        setUsernameStatus(available ? 'available' : 'taken');
        if (available) clearErr('username');
        else setErrors(er => ({ ...er, username: `@${username} is already taken — please use another username.` }));
        return available ? 'available' : 'taken';
      } catch (err) {
        console.error('[check-username]', err);
        setUsernameStatus('error');
        return 'error';
      } finally {
        if (usernameCheckRef.current?.username === username) usernameCheckRef.current = null;
      }
    })();
    usernameCheckRef.current = { username, promise };
    return promise;
  };

  const ensureUsernameChecked = async () => {
    const name = form.username.trim();
    if (!name) return null;
    const inflight = usernameCheckRef.current;
    if (inflight && inflight.username === name) return inflight.promise;
    if (usernameStatus === 'available' || usernameStatus === 'taken') return usernameStatus;
    return checkUsername(name);
  };

  /* live availability as they type */
  useEffect(() => {
    const name = form.username.trim();
    if (!name) { setUsernameStatus(null); return; }
    if (!PATTERNS.username.test(name)) { setUsernameStatus('invalid'); return; }
    const t = setTimeout(() => checkUsername(name), 450);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.username]);

  /* ── pincode → state / district ───────────────────────────────────────── */
  useEffect(() => {
    const pin = form.pincode.trim();
    if (!pin) { setPinStatus({ state: 'idle', data: null }); return; }
    if (!PIN_PATTERN.test(pin)) {
      setPinStatus({ state: pin.length < 6 ? 'typing' : 'invalid', data: null });
      return;
    }
    let cancelled = false;
    setPinStatus({ state: 'checking', data: null });
    const t = setTimeout(async () => {
      const res = await lookupPincode(pin);
      if (cancelled) return;
      setPinStatus(res ? { state: 'found', data: res } : { state: 'unknown', data: null });
    }, 350);
    return () => { cancelled = true; clearTimeout(t); };
  }, [form.pincode]);

  /* cities load asynchronously after a state is set — match the queued
     district once they arrive */
  useEffect(() => {
    if (!pendingCityRef.current || !cities.length) return;
    const want = normName(pendingCityRef.current);
    const c = cities.find(x => normName(x.city_name) === want)
      || cities.find(x => normName(x.city_name).includes(want) || want.includes(normName(x.city_name)));
    if (c) { setForm(f => ({ ...f, cityId: c.id, city: c.city_name })); clearErr('city'); }
    pendingCityRef.current = null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cities]);

  const applyPinLocation = () => {
    const d = pinStatus.data;
    if (!d) return;
    const st = states.find(s => normName(s.state_name) === normName(d.state));
    if (!st) return;
    setForm(f => ({ ...f, stateId: st.id, state: st.state_name, stateCode: st.state_code, cityId: null, city: '' }));
    pendingCityRef.current = d.district;
    clearErr('state', 'city');
  };

  const pinMismatch = pinStatus.state === 'found' && Boolean(form.state)
    && normName(pinStatus.data.state) !== normName(form.state);

  /* ── state / city / profession selection ── */
  const onStateChange = (stateId) => {
    const s = states.find(x => x.id === parseInt(stateId)) || null;
    setForm(f => ({ ...f, stateId: s ? s.id : null, state: s ? s.state_name : '', stateCode: s ? s.state_code : '', cityId: null, city: '' }));
    pendingCityRef.current = null;
    clearErr('state');
  };
  const onCityChange = (cityId) => {
    const c = cities.find(x => x.id === parseInt(cityId)) || null;
    setForm(f => ({ ...f, cityId: c ? c.id : null, city: c ? c.city_name : '' }));
    clearErr('city');
  };
  const onProfessionChange = (code) => {
    const p = professions.find(x => x.profession_code === code) || null;
    setSelectedProfObj(p);
    setForm(f => ({ ...f, professionCode: code, profession: p ? p.profession_name : '', professionId: p ? p.profession_id : null }));
    clearErr('profession');
  };

  /* ── LIVE selfie handling (unchanged) ── */
  const handleLiveCaptured = async ({ selfieFile: file, previewUrl, blinkFrames }) => {
    try {
      setCameraOpen(false);
      setSelfieFile(file); setSelfiePreview(previewUrl); setSelfieUrl(null);
      setSelfieStatus({ state: 'checking', msg: '', hint: '', liveness: '', fatal: false });
      clearErr('selfie');

      const liveForm = new FormData();
      liveForm.append('selfie', file, 'fameoselfie.jpg');
      blinkFrames.forEach((frame) => {
        if (typeof frame === 'string' && frame.startsWith('data:image')) {
          liveForm.append('blink_frames', frame);
        }
      });
      console.log(`[fameoselfie] sending selfie + ${blinkFrames.length} blink_frames (string data URLs)`);

      let liveRes;
      try {
        liveRes = await fetch(`${API_BASE}${LIVE_SELFIE_ENDPOINT}`, { method: 'POST', body: liveForm });
      } catch (netErr) {
        throw new Error(`Could not reach the verification service (${netErr?.message || 'network error'}).`);
      }
      const liveRaw = await liveRes.text();
      let liveData = {};
      try { liveData = liveRaw ? JSON.parse(liveRaw) : {}; } catch { liveData = {}; }
      console.log(`[fameoselfie] ${liveRes.status}`, liveRaw.slice(0, 500));

      if (!liveRes.ok) {
        console.error(`[fameoselfie] ${liveRes.status}`, liveRaw.slice(0, 300));
        const serverMsg = liveData?.message
          || (liveRes.status === 413 ? 'Verification images were too large for the server.'
            : liveRes.status === 404 ? 'Verification endpoint not found.'
            : liveRes.status === 401 || liveRes.status === 403 ? 'Verification service rejected the request.'
            : 'Verification service error.');
        setSelfieStatus({ state: 'error', msg: serverMsg, hint: livenessHint(serverMsg), liveness: '', fatal: isFatalLiveness(serverMsg) });
        return;
      }

      const verified = liveData?.success === true && liveData?.data?.verified === true;
      if (!verified) {
        const msg = liveData?.message || 'Live selfie verification failed. Please try again.';
        setSelfieStatus({ state: 'error', msg, hint: livenessHint(msg), liveness: '', fatal: isFatalLiveness(msg) });
        return;
      }
      const livenessNote = liveData?.data?.liveness || 'Blink and natural movement detected';

      setSelfieStatus({ state: 'uploading', msg: '', hint: '', liveness: livenessNote, fatal: false });
      const uploadForm = new FormData();
      uploadForm.append('selfie', file);
      uploadForm.append('mobile_number', getRaw());
      const upRes = await apiCall('/api/v1/auth/upload-selfie', 'POST', uploadForm, true);
      if (!upRes?.success) throw new Error(upRes?.message || 'Selfie upload failed');
      const uploadedUrl = upRes?.data?.selfie_url || upRes?.data?.url || null;
      if (!uploadedUrl) throw new Error('Selfie URL not returned');

      setSelfieUrl(uploadedUrl);
      setSelfieStatus({ state: 'done', msg: '', hint: '', liveness: livenessNote, fatal: false });
      clearErr('selfie');
    } catch (err) {
      const msg = err?.message || 'Something went wrong';
      setSelfieStatus({ state: 'error', msg, hint: livenessHint(msg), liveness: '', fatal: isFatalLiveness(msg) });
    }
  };

  const retakeSelfie = () => {
    setSelfieFile(null); setSelfiePreview(null); setSelfieUrl(null);
    setSelfieStatus({ state: 'idle', msg: '', hint: '', liveness: '', fatal: false });
    setCameraOpen(true);
  };

  /* ── documents ──────────────────────────────────────────────────────────
     The copy promised "up to 5 files · 10MB each" but nothing enforced it,
     so oversized uploads only failed at submit time as an opaque 413.
     -------------------------------------------------------------------- */
  const requiredDocs = selectedProfObj?.required_documents || [];

  const rejectFile = (file) => {
    if (!ACCEPTED_DOC_EXT.test(file.name)) return `${file.name} isn’t a supported type. Use PDF, DOC, JPG, PNG or WEBP.`;
    if (file.size > MAX_FILE_BYTES) return `${file.name} is ${fmtSize(file.size)} — each file must be under 10MB.`;
    return '';
  };

  const handleSlotFile = (docType, file) => {
    if (!file) return;
    const bad = rejectFile(file);
    if (bad) { setFileError(bad); return; }
    setFileError('');
    const entry = { id: Math.random().toString(36).slice(2), file, name: file.name, size: fmtSize(file.size), tag: docType, url: null };
    setDocSlots(prev => ({ ...prev, [docType]: entry }));
    setUploadedFiles(prev => [...prev.filter(f => f.tag !== docType), entry]);
    clearErr('docs');
  };
  const removeSlot = (docType) => {
    setDocSlots(prev => { const n = { ...prev }; delete n[docType]; return n; });
    setUploadedFiles(prev => prev.filter(f => f.tag !== docType));
  };
  const addGenericFiles = (fileList) => {
    const incoming = Array.from(fileList || []);
    if (!incoming.length) return;
    const room = MAX_GENERIC_FILES - uploadedFiles.length;
    if (room <= 0) { setFileError(`You can upload up to ${MAX_GENERIC_FILES} files.`); return; }

    const problems = [];
    const accepted = [];
    incoming.forEach(f => {
      const bad = rejectFile(f);
      if (bad) { problems.push(bad); return; }
      if (accepted.length < room) accepted.push(f);
      else problems.push(`${f.name} wasn’t added — the limit is ${MAX_GENERIC_FILES} files.`);
    });

    setFileError(problems[0] || '');
    if (!accepted.length) return;
    setUploadedFiles(prev => [...prev, ...accepted.map(f => ({
      id: Math.random().toString(36).slice(2), file: f, name: f.name, size: fmtSize(f.size), tag: 'credential', url: null,
    }))]);
  };
  const removeGeneric = (id) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
    setFileError('');
  };

  /* ── register ── */
  const handleRegister = async () => {
    setRegistering(true);
    setRegisterError('');
    try {
      // A failed register used to re-run upload-documents on every retry,
      // leaving an orphaned copy of every file on the server per attempt.
      // Reuse the URLs while the file set is unchanged.
      let uploadedDocs = [];
      const fileSetKey = uploadedFiles.map(f => `${f.tag}:${f.name}:${f.file.size}`).join('|');
      if (uploadedDocsRef.current?.key === fileSetKey) {
        uploadedDocs = uploadedDocsRef.current.docs;
      } else if (uploadedFiles.length > 0) {
        const fd = new FormData();
        // Files first, then the tag list, so index N of `tags` lines up with
        // index N of `documents` server-side.
        uploadedFiles.forEach(f => fd.append('documents', f.file, f.name));
        uploadedFiles.forEach(f => fd.append('tags', f.tag || 'credential'));
        fd.append('tags_json', JSON.stringify(uploadedFiles.map(f => f.tag || 'credential')));
        fd.append('mobile_number', getRaw());

        const docRes = await apiCall('/api/v1/auth/upload-documents', 'POST', fd, true);
        const docPayload = Array.isArray(docRes?.data) ? docRes.data[0] : docRes?.data;
        const docArray = docPayload?.documents || docRes?.documents || [];
        uploadedDocs = Array.isArray(docArray) ? docArray.map(d => ({
          tag: d.tag || 'credential',
          url: d.url || d.document_url || d.file_url,
          filename: d.filename || d.original_name || '',
          type: d.type || d.mime_type || 'application/octet-stream',
        })).filter(d => d.url) : [];

        if (!uploadedDocs.length) {
          console.error('[upload-documents] 200 OK but no usable document URLs:', docRes);
          throw new Error('Documents uploaded but the server returned no file URLs. Please retry.');
        }
        uploadedDocsRef.current = { key: fileSetKey, docs: uploadedDocs };
      }

      // instagram_username used to receive the full URL — send the handle.
      // Do NOT add an instagram_url key: /auth/register runs Joi with
      // unknown(false), so any field not in its schema comes back as a 422
      // "excess property and therefore is not allowed". The full URL has
      // nowhere to go until backend adds it.
      const igMatch = PATTERNS.instagramUrl.exec(cleanUrl(form.instagram));
      const igHandle = igMatch ? igMatch[2] : undefined;
      const pressList = form.pressUrls.split('\n').map(s => s.trim()).filter(Boolean);

      const payload = {
        username: form.username,
        full_name: `${form.fname} ${form.lname}`.trim(),
        mobile_number: getRaw(),
        mobile_country_code: form.cc,
        email: form.email,
        date_of_birth: form.dob || undefined,
        gender: form.gender || undefined,
        city: form.city,
        state: form.state || undefined,
        pincode: form.pincode || undefined,
        primary_platform: form.primaryPlatform,
        instagram_username: igHandle,
        youtube_channel_link: form.youtube || undefined,
        primary_content_category: form.categoryCode,
        category_id: form.categoryId || undefined,
        sub_category_id: form.professionId || undefined,
        selfie_image: selfieUrl || undefined,
        documents: uploadedDocs.length ? uploadedDocs : undefined,
        // pressUrls was collected on step 05 and then silently dropped.
        press_urls: pressList.length ? pressList : undefined,
        referral_id: (referralStatus.state === 'valid' && form.referralCode) ? form.referralCode : undefined,
        age_consent_18_plus: true,
        terms_conditions_accepted: true,
      };
      const regRes = await apiCall('/api/v1/auth/register', 'POST', payload);

      // Guide §3 concurrency rule: validate checks availability but does NOT
      // reserve the coupon — the claim happens here. A 200 alone does not mean
      // the code was applied, so referral_applied is the only confirmation.
      const regData = Array.isArray(regRes?.data) ? regRes.data[0] : regRes?.data;
      const sentReferral = payload.referral_id || null;
      const referralApplied = regData?.referral_applied === true;
      if (sentReferral && !referralApplied) {
        setReferralStatus({
          state: 'invalid',
          msg: 'Referral code could not be applied — it may have been claimed by someone else.',
          data: null,
        });
      }

      // Prefer the server's application id. The old client-generated
      // 'FAM-<timestamp>' was shown to the user but existed nowhere in the
      // backend, so support could never look it up.
      const serverAppId = regData?.application_id || regData?.applicationId
        || regData?.application_number || regData?.id || regData?.user_id || null;
      if (!serverAppId) console.warn('[register] no application id in response — showing a local reference instead', regData);

      const s = {
        name: payload.full_name, username: form.username, category: form.category,
        profession: form.profession, platform: form.primaryPlatform,
        referral: referralApplied ? sentReferral : null,
        referralMissed: Boolean(sentReferral && !referralApplied),
        appId: serverAppId ? String(serverAppId) : 'FAM-' + Date.now().toString(36).toUpperCase(),
        appIdIsLocal: !serverAppId,
        date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
      };
      setSummary(s);
      onComplete?.(s);
      go(5);
    } catch (err) {
      console.error('[register]', err);
      setRegisterError(friendlyRegisterError(err));
      cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    } finally { setRegistering(false); }
  };

  /* ── validity per step ── */
  const ytOk = !(form.primaryPlatform === 'YouTube' || form.primaryPlatform === 'Both') || PATTERNS.youtube.test(cleanUrl(form.youtube));
  const igOk = !(form.primaryPlatform === 'Instagram' || form.primaryPlatform === 'Both') || PATTERNS.instagramUrl.test(cleanUrl(form.instagram));
  const referralOk = !form.referralCode.trim() || referralStatus.state === 'valid';

  const stepValid = [
    Boolean(form.fname.trim() && form.lname.trim() && form.dob && ageOk && mobileOk && emailOk && phoneVerified && emailVerified && consents.age && consents.terms && referralOk),
    Boolean(form.username && userPatternOk && usernameStatus === 'available' && form.gender && form.stateId && form.city && PIN_PATTERN.test(form.pincode.trim())),
    Boolean(form.primaryPlatform && ytOk && igOk),
    Boolean(form.categoryCode && form.profession),
    Boolean(selfieFile && selfieStatus.state === 'done'),
  ][step];

  const busy = registering || selfieStatus.state === 'checking' || selfieStatus.state === 'uploading' || otpSending || referralStatus.state === 'checking';

  /* ── validate the current step, collect errors + first invalid field id ── */
  const validateStep = async (s) => {
    const e = {};
    const order = [];
    const add = (id, cond, msg, scrollId) => {
      order.push(scrollId || id);
      if (cond) e[id] = msg;
    };

    if (s === 0) {
      add('fname', !form.fname.trim(), 'First name is required');
      add('lname', !form.lname.trim(), 'Last name is required');
      if (!form.dob) { e.dob = 'Date of birth is required'; order.push('dob'); }
      else if (!isRealDate(form.dob)) { e.dob = 'That date doesn’t exist — please pick a valid date.'; order.push('dob'); }
      else if (!ageOk) { e.dob = `You must be 18 or older (you're ${age}).`; order.push('dob'); }
      add('phone', !mobileOk, mobileErrMsg, 'mobile');
      add('email', !emailOk, emailErrMsg || 'Enter a valid email address', 'email');
      if (form.referralCode.trim() && referralStatus.state !== 'valid') {
        const r = await validateReferral();
        if (!r.ok) { e.referral = r.msg || 'Enter a valid referral code, or clear the field.'; order.push('referral'); }
      }
      if (!phoneVerified || !emailVerified) { e.verify = 'Please verify both mobile and email.'; order.push(otpSent ? 'otp-panel' : 'otp-send'); }
      if (!consents.age) { e.age = 'Please confirm you are 18 or older.'; order.push('age'); }
      if (!consents.terms) { e.terms = 'Please accept the Terms, Privacy and Cookie policies.'; order.push('terms'); }
    }
    if (s === 1) {
      const uname = form.username.trim();
      if (!uname) { e.username = 'Username is required'; order.push('username'); }
      else if (!PATTERNS.username.test(uname)) { e.username = 'Use 1–30 letters, numbers, dots or underscores.'; order.push('username'); }
      else {
        // Await the check already in flight rather than racing it — this is
        // what made the first Continue click a no-op.
        const st = await ensureUsernameChecked();
        if (st === 'taken') { e.username = `@${uname} is already taken — please use another username.`; order.push('username'); }
        else if (st !== 'available') { e.username = 'We couldn’t confirm this username. Please try again.'; order.push('username'); }
      }
      add('gender', !form.gender, 'Please select your gender');
      const pin = form.pincode.trim();
      if (!pin) { e.pincode = 'PIN code is required'; order.push('pincode'); }
      else if (!PIN_PATTERN.test(pin)) { e.pincode = 'Enter a valid 6-digit PIN code (it can’t start with 0).'; order.push('pincode'); }
      add('state', !form.stateId, 'Please select your state');
      add('city', !form.city, 'Please select your city');
    }
    if (s === 2) {
      add('platform', !form.primaryPlatform, 'Please select your primary platform');
      if ((form.primaryPlatform === 'YouTube' || form.primaryPlatform === 'Both') && !ytOk) { e.youtube = 'Enter a valid YouTube channel URL'; order.push('youtube'); }
      if ((form.primaryPlatform === 'Instagram' || form.primaryPlatform === 'Both') && !igOk) { e.instagram = 'Enter a valid Instagram profile URL'; order.push('instagram'); }
    }
    if (s === 3) {
      add('category', !form.categoryCode, 'Please choose a category');
      add('profession', form.categoryCode && !form.profession, 'Please select your profession');
    }
    if (s === 4) {
      add('selfie', !(selfieFile && selfieStatus.state === 'done'), 'Please complete the live selfie check');
      // Documents are optional — QC1 can request anything missing during review.
    }

    const firstInvalid = order.find(id => {
      const key = id === 'mobile' ? 'phone' : (id === 'otp-panel' || id === 'otp-send') ? 'verify' : id;
      return e[key];
    });
    return { errors: e, firstInvalid };
  };

  const go = (n) => {
    setDir(n > step ? 'fwd' : 'bwd');
    setStep(n);
    setSubmitAttempted(false);
    setRegisterError('');
    cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const next = async () => {
    if (step === 5 || busy) return;
    setSubmitAttempted(true);
    setRegisterError('');

    const { errors: e, firstInvalid } = await validateStep(step);
    if (Object.keys(e).length > 0) {
      // Replace this step's errors instead of merging, so stale keys (e.g. a
      // "DOB required" from an earlier attempt) don't survive once fixed.
      setErrors(e);
      if (firstInvalid) focusField(firstInvalid);
      return;
    }
    if (step === 4) { handleRegister(); return; }
    go(step + 1);
  };

  const toggleConsent = key => { setConsents(p => ({ ...p, [key]: !p[key] })); clearErr(key === 'age' ? 'age' : 'terms'); };

  const meta = STEPS[step] || STEPS[STEPS.length - 1];
  const footLabels = ['COMPLETE IDENTITY & VERIFY', 'BUILD YOUR PROFILE', 'LINK YOUR SOCIALS', 'CHOOSE YOUR CATEGORY', 'FINAL PROOF & SUBMIT'];
  const mobileComplete = mobileOtp.every(d => d !== '');
  const emailComplete = emailOtp.every(d => d !== '');

  const success = step === 5;

  return (
    <div className="frg">
      <style>{CSS}</style>

      <svg className="frg-orbit l" viewBox="0 0 360 360" aria-hidden="true"><circle cx="180" cy="180" r="170" /><circle cx="180" cy="180" r="150" /></svg>
      <svg className="frg-orbit r" viewBox="0 0 360 360" aria-hidden="true"><circle cx="180" cy="180" r="170" /><circle cx="180" cy="180" r="150" /></svg>

      {cameraOpen && <LiveSelfieCapture onCaptured={handleLiveCaptured} onClose={() => setCameraOpen(false)} />}
      {activePolicy && <PolicyModal policy={activePolicy} onClose={() => setActivePolicy(null)} />}

      {/* ── card ── */}
      <div className="frg-card" ref={cardRef}>

        {/* brand header */}
        <div className="frg-brand">
          <a className="frg-brand-mark" href="/" aria-label="Fameo home">
            {brandLogo ? (
              <img src={typeof brandLogo === 'string' ? brandLogo : brandLogo.src} alt="Fameo" />
            ) : (
              <span className="frg-brand-word">Fame<span className="dot" /></span>
            )}
            <span className="frg-brand-rule" aria-hidden="true" />
            <span className="frg-brand-sub">Creator Network</span>
          </a>
          <a className="frg-brand-back" href="/login">ALREADY A MEMBER? LOG IN →</a>
        </div>

        {success ? (
          /* ════ SUCCESS ════ */
          <div className="frg-success">
            <div className="frg-suc-ico"><GreenTick /></div>
            <div className="frg-kicker" style={{ textAlign: 'center' }}>APPLICATION RECEIVED</div>
            <h1 className="frg-h1" style={{ textAlign: 'center' }}>Application <em>submitted</em></h1>
            <p className="frg-sub" style={{ margin: '0 auto', textAlign: 'center' }}>
              Your application is now in the QC1 review queue. You&apos;ll receive an email once a decision is made.
            </p>
            {summary?.referralMissed && (
              <div className="frg-note amber" style={{ textAlign: 'left', maxWidth: 400, margin: '20px auto 0' }}>
                <b>Your referral code wasn&apos;t applied.</b> Your application went through
                normally, but the code had already been claimed. Ask your friend for another one.
              </div>
            )}
            <div className="frg-suc-tbl">
              {[
                ['NAME', summary?.name],
                ['USERNAME', summary ? '@' + summary.username : ''],
                ['CATEGORY', summary?.category],
                ['PROFESSION', summary?.profession],
                ['PLATFORM', summary?.platform],
                ...(summary?.referral ? [['REFERRAL', summary.referral]] : []),
                [summary?.appIdIsLocal ? 'REFERENCE' : 'APPLICATION ID', summary?.appId],
                ['SUBMITTED', summary?.date],
                ['STATUS', 'Under review'],
              ].map(([k, v]) => (
                <div className="frg-suc-row" key={k}>
                  <span className="frg-suc-k">{k}</span>
                  <span className="frg-suc-v" style={k === 'STATUS' ? { color: 'var(--amber)' } : undefined}>{v || '—'}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* step panel */}
            <div key={step} className={`frg-panel ${dir}`}>
              <div className="frg-kicker">{meta.kicker}</div>
              <h1 className="frg-h1">{meta.lead} <em>{meta.accent}</em></h1>
              <p className="frg-sub">{meta.sub}</p>

              {/* ════ STEP 01 — IDENTITY ════ */}
              {step === 0 && (
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
              )}

              {/* ════ STEP 02 — PROFILE ════ */}
              {step === 1 && (
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

                  {/* ── LOCATION ────────────────────────────────────────────
                      A district maps to many PIN codes, so a PIN can never be
                      derived from state + city. The reverse works, and runs as
                      a progressive enhancement: if the lookup endpoint exists,
                      typing a PIN offers to fill state and city and warns on a
                      mismatch. If it doesn't, these three fields stay manual
                      and nothing here breaks. ----------------------------- */}
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
              )}

              {/* ════ STEP 03 — SOCIALS ════ */}
              {step === 2 && (
                <>
                  <div className="frg-note soft">Followers are never combined. The higher single-platform count is used.</div>
                  <div className="frg-rule">PRIMARY PLATFORM</div>
                  <div className="frg-field" ref={registerFieldRef('platform')}>
                    <label className="frg-label" htmlFor="frg-plat">Primary platform <span className="req">*</span></label>
                    <div className={`frg-uline${errors.platform ? ' err' : ''}`}><div className="frg-selwrap">
                      <select id="frg-plat" className="frg-select2" value={form.primaryPlatform} onChange={e => { setForm(f => ({ ...f, primaryPlatform: e.target.value })); clearErr('platform', 'youtube', 'instagram'); }}>
                        <option value="">Select platform</option>
                        <option value="YouTube">YouTube</option>
                        <option value="Instagram">Instagram</option>
                        <option value="Both">Both</option>
                      </select>
                    </div></div>
                    {errors.platform && <div className="frg-help err">{errors.platform}</div>}
                  </div>

                  {(form.primaryPlatform === 'YouTube' || form.primaryPlatform === 'Both') && (
                    <div className="frg-field" ref={registerFieldRef('youtube')}>
                      <label className="frg-label" htmlFor="frg-yt">YouTube channel URL <span className="req">*</span></label>
                      <div className={`frg-uline${(form.youtube && !ytOk) || errors.youtube ? ' err' : form.youtube && ytOk ? ' ok' : ''}`}>
                        <input id="frg-yt" className="frg-input" type="url" placeholder="https://youtube.com/@yourchannel"
                          value={form.youtube} onChange={e => setField('youtube', cleanUrl(e.target.value))} />
                      </div>
                      <div className={`frg-help${(form.youtube && !ytOk) || errors.youtube ? ' err' : form.youtube && ytOk ? ' ok' : ''}`}>
                        {(form.youtube && !ytOk) || errors.youtube
                          ? 'That link doesn’t look like a channel. Use youtube.com/@handle, /channel/ID, /c/name or /user/name'
                          : form.youtube && ytOk ? 'Looks good'
                          : 'Accepted: youtube.com/@handle · /channel/ID · /c/name · /user/name'}
                      </div>
                    </div>
                  )}

                  {(form.primaryPlatform === 'Instagram' || form.primaryPlatform === 'Both') && (
                    <div className="frg-field" ref={registerFieldRef('instagram')}>
                      <label className="frg-label" htmlFor="frg-ig">Instagram profile URL <span className="req">*</span></label>
                      <div className={`frg-uline${(form.instagram && !igOk) || errors.instagram ? ' err' : form.instagram && igOk ? ' ok' : ''}`}>
                        <input id="frg-ig" className="frg-input" type="url" placeholder="https://instagram.com/yourhandle"
                          value={form.instagram} onChange={e => setField('instagram', cleanUrl(e.target.value))} />
                      </div>
                      <div className={`frg-help${(form.instagram && !igOk) || errors.instagram ? ' err' : form.instagram && igOk ? ' ok' : ''}`}>
                        {(form.instagram && !igOk) || errors.instagram
                          ? 'That link doesn’t look like a profile. Use https://instagram.com/yourhandle'
                          : form.instagram && igOk ? 'Looks good'
                          : 'Full URL — e.g. https://instagram.com/yourhandle (tracking links are fine)'}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* ════ STEP 04 — CATEGORY ════ */}
              {step === 3 && (
                <>
                  <div className="frg-rule">PRIMARY CATEGORY</div>
                  {catError && <div className="frg-note red">{catError}</div>}
                  <div className={`frg-catgrid${errors.category ? ' err' : ''}`} ref={registerFieldRef('category')} role="radiogroup" aria-label="Primary category">
                    {catLoading
                      ? Array.from({ length: 8 }).map((_, i) => (
                        <div className="frg-cat-skel" key={i}><div className="frg-cat-skel-ico" /><div className="frg-cat-skel-lbl" /></div>
                      ))
                      : categories.map(cat => {
                        const on = form.categoryCode === cat.category_code;
                        const pick = () => { setForm(f => ({ ...f, categoryCode: cat.category_code, category: cat.category_name, categoryId: cat.category_id })); clearErr('category'); };
                        return (
                          <div key={cat.category_code}
                            className={`frg-cat${on ? ' on' : ''}`}
                            onClick={pick}
                            role="radio" aria-checked={on} tabIndex={0}
                            onKeyDown={e => (e.key === ' ' || e.key === 'Enter') && (e.preventDefault(), pick())}
                            title={cat.description || cat.category_name}>
                            <div className="frg-cat-ico">{pickCategoryIcon(cat)}</div>
                            <div className="frg-cat-lbl">{cat.category_name}</div>
                          </div>
                        );
                      })}
                  </div>
                  {errors.category && <div className="frg-help err" style={{ marginTop: 10 }}>{errors.category}</div>}

                  {form.categoryCode && (
                    <>
                      <div className="frg-rule">PROFESSION</div>
                      {profError && <div className="frg-note red">{profError}</div>}
                      <div className="frg-field" ref={registerFieldRef('profession')}>
                        <label className="frg-label" htmlFor="frg-prof">Select your profession <span className="req">*</span></label>
                        <div className={`frg-uline${errors.profession ? ' err' : ''}`}><div className="frg-selwrap">
                          <select id="frg-prof" className="frg-select2" value={form.professionCode || ''}
                            onChange={e => onProfessionChange(e.target.value)} disabled={profLoading || professions.length === 0}>
                            <option value="">{profLoading ? 'Loading professions…' : professions.length === 0 ? 'No professions found' : 'Select your profession'}</option>
                            {professions.map(p => <option key={p.profession_code} value={p.profession_code}>{p.profession_name}</option>)}
                          </select>
                        </div></div>
                        {errors.profession && <div className="frg-help err">{errors.profession}</div>}
                      </div>
                    </>
                  )}
                </>
              )}

              {/* ════ STEP 05 — PROOF ════ */}
              {step === 4 && (
                <>
                  <div className="frg-rule">LIVE SELFIE</div>
                  {!selfieFile ? (
                    <div className={`frg-livecard${errors.selfie ? ' err' : ''}`} ref={registerFieldRef('selfie')}>
                      <div className="frg-livecard-hdr">
                        <span className="frg-livecard-ico"><EyeGlyph size={24} stroke="#fff" /></span>
                        <div>
                          <div className="frg-livecard-ttl">Live blink verification</div>
                          <div className="frg-livecard-sub">About 10 seconds · guided on screen</div>
                        </div>
                      </div>
                      <div className="frg-livecard-body">
                        <div className="frg-livesteps">
                          <div className="frg-livestep">
                            <span className="frg-livestep-n">1</span>
                            <span className="frg-livestep-txt">Look straight at the camera and keep your eyes <b>open</b> for three seconds.</span>
                          </div>
                          <div className="frg-livestep">
                            <span className="frg-livestep-n">2</span>
                            <span className="frg-livestep-txt">Wait for the <b>3 · 2 · 1</b> countdown to reach zero.</span>
                          </div>
                          <div className="frg-livestep">
                            <span className="frg-livestep-n">3</span>
                            <span className="frg-livestep-txt"><b>Blink slowly 2–3 times</b> with a small, natural head movement.</span>
                          </div>
                        </div>
                        <div className="frg-livereq">
                          <span>One face only</span>
                          <span>Good lighting</span>
                          <span>No sunglasses</span>
                          <span>Live camera only</span>
                        </div>
                        <button className="frg-livestart" onClick={() => setCameraOpen(true)}>
                          START LIVE CHECK <span>→</span>
                        </button>
                        {errors.selfie && <div className="frg-help err" style={{ marginTop: 10 }}>⚠ {errors.selfie}</div>}
                      </div>
                    </div>
                  ) : (
                    <div className={`frg-selfie${selfieStatus.state === 'done' ? ' done' : ''}${selfieStatus.state === 'error' ? ' error' : ''}`} ref={registerFieldRef('selfie')}>
                      <img src={selfiePreview} alt="Live selfie preview" className="frg-selfie-img" />
                      <div className="frg-selfie-info">
                        <div className="frg-selfie-name">{selfieFile.name}</div>

                        {selfieStatus.state === 'checking' && (
                          <div className="frg-selfie-row analyzing"><span className="frg-spin" style={{ width: 12, height: 12 }} /> Checking liveness…</div>
                        )}
                        {selfieStatus.state === 'uploading' && (
                          <div className="frg-selfie-row uploading"><span className="frg-spin" style={{ width: 12, height: 12 }} /> Uploading verified selfie…</div>
                        )}
                        {selfieStatus.state === 'done' && (
                          <>
                            <div className="frg-selfie-row done">✓ Live face verified &amp; uploaded</div>
                            {selfieStatus.liveness && <span className="frg-selfie-live"><span>👁</span> LIVENESS CONFIRMED</span>}
                          </>
                        )}
                        {selfieStatus.state === 'error' && (
                          <>
                            <div className="frg-selfie-row error">{selfieStatus.msg}</div>
                            {selfieStatus.hint && <div className="frg-help err" style={{ marginTop: 4 }}>{selfieStatus.hint}</div>}
                          </>
                        )}

                        {(selfieStatus.state === 'done' || (selfieStatus.state === 'error' && !selfieStatus.fatal)) && (
                          <button className="frg-otp" style={{ marginTop: 10, padding: '9px 20px', fontSize: 10 }} onClick={retakeSelfie}>
                            {selfieStatus.state === 'done' ? 'RETAKE' : 'TRY AGAIN'}
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="frg-rule">SUPPORTING DOCUMENTS — OPTIONAL</div>
                  {fileError && <div className="frg-note red">{fileError}</div>}
                  {requiredDocs.length > 0 ? (
                    <>
                      <div className="frg-note soft">
                        Upload what you have — these help QC1 review your application faster.
                        You can submit without them and add them later if asked.
                      </div>
                      <div className="frg-docs" ref={registerFieldRef('docs')}>
                        {requiredDocs.map(docType => {
                          const slot = docSlots[docType];
                          return (
                            <div key={docType} className="frg-doc-slot">
                              <div className="frg-doc-hdr">
                                <span className="frg-doc-lbl">{formatDocLabel(docType)}</span>
                                {slot && <button className="frg-doc-rm" onClick={() => removeSlot(docType)} title="Remove">×</button>}
                              </div>
                              {slot ? (
                                <div className="frg-doc-file">
                                  <div className="frg-doc-fico">
                                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                      <rect x="1" y="1" width="12" height="12" rx="3" stroke="#DD8164" strokeWidth="1.2" />
                                      <path d="M4 6h6M4 8.5h4" stroke="#DD8164" strokeWidth="1.1" strokeLinecap="round" />
                                    </svg>
                                  </div>
                                  <div style={{ flex: 1, minWidth: 0 }}>
                                    <div className="frg-doc-fname">{slot.name}</div>
                                    <div className="frg-doc-fsize">{slot.size}</div>
                                  </div>
                                  <div style={{ color: 'var(--green)', fontSize: 13, fontWeight: 600 }}>✓</div>
                                </div>
                              ) : (
                                <div className="frg-doc-up" onClick={() => docInputRefs.current[docType]?.click()}
                                  role="button" tabIndex={0}
                                  onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), docInputRefs.current[docType]?.click())}>
                                  <input ref={el => { docInputRefs.current[docType] = el; }} type="file"
                                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp" style={{ display: 'none' }}
                                    onChange={e => { if (e.target.files[0]) handleSlotFile(docType, e.target.files[0]); e.target.value = ''; }} />
                                  <svg width="16" height="16" viewBox="0 0 18 18" fill="none" style={{ flex: 'none' }}>
                                    <path d="M9 12V4M9 4L6 7M9 4L12 7" stroke="#C96A6B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M3 14h12" stroke="#C96A6B" strokeWidth="1.5" strokeLinecap="round" />
                                  </svg>
                                  <span className="frg-doc-up-txt">Upload {formatDocLabel(docType)}</span>
                                  <span className="frg-doc-up-sub">PDF · JPG · PNG · WEBP · DOC · MAX 10MB</span>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="frg-note soft">Upload any supporting documents (awards, contracts, press coverage, credentials).</div>
                      {uploadedFiles.map(f => (
                        <div className="frg-file" key={f.id}>
                          <span className="frg-file-name">{f.name}</span>
                          <span className="frg-file-sz">{f.size}</span>
                          <span className="frg-file-rm" onClick={() => removeGeneric(f.id)} role="button" tabIndex={0}
                            onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), removeGeneric(f.id))}>×</span>
                        </div>
                      ))}
                      {uploadedFiles.length < MAX_GENERIC_FILES && (
                        <div className="frg-upload" role="button" tabIndex={0}
                          onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && e.currentTarget.click()}
                          onClick={() => {
                            const inp = document.createElement('input');
                            inp.type = 'file'; inp.multiple = true;
                            inp.accept = '.pdf,.doc,.docx,.jpg,.jpeg,.png,.webp';
                            inp.onchange = e => addGenericFiles(e.target.files);
                            inp.click();
                          }}>
                          <div className="frg-upload-ttl">Click to upload documents</div>
                          <div className="frg-upload-sub">
                            PDF · DOC · DOCX · JPG · PNG · WEBP · {MAX_GENERIC_FILES - uploadedFiles.length} OF {MAX_GENERIC_FILES} REMAINING · 10MB EACH
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  <div className="frg-rule">PRESS / MEDIA</div>
                  <div className="frg-field">
                    <label className="frg-label" htmlFor="frg-press">Press / media URLs <span className="opt">Optional</span></label>
                    <div className="frg-uline">
                      <textarea id="frg-press" className="frg-area" rows={3}
                        placeholder="Paste links to press articles — one per line"
                        value={form.pressUrls} onChange={set('pressUrls')} />
                    </div>
                    <div className="frg-help">One link per line. These are sent with your application.</div>
                  </div>
                </>
              )}
            </div>

            {registerError && (
              <div className="frg-note red" role="alert" style={{ marginTop: 20 }}>
                <b>We couldn’t submit your application.</b> {registerError}
              </div>
            )}

            {/* footer nav */}
            <div className="frg-foot">
              <span className="frg-foot-label">
                {step === 0 && underage ? 'NOT ELIGIBLE — MUST BE 18+' : footLabels[step]}
              </span>
              <div className="frg-foot-actions">
                {step > 0 && <button className="frg-back" onClick={() => go(step - 1)} disabled={busy}>← BACK</button>}
                <button
                  className={`frg-continue${!stepValid && !busy ? ' soft-disabled' : ''}`}
                  disabled={busy || (step === 0 && underage)}
                  onClick={next}
                >
                  {step === 4
                    ? (registering ? <><span className="frg-spin white" /> SUBMITTING…</>
                      : selfieStatus.state === 'checking' ? <><span className="frg-spin white" /> VERIFYING LIVENESS…</>
                      : selfieStatus.state === 'uploading' ? <><span className="frg-spin white" /> UPLOADING…</>
                      : <>SUBMIT APPLICATION <span className="arr">→</span></>)
                    : <>CONTINUE <span className="arr">→</span></>}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
