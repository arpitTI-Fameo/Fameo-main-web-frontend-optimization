'use client';
// modules/Main/Cart/ShippingStep/index.jsx
// Step 2: how the order travels, and where to.
//
// Composes its three children and holds one piece of local state — whether the
// "Add New Address" form is open. The chosen method and address belong to the
// page, because checkout reads them back out of the store.

import { useState } from 'react';

import { DELIVERY_METHODS } from '@/utils/shipping';

import { ADDRESS_SECTION, DELIVERY_HEADING, PICKUP_NOTICE } from '../constants';
import { PlusCircleIcon } from '../icons';

import AddressForm from './AddressForm';
import AddressList from './AddressList';
import DeliveryMethod from './DeliveryMethod';
import { S } from './styles';

/**
 * Props
 *  user            for prefilling a new address
 *  method          'door' | 'pickup'
 *  onMethod        (method) => void
 *  addresses       [address]
 *  loadingAddresses boolean
 *  selectedId      string|null
 *  onSelectAddress (address) => void
 *  onAddAddress    (address) => void
 */
export default function ShippingStep({
  user,
  method,
  onMethod,
  addresses = [],
  loadingAddresses = false,
  selectedId,
  onSelectAddress,
  onAddAddress,
}) {
  const [adding, setAdding] = useState(false);

  const isPickup = method === DELIVERY_METHODS.PICKUP;

  const save = (address) => {
    onAddAddress?.(address);
    setAdding(false);
  };

  return (
    <>
      <style>{S}</style>
      <div className="css-wrap">
        <DeliveryMethod value={method} onChange={onMethod} heading={DELIVERY_HEADING} />

        {isPickup ? (
          /* Nothing to ship to — so the address block is replaced rather than
             disabled. A greyed-out form the shopper cannot use is just noise. */
          <section className="css-pickup">
            <h3 className="css-pickup-title">{PICKUP_NOTICE.title}</h3>
            <p className="css-pickup-body">{PICKUP_NOTICE.body}</p>
          </section>
        ) : (
          <section className="css-address">
            <div className="css-address-head">
              <h3 className="css-address-title">{ADDRESS_SECTION.title}</h3>
              <button
                type="button"
                className="css-add"
                onClick={() => setAdding((v) => !v)}
                aria-expanded={adding}
              >
                {adding ? ADDRESS_SECTION.cancel : ADDRESS_SECTION.add}
                <PlusCircleIcon />
              </button>
            </div>

            {adding ? (
              <AddressForm
                user={user}
                onSave={save}
                onCancel={() => setAdding(false)}
                labels={{ save: ADDRESS_SECTION.save, cancel: ADDRESS_SECTION.cancel }}
              />
            ) : (
              <AddressList
                addresses={addresses}
                selectedId={selectedId}
                onSelect={onSelectAddress}
                emptyText={ADDRESS_SECTION.empty}
                loading={loadingAddresses}
              />
            )}
          </section>
        )}
      </div>
    </>
  );
}
