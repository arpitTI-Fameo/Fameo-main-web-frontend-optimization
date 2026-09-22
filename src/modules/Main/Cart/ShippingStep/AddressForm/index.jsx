'use client';
// modules/Main/Cart/ShippingStep/AddressForm/index.jsx
// "Add New Address" — the inline form the ⊕ button reveals.
//
// Validation is @/utils/address, the same rules Checkout's DeliveryForm runs,
// so an address accepted here cannot be rejected at payment. Errors surface per
// field once that field has been touched, or on submit for all of them.

import { useState } from 'react';

import {
  ADDRESS_FIELDS,
  INDIAN_STATES,
  emptyAddress,
  validateAddressFields,
} from '@/utils/address';

import { S } from './styles';

// Which control each field renders as, and how wide it sits on the grid.
const FIELD_META = {
  firstName: { type: 'text',  span: 1, autoComplete: 'given-name' },
  lastName:  { type: 'text',  span: 1, autoComplete: 'family-name' },
  email:     { type: 'email', span: 1, autoComplete: 'email' },
  phone:     { type: 'tel',   span: 1, autoComplete: 'tel' },
  address:   { type: 'text',  span: 2, autoComplete: 'street-address' },
  city:      { type: 'text',  span: 1, autoComplete: 'address-level2' },
  state:     { type: 'select', span: 1, autoComplete: 'address-level1' },
  pin:       { type: 'text',  span: 1, autoComplete: 'postal-code' },
};

/**
 * Props
 *  user      current user, to prefill name/email
 *  onSave    (address) => void
 *  onCancel  () => void
 *  labels    { save, cancel }
 */
export default function AddressForm({ user, onSave, onCancel, labels }) {
  const [values, setValues] = useState(() => emptyAddress(user));
  const [touched, setTouched] = useState({});

  const errors = validateAddressFields(values);

  const set = (key, value) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setTouched((prev) => ({ ...prev, [key]: true }));
  };

  const submit = (e) => {
    e.preventDefault();
    if (Object.keys(errors).length) {
      // Reveal every problem at once rather than one per submit.
      setTouched(Object.fromEntries(ADDRESS_FIELDS.map(([k]) => [k, true])));
      return;
    }
    onSave?.(values);
  };

  return (
    <>
      <style>{S}</style>
      <form className="caf-form" onSubmit={submit} noValidate>
        <div className="caf-grid">
          {ADDRESS_FIELDS.map(([key, label]) => {
            const meta = FIELD_META[key] || { type: 'text', span: 1 };
            const invalid = touched[key] && errors[key];

            return (
              <div
                className={`caf-field${meta.span === 2 ? ' is-wide' : ''}`}
                key={key}
                data-field={key}
              >
                <label className="caf-label" htmlFor={`caf-${key}`}>{label}</label>

                {meta.type === 'select' ? (
                  <select
                    id={`caf-${key}`}
                    className={`caf-input${invalid ? ' is-bad' : ''}`}
                    value={values[key]}
                    autoComplete={meta.autoComplete}
                    onChange={(e) => set(key, e.target.value)}
                  >
                    {INDIAN_STATES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                ) : (
                  <input
                    id={`caf-${key}`}
                    type={meta.type}
                    className={`caf-input${invalid ? ' is-bad' : ''}`}
                    value={values[key]}
                    autoComplete={meta.autoComplete}
                    aria-invalid={invalid ? 'true' : undefined}
                    aria-describedby={invalid ? `caf-${key}-err` : undefined}
                    onChange={(e) => set(key, e.target.value)}
                    onBlur={() => setTouched((p) => ({ ...p, [key]: true }))}
                  />
                )}

                {invalid && (
                  <p className="caf-error" id={`caf-${key}-err`}>{errors[key]}</p>
                )}
              </div>
            );
          })}
        </div>

        <div className="caf-actions">
          <button type="button" className="caf-cancel" onClick={onCancel}>
            {labels?.cancel}
          </button>
          <button type="submit" className="caf-save">
            {labels?.save}
          </button>
        </div>
      </form>
    </>
  );
}
