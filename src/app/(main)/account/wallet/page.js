'use client';
// app/(main)/account/wallet/page.js
// Wallet — balance summary and full transaction history.
// Mock-backed via services/portal.service.js; flip that file for the API.

import Link from 'next/link';

import { usePortalDataMap } from '@/hooks/usePortalData';
import { getWallet, getTransactions } from '@/services/portal.service';
import {
  PageTitle, Section, Card, StatTile, StatusChip, Table, tdStyle,
  SkeletonTiles, Skeleton, ErrorBox, Empty, linkButtonStyle,
  inr, shortDate, GOLD, AMBER, GREEN, INK, MUTED,
} from '@/components/account/AccountUI';

export default function AccountWalletPage() {
  const { data, loading, error, refetch } = usePortalDataMap({
    wallet:       getWallet,
    transactions: getTransactions,
  });

  const { wallet, transactions } = data;

  return (
    <div>
      <PageTitle
        eyebrow="Earnings"
        title="Wallet"
        subtitle="Your referral earnings — lifetime, no expiry"
      />

      {error && <ErrorBox message={error} onRetry={refetch} />}

      {/* ── Summary ─────────────────────────────────────────────────── */}
      {!error && (
        <Section title="Balance">
          {loading ? <SkeletonTiles count={4} /> : (
            <div className="fa-grid-4">
              <StatTile label="Available" value={inr(wallet.available)} color={GOLD} />
              <StatTile
                label={`In ${wallet.holdDays}-day hold`}
                value={inr(wallet.onHold)}
                color={AMBER}
              />
              <StatTile label="Lifetime earned" value={inr(wallet.lifetimeEarned)} />
              <StatTile label="Spent" value={inr(wallet.spent)} />
            </div>
          )}
        </Section>
      )}

      {/* ── Transactions ────────────────────────────────────────────── */}
      {!error && (
        <Section title="Transaction history">
          <Card style={{ padding: '16px 18px 4px' }}>
            {loading ? (
              [0, 1, 2, 3].map((i) => (
                <Skeleton key={i} height={20} style={{ marginBottom: 14 }} />
              ))
            ) : transactions.length === 0 ? (
              <Empty>No transactions yet. Share a coupon to start earning.</Empty>
            ) : (
              <Table head={['Type', 'Description', 'Tier', 'Amount', 'Status', 'Date']}>
                {transactions.map((t, i) => {
                  const isCredit = t.type === 'credit';
                  const last = i === transactions.length - 1;
                  const cell = last ? { ...tdStyle, borderBottom: 'none' } : tdStyle;
                  return (
                    <tr key={t.id}>
                      <td style={cell}><StatusChip status={t.type} /></td>
                      <td style={cell}>{t.description}</td>
                      <td style={{ ...cell, color: MUTED }}>{t.tier || '—'}</td>
                      <td style={{
                        ...cell,
                        fontWeight: 600,
                        color: t.status === 'holding' ? AMBER : GREEN,
                      }}>
                        {isCredit ? '+' : '−'}{inr(t.amount)}
                      </td>
                      <td style={cell}><StatusChip status={t.status} /></td>
                      <td style={{ ...cell, color: MUTED }}>{shortDate(t.date)}</td>
                    </tr>
                  );
                })}
              </Table>
            )}
          </Card>
        </Section>
      )}

      {!loading && !error && (
        <Link href="/account/products" style={linkButtonStyle('primary')}>
          Browse products to spend your balance
        </Link>
      )}
    </div>
  );
}
