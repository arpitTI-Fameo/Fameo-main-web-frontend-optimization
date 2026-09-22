'use client';
// modules/Main/Cart/ShippingStep/AddressList/index.jsx
// Saved addresses as selectable cards, with the reference's empty state.

import { addressName, formatAddressLine } from '@/utils/address';

import { CheckIcon } from '../../icons';

import { S } from './styles';

/**
 * Props
 *  addresses  [address]
 *  selectedId string|null
 *  onSelect   (address) => void
 *  emptyText  string
 *  loading    boolean
 */
export default function AddressList({
  addresses = [],
  selectedId,
  onSelect,
  emptyText,
  loading = false,
}) {
  if (loading) {
    return (
      <>
        <style>{S}</style>
        <p className="cal-empty">Loading your saved addresses…</p>
      </>
    );
  }

  if (!addresses.length) {
    return (
      <>
        <style>{S}</style>
        <p className="cal-empty">{emptyText}</p>
      </>
    );
  }

  return (
    <>
      <style>{S}</style>
      <ul className="cal-list" role="radiogroup" aria-label="Saved shipping addresses">
        {addresses.map((addr) => {
          const on = addr.id === selectedId;
          return (
            <li key={addr.id}>
              <button
                type="button"
                role="radio"
                aria-checked={on}
                className={`cal-card${on ? ' is-on' : ''}`}
                onClick={() => onSelect?.(addr)}
              >
                <span className="cal-mark" aria-hidden="true">
                  {on && <CheckIcon />}
                </span>

                <span className="cal-body">
                  <span className="cal-name">{addressName(addr) || 'Saved address'}</span>
                  <span className="cal-line">{formatAddressLine(addr)}</span>
                  {addr.phone && <span className="cal-phone">{addr.phone}</span>}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </>
  );
}
