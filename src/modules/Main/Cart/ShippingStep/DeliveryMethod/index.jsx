'use client';
// modules/Main/Cart/ShippingStep/DeliveryMethod/index.jsx
// "To Your Door" / "Pickup From Warehouse".

import { DELIVERY_METHODS } from '@/utils/shipping';

import { HomeIcon, WarehouseIcon } from '../../icons';

import { S } from './styles';

const OPTIONS = [
  { value: DELIVERY_METHODS.DOOR,   label: 'To Your Door',         Icon: HomeIcon },
  { value: DELIVERY_METHODS.PICKUP, label: 'Pickup From Warehouse', Icon: WarehouseIcon },
];

/** Props: value, onChange, heading */
export default function DeliveryMethod({ value, onChange, heading }) {
  return (
    <>
      <style>{S}</style>
      <section className="cdm-wrap">
        <h2 className="cdm-heading" id="cdm-heading">{heading}</h2>

        <div className="cdm-row" role="radiogroup" aria-labelledby="cdm-heading">
          {OPTIONS.map(({ value: v, label, Icon }) => (
            <button
              type="button"
              key={v}
              role="radio"
              aria-checked={v === value}
              className={`cdm-opt${v === value ? ' is-on' : ''}`}
              onClick={() => onChange?.(v)}
            >
              {label}
              <span className="cdm-icon" aria-hidden="true"><Icon /></span>
            </button>
          ))}
        </div>
      </section>
    </>
  );
}
