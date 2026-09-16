'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import logo from '@/app/assets/logo.png';
import { CSS } from '../styles';
import PolicyModal from '../PolicyModal'
import LiveSelfieCapture from '../LiveSelfieCapture';
import Step01Identity from './Steps/Step01Identity';
import Step02Profile from './Steps/Step02Profile';
import Step03Socials from './Steps/Step03Socials';
import Step04Category from './Steps/Step04Category';

import Step05Proof from './Steps/Step05Proof';
import SuccessSummary from './Steps/SuccessSummary';
import { useSendOtpMutation, useVerifyOtpMutation, useVerifyEmailOtpMutation, useUploadLiveSelfieMutation, useUploadSelfieMutation, useUploadDocumentsMutation, useRegisterMutation, useCheckUsernameMutation, useValidateReferralMutation, useStates, useCities, useCategories, useProfessions } from '@/lib/hooks/auth/useRegister';
import {
  MAX_GENERIC_FILES, MAX_FILE_BYTES, ACCEPTED_DOC_EXT, COUNTRY_CODES,
  mobileLenRange, validateMobile, PATTERNS, validateEmail, PIN_PATTERN,
  normName, lookupPincode, pickCategoryIcon, GENDER_OPTIONS, POLICY_LINKS,
  STEPS, OTP_LENGTH, RESEND_SECONDS,
} from '../constants';
import {
  calcAge, fmtSize, cleanUrl, friendlyOtpError, friendlyRegisterError,
  livenessHint, isFatalLiveness, readReferralFromUrl
} from '../helpers';
import {
  REGISTER_DEFAULT_VALUES, stepSchema, firstInvalidField,
} from '../schema';

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

  const [touched, setTouched] = useState({});
  const [activePolicy, setActivePolicy] = useState(null);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  /* OTP */
  const [otpSent, setOtpSent] = useState(false);
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

  const [registerError, setRegisterError] = useState('');
  const uploadedDocsRef = useRef(null);
  const [summary, setSummary] = useState(null);

  const cardRef = useRef(null);

  /* ── React Hook Form + zod ──────────────────────────────────────────────
     RHF owns every value the wizard collects; the step schemas in ../schema
     own every rule. Both modes are 'onSubmit' because that is when this card
     has always validated — on Continue, never on a keystroke. Individual
     messages still clear as you type, through clearErr() below.

     The resolver is rebuilt on every render on purpose. A step's rules depend
     on state that is not a form value (OTP verification, the selfie upload,
     the in-flight referral and username lookups), and RHF re-reads its options
     each render — so the schema always sees current state instead of whatever
     was true on mount.
     -------------------------------------------------------------------- */
  const selfieReady = Boolean(selfieFile && selfieStatus.state === 'done');
  /** @type {import('react-hook-form').UseFormReturn<import('../schema').RegisterValues>} */
  const {
    watch, getValues, setValue, setError, clearErrors, handleSubmit,
    formState: { errors: fieldErrors },
  } = useForm({
    defaultValues: REGISTER_DEFAULT_VALUES,
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    resolver: zodResolver(stepSchema(step, {
      phoneVerified, emailVerified, referralStatus, selfieReady,
      ensureReferralChecked: () => handleValidateReferral(),
      ensureUsernameChecked: () => ensureUsernameChecked(),
    })),
  });

  const form = watch();
  const consents = { age: form.consentAge, terms: form.consentTerms };

  const { data: states = [], isLoading: statesLoading, isError: statesIsError } = useStates();
  const statesError = statesIsError ? 'Could not load states.' : '';

  const { data: cities = [], isFetching: citiesLoading, isError: citiesIsError } = useCities(form?.stateId);
  const citiesError = citiesIsError ? 'Could not load cities.' : '';

  const { data: categories = [], isLoading: catLoading, isError: catIsError } = useCategories();
  const catError = catIsError ? 'Could not load categories. Please refresh.' : '';

  const { data: professions = [], isFetching: profLoading, isError: profIsError } = useProfessions(form?.categoryCode);
  const profError = profIsError ? 'Could not load professions.' : '';

  /* The steps render errors.<key> as a string; RHF stores { message, type }
     per key. Flatten so no step component has to change.

     Deliberately NOT memoised on fieldErrors: setError() and clearErrors(name)
     mutate RHF's error object in place and re-emit the same reference, so a
     useMemo keyed on its identity would go stale and keep showing a message
     that was just cleared. This loop is a handful of keys. */
  const errors = {};
  for (const [key, value] of Object.entries(fieldErrors)) {
    if (value?.message) errors[key] = value.message;
  }

  /* The steps call setForm(updater) for multi-field writes (country code +
     trimmed mobile, category code + name + id). Same signature, writing
     through to RHF instead of to a useState setter. */
  const setForm = (update) => {
    const current = getValues();
    const nextValues = typeof update === 'function' ? update(current) : update;
    for (const key of Object.keys(nextValues)) {
      if (!Object.is(nextValues[key], current[key])) setValue(key, nextValues[key]);
    }
  };

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

  const sendOtpMutation = useSendOtpMutation();
  const verifyOtpMutation = useVerifyOtpMutation();
  const verifyEmailOtpMutation = useVerifyEmailOtpMutation();
  const uploadLiveSelfieMutation = useUploadLiveSelfieMutation();
  const uploadSelfieMutation = useUploadSelfieMutation();
  const uploadDocumentsMutation = useUploadDocumentsMutation();
  const registerMutation = useRegisterMutation();
  const checkUsernameMutation = useCheckUsernameMutation();
  const validateReferralMutation = useValidateReferralMutation();

  /* central error helper — clears one or more error keys */
  const clearErr = (...keys) => clearErrors(keys);
  const markTouched = (k) => () => setTouched(t => ({ ...t, [k]: true }));

  /* resend ticker */
  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setTimeout(() => setResendIn(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendIn]);

  /* reset profession on category change */
  useEffect(() => {
    setSelectedProfObj(null);
    setValue('profession', ''); setValue('professionCode', ''); setValue('professionId', null);
  }, [form?.categoryCode, setValue]);

  /* prefill + validate a referral code arriving from an invite link */
  useEffect(() => {
    const code = readReferralFromUrl();
    if (!code) return;
    setValue('referralCode', code);
    setReferralFromLink(true);
    // Pass the code explicitly — the value hasn't flushed yet, so the closure
    // inside handleValidateReferral would still see an empty referralCode.
    handleValidateReferral(code);

  }, []);

  const set = k => e => { setValue(k, e.target.value); clearErr(k); };
  const setField = (k, v) => { setValue(k, v); clearErr(k); };

  /* ── DOB / age gate ── */
  const age = calcAge(form.dob);
  const ageOk = age !== null && age >= 18;
  const underage = age !== null && age < 18;
  const onDobChange = e => {
    const dob = e.target.value;
    setValue('dob', dob);
    const a = calcAge(dob);
    setValue('consentAge', a !== null && a >= 18);
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
    setValue('mobile', e.target.value.replace(/\D/g, '').slice(0, mobileLenRange(getValues('cc'))[1]));
    clearErr('phone');
    if (otpSent || phoneVerified || emailVerified) resetOtp();
  };
  const onEmailChange = e => {
    // Lowercase so You@GMAIL.com and you@gmail.com can't create two accounts.
    setValue('email', e.target.value.trim().toLowerCase());
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
    setValue('referralCode', v);
    clearErr('referral');
    setReferralFromLink(false);
    setReferralStatus({ state: 'idle', msg: '', data: null });
  };
  /* Returns { ok, msg }. Callers (link prefill · blur · submit) can pass the
     code explicitly, so they never depend on form state having flushed. An
     in-flight check is reused rather than duplicated. */
  const handleValidateReferral = (codeArg) => {
    const code = String(codeArg ?? form.referralCode).trim();
    if (!code) { setReferralStatus({ state: 'idle', msg: '', data: null }); clearErr('referral'); return Promise.resolve({ ok: true, msg: '' }); }
    if (referralCheckRef.current?.code === code) return referralCheckRef.current.promise;
    if (!PATTERNS.referral.test(code)) {
      const msg = 'Codes are 4–30 letters, numbers or dashes.';
      setReferralStatus({ state: 'invalid', msg, data: null });
      setError('referral', { message: msg });
      return Promise.resolve({ ok: false, msg });
    }
    setReferralStatus({ state: 'checking', msg: 'Checking code…', data: null });
    const promise = (async () => {
      try {
        const data = await validateReferralMutation.mutateAsync(code);
        const valid = data?.valid !== false;
        if (!valid) {
          const msg = data?.message || 'This referral code is not valid.';
          setReferralStatus({ state: 'invalid', msg, data: null });
          setError('referral', { message: msg });
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
        setError('referral', { message: msg });
        return { ok: false, msg };
      } finally {
        if (referralCheckRef.current?.code === code) referralCheckRef.current = null;
      }
    })();
    referralCheckRef.current = { code, promise };
    return promise;
  };
  const removeReferral = () => {
    setValue('referralCode', '');
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
      Object.entries(e).forEach(([key, message]) => setError(key, { message }));
      setTouched(t => ({ ...t, mobile: true, email: true }));
      const order = ['fname', 'lname', 'phone', 'email'];
      const first = order.find(k => e[k]);
      if (first) focusField(first === 'phone' ? 'mobile' : first);
      return;
    }
    try {
      const data = await sendOtpMutation.mutateAsync({
        mobile_number: getRaw(),
        mobile_country_code: form.cc,
        email: form.email,
        full_name: `${form.fname} ${form.lname}`.trim(),
      });
      setOtpSent(true);
      setMobileOtp(Array(OTP_LENGTH).fill('')); setEmailOtp(Array(OTP_LENGTH).fill(''));
      setResendIn(RESEND_SECONDS);
      if (data?.mobile_otp) console.log('[DEV] Mobile OTP:', data.mobile_otp, '| Email OTP:', data.email_otp);
      setTimeout(() => mobileRefs.current[0]?.focus(), 60);
    } catch (err) {
      // Raw server/network detail stays in the console; the user sees clean copy.
      console.error('[send-otp]', err);
      const known = (err?.serverMessage || '').toLowerCase();
      const msg = known.includes('already')
        ? 'An account already exists with this number or email. Try logging in instead.'
        : 'Could not send the code right now. Check your number and try again.';
      setError('phone', { message: msg });
      focusField('mobile');
    }
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
      await verifyOtpMutation.mutateAsync({ mobile_number: getRaw(), mobile_country_code: form.cc, otp });
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
      await verifyEmailOtpMutation.mutateAsync({ email: form.email, otp });
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
  const handleCheckUsername = (nameArg) => {
    const username = String(nameArg ?? form.username).trim();
    if (!username) { setUsernameStatus(null); return Promise.resolve(null); }
    if (!PATTERNS.username.test(username)) {
      setUsernameStatus('invalid');
      setError('username', { message: 'Use 1–30 letters, numbers, dots or underscores.' });
      return Promise.resolve('invalid');
    }
    if (usernameCheckRef.current?.username === username) return usernameCheckRef.current.promise;
    setUsernameStatus('checking');
    const promise = (async () => {
      try {
        console.log("username", username)
        const data = await checkUsernameMutation.mutateAsync(username);
        console.log(data)
        const available = data?.available === true;
        setUsernameStatus(available ? 'available' : 'taken');
        if (available) clearErr('username');
        else setError('username', { message: `@${username} is already taken — please use another username.` });
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
    console.log("username", name)
    if (!name) return null;
    const inflight = usernameCheckRef.current;
    if (inflight && inflight.username === name) return inflight.promise;
    if (usernameStatus === 'available' || usernameStatus === 'taken' || usernameStatus === 'error') return usernameStatus;
    return handleCheckUsername(name);
  };

  /* live availability as they type */
  useEffect(() => {
    const name = form.username.trim();
    if (!name) { setUsernameStatus(null); return; }
    if (!PATTERNS.username.test(name)) { setUsernameStatus('invalid'); return; }
    const t = setTimeout(() => handleCheckUsername(name), 450);
    return () => clearTimeout(t);

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
    if (c) { setValue('cityId', c.id); setValue('city', c.city_name); clearErr('city'); }
    pendingCityRef.current = null;
  }, [cities]);

  const applyPinLocation = () => {
    const d = pinStatus.data;
    if (!d) return;
    const st = states.find(s => normName(s.state_name) === normName(d.state));
    if (!st) return;
    setValue('stateId', st.id); setValue('state', st.state_name); setValue('stateCode', st.state_code);
    setValue('cityId', null); setValue('city', '');
    pendingCityRef.current = d.district;
    clearErr('state', 'city');
  };

  const pinMismatch = pinStatus.state === 'found' && Boolean(form.state)
    && normName(pinStatus.data.state) !== normName(form.state);

  /* ── state / city / profession selection ── */
  const onStateChange = (stateId) => {
    const s = states.find(x => x.id === parseInt(stateId)) || null;
    setValue('stateId', s ? s.id : null); setValue('state', s ? s.state_name : '');
    setValue('stateCode', s ? s.state_code : ''); setValue('cityId', null); setValue('city', '');
    pendingCityRef.current = null;
    clearErr('state');
  };
  const onCityChange = (cityId) => {
    const c = cities.find(x => x.id === parseInt(cityId)) || null;
    setValue('cityId', c ? c.id : null); setValue('city', c ? c.city_name : '');
    clearErr('city');
  };
  const onProfessionChange = (code) => {
    const p = professions.find(x => x.profession_code === code) || null;
    setSelectedProfObj(p);
    setValue('professionCode', code); setValue('profession', p ? p.profession_name : '');
    setValue('professionId', p ? p.profession_id : null);
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

      let liveData;
      try {
        liveData = await uploadLiveSelfieMutation.mutateAsync(liveForm);
      } catch (err) {
        console.error(`[fameoselfie] Error`, err);
        const serverMsg = err?.serverMessage || err?.message
          || (err?.status === 413 ? 'Verification images were too large for the server.'
            : err?.status === 404 ? 'Verification endpoint not found.'
              : err?.status === 401 || err?.status === 403 ? 'Verification service rejected the request.'
                : 'Verification service error.');
        setSelfieStatus({ state: 'error', msg: serverMsg, hint: livenessHint(serverMsg), liveness: '', fatal: isFatalLiveness(serverMsg) });
        return;
      }

      const verified = liveData?.verified === true;
      if (!verified) {
        const msg = liveData?.message || 'Live selfie verification failed. Please try again.';
        setSelfieStatus({ state: 'error', msg, hint: livenessHint(msg), liveness: '', fatal: isFatalLiveness(msg) });
        return;
      }
      const livenessNote = liveData?.liveness || 'Blink and natural movement detected';

      setSelfieStatus({ state: 'uploading', msg: '', hint: '', liveness: livenessNote, fatal: false });
      const uploadForm = new FormData();
      uploadForm.append('selfie', file);
      uploadForm.append('mobile_number', getRaw());
      const upData = await uploadSelfieMutation.mutateAsync(uploadForm);
      const uploadedUrl = upData?.selfie_url || upData?.url || null;
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

        const docData = await uploadDocumentsMutation.mutateAsync(fd);
        const docPayload = Array.isArray(docData) ? docData[0] : docData;
        const docArray = docPayload?.documents || docData?.documents || [];
        uploadedDocs = Array.isArray(docArray) ? docArray.map(d => ({
          tag: d.tag || 'credential',
          url: d.url || d.document_url || d.file_url,
          filename: d.filename || d.original_name || '',
          type: d.type || d.mime_type || 'application/octet-stream',
        })).filter(d => d.url) : [];

        if (!uploadedDocs.length) {
          console.error('[upload-documents] 200 OK but no usable document URLs:', docData);
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
      const rawRegData = await registerMutation.mutateAsync(payload);

      // Guide §3 concurrency rule: validate checks availability but does NOT
      // reserve the coupon — the claim happens here. A 200 alone does not mean
      // the code was applied, so referral_applied is the only confirmation.
      const regData = Array.isArray(rawRegData) ? rawRegData[0] : rawRegData;
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
    }
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

  const busy = registerMutation.isPending || selfieStatus.state === 'checking' || selfieStatus.state === 'uploading' || sendOtpMutation.isPending || referralStatus.state === 'checking';

  const go = (n) => {
    setDir(n > step ? 'fwd' : 'bwd');
    setStep(n);
    setSubmitAttempted(false);
    setRegisterError('');
    cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  /* ── advance a step ───────────────────────────────────────────────────────
     handleSubmit runs this step's schema and REPLACES the error set rather
     than merging into it, so a stale key (a "DOB required" from an earlier
     attempt) cannot survive once it is fixed. Step 05 submits instead of
     advancing; the success screen is step 5.
     ---------------------------------------------------------------------- */
  const onStepValid = () => {
    if (step === 4) { handleRegister(); return; }
    go(step + 1);
  };
  const onStepInvalid = (stepErrors) => {
    const firstInvalid = firstInvalidField(step, stepErrors, { otpSent });
    if (firstInvalid) focusField(firstInvalid);
  };

  const next = async () => {
    if (step === 5 || busy) return;
    setSubmitAttempted(true);
    setRegisterError('');
    await handleSubmit(onStepValid, onStepInvalid)();
  };

  const toggleConsent = key => {
    const name = key === 'age' ? 'consentAge' : 'consentTerms';
    setValue(name, !getValues(name));
    clearErr(key === 'age' ? 'age' : 'terms');
  };

  const meta = STEPS[step] || STEPS[STEPS.length - 1];
  const footLabels = ['COMPLETE IDENTITY & VERIFY', 'BUILD YOUR PROFILE', 'LINK YOUR SOCIALS', 'CHOOSE YOUR CATEGORY', 'FINAL PROOF & SUBMIT'];
  const mobileComplete = mobileOtp.every(d => d !== '');
  const emailComplete = emailOtp.every(d => d !== '');

  const success = step === 5;

  const ctx = {
    referralFromLink, referralStatus, form, set, setField, errors, registerFieldRef,
    ageOk, underage, onDobChange, age,
    phoneVerified, otpSent, resetOtp, setForm, clearErr, showMobileErr, mobileOk, onMobileChange, markTouched, mobileErrMsg, mobileHint,
    emailVerified, showEmailErr, emailWarn, onEmailChange, emailOk, emailErrMsg,
    onReferralChange, validateReferral: handleValidateReferral, removeReferral,
    sendOtp, otpSending: sendOtpMutation.isPending, mobileShake, getRaw, mobileOtp, mobileRefs, otpDigit, otpKey, mobileOtpStatus, mobileComplete, verifyMobile, resendIn,
    emailShake, emailOtp, emailRefs, emailOtpStatus, emailComplete, verifyEmail,
    consents, toggleConsent, setActivePolicy,
    usernameStatus, setUsernameStatus, statesError, onStateChange, statesLoading, states,
    citiesError, onCityChange, citiesLoading, cities, pinStatus, pinMismatch, applyPinLocation,
    ytOk, igOk,
    catError, catLoading, categories, profError, onProfessionChange, profLoading, professions,
    selfieFile, setCameraOpen, selfieStatus, selfiePreview, retakeSelfie,
    fileError, requiredDocs, docSlots, removeSlot, docInputRefs, handleSlotFile,
    uploadedFiles, removeGeneric, addGenericFiles, summary
  };

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
          <Link className="frg-brand-mark" href="/" aria-label="Fameo home">
            {brandLogo ? (
              <img src={typeof brandLogo === 'string' ? brandLogo : brandLogo.src} alt="Fameo" />
            ) : (
              <span className="frg-brand-word">Fame<span className="dot" /></span>
            )}
            <span className="frg-brand-rule" aria-hidden="true" />
            <span className="frg-brand-sub">Creator Network</span>
          </Link>
          <a className="frg-brand-back" href="/login">ALREADY A MEMBER? LOG IN →</a>
        </div>

        {success ? (
          <SuccessSummary ctx={ctx} />
        ) : (
          <>
            {/* step panel */}
            <div key={step} className={`frg-panel ${dir}`}>
              <div className="frg-kicker">{meta.kicker}</div>
              <h1 className="frg-h1">{meta.lead} <em>{meta.accent}</em></h1>
              <p className="frg-sub">{meta.sub}</p>

              {step === 0 && <Step01Identity ctx={ctx} />}
              {step === 1 && <Step02Profile ctx={ctx} />}
              {step === 2 && <Step03Socials ctx={ctx} />}
              {step === 3 && <Step04Category ctx={ctx} />}
              {step === 4 && <Step05Proof ctx={ctx} />}
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
                    ? (registerMutation.isPending ? <><span className="frg-spin white" /> SUBMITTING…</>
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
