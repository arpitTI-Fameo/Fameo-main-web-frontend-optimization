'use client';
// app/(main)/account/products/page.js
// Products — spend the wallet balance. Items costing more than the available
// balance (or out of stock) are disabled rather than failing on submit.

import { useState } from 'react';

import { usePortalProducts, useWallet, useBuyWithWalletMutation } from '@/lib/hooks/main/usePortal';
import {
  PageTitle, Section, Card, Button, Chip, Skeleton, ErrorBox, Empty, Toast,
  inr, INK, GOLD, LINE, MUTED, FAINT, AMBER, AMBER_BG,
  FONT_DISPLAY,
} from '@/modules/Main/Account/AccountUI';

// Product icon glyphs, matching the account section's line-art style.
const ICONS = {
  headphones: '◑',
  watch: '◔',
  bottle: '◇',
  keyboard: '▤',
  speaker: '◉',
  mouse: '◗',
};

export default function Products() {
  const productsQuery = usePortalProducts();
  const walletQuery = useWallet();
  const buyWithWalletMutation = useBuyWithWalletMutation();

  const loading = productsQuery.isPending || walletQuery.isPending;
  const error = productsQuery.error?.message || walletQuery.error?.message;
  
  const refetch = () => {
    productsQuery.refetch();
    walletQuery.refetch();
  };

  const [toast, setToast] = useState('');

  const flash = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2400);
  };

  const handleBuy = async (product) => {
    try {
      await buyWithWalletMutation.mutateAsync(product.id);
      flash(`${product.name} ordered — paid from your wallet.`);
    } catch (err) {
      flash(err?.message || 'Purchase failed. Please try again.');
    }
  };

  const products = productsQuery.data || [];
  const wallet = walletQuery.data;
  const balance = wallet?.available ?? 0;
  const busy = buyWithWalletMutation.isPending ? buyWithWalletMutation.variables : null;

  return (
    <div>
      <PageTitle
        eyebrow="Redeem"
        title="Products"
        subtitle="Spend your wallet balance on Fameo merchandise"
        action={!loading && !error ? (
          <Chip bg={GOLD + '22'} fg={AMBER} style={{ fontSize: 12, padding: '6px 14px' }}>
            {inr(balance)} available
          </Chip>
        ) : null}
      />

      {error && <ErrorBox message={error} onRetry={refetch} />}

      {loading && (
        <div className="fa-grid-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <Skeleton height={80} style={{ marginBottom: 12 }} />
              <Skeleton height={13} width="70%" style={{ marginBottom: 8 }} />
              <Skeleton height={13} width="40%" />
            </Card>
          ))}
        </div>
      )}

      {!loading && !error && (
        <Section title="Available items">
          {products.length === 0 ? (
            <Card><Empty>No products available right now.</Empty></Card>
          ) : (
            <div className="fa-grid-3">
              {products.map((p) => {
                const affordable = balance >= p.price;
                const disabled = !p.inStock || !affordable || busy === p.id;

                return (
                  <Card key={p.id} style={{ textAlign: 'center' }}>
                    <div style={S.thumb}>{ICONS[p.icon] || '◇'}</div>
                    <div style={S.name}>{p.name}</div>
                    <div style={S.price}>{inr(p.price)}</div>

                    <Button
                      variant={affordable && p.inStock ? 'primary' : 'ghost'}
                      block
                      disabled={disabled}
                      onClick={() => handleBuy(p)}
                      style={{ marginTop: 12 }}
                    >
                      {busy === p.id
                        ? 'Processing…'
                        : !p.inStock
                          ? 'Out of stock'
                          : !affordable
                            ? 'Not enough balance'
                            : 'Buy with wallet'}
                    </Button>
                  </Card>
                );
              })}
            </div>
          )}
        </Section>
      )}

      <Toast message={toast} />
    </div>
  );
}

const S = {
  thumb: {
    height: 84,
    background: '#fbfaf7',
    border: `1px solid ${LINE}`,
    borderRadius: 8,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 30, color: GOLD,
    marginBottom: 12,
  },
  name: { fontSize: 13.5, fontWeight: 500, color: INK },
  price: {
    fontFamily: FONT_DISPLAY,
    fontSize: 20, fontWeight: 600, color: GOLD, marginTop: 4,
  },
};
