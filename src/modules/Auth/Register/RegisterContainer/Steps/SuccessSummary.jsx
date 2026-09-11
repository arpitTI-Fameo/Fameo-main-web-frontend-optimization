import React from 'react';
import { GreenTick } from '../../icons';

export default function SuccessSummary({ ctx }) {
  const { summary } = ctx;
  return (
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
  );
}
