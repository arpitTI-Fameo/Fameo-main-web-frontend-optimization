export const fmtINR   = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;
export const fmtDate  = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' }) : '—';
export const fmtShort = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' }) : '—';

// Opens a clean printable invoice in a new window.
export function printInvoice(inv) {
  const fmtINR  = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;
  const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' }) : '—';
  const w = window.open('', '_blank', 'width=760,height=900');
  if (!w) return;
  w.document.write(`
    <html><head><title>${inv.invoiceNumber}</title>
    <style>
      *{box-sizing:border-box;margin:0;padding:0;}
      body{font-family:'Jost',Arial,sans-serif;color:#181820;padding:48px;max-width:720px;margin:0 auto;}
      .top{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2px solid #181820;padding-bottom:20px;margin-bottom:28px;}
      .brand{font-size:30px;font-weight:700;letter-spacing:2px;color:#e8457a;}
      .meta{text-align:right;font-size:12px;color:#6a6a78;line-height:1.7;}
      .meta b{color:#181820;}
      .row{display:flex;justify-content:space-between;gap:40px;margin-bottom:28px;}
      .blk h4{font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:#9898a8;margin-bottom:6px;}
      .blk p{font-size:13px;line-height:1.6;}
      table{width:100%;border-collapse:collapse;margin:24px 0;}
      th{text-align:left;font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:#9898a8;padding:10px 8px;border-bottom:1px solid #ddd;}
      td{font-size:13px;padding:14px 8px;border-bottom:1px solid #eee;}
      .total{text-align:right;font-size:20px;font-weight:600;margin-top:12px;}
      .paid{display:inline-block;margin-top:8px;font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:#2eaa68;border:1px solid #2eaa68;padding:4px 12px;border-radius:20px;}
      .foot{margin-top:40px;font-size:11px;color:#9898a8;border-top:1px solid #eee;padding-top:16px;text-align:center;}
      @media print{.noprint{display:none;}}
      .noprint{margin-top:30px;text-align:center;}
      .pbtn{padding:10px 24px;background:#181820;color:#fff;border:none;border-radius:3px;cursor:pointer;letter-spacing:.1em;text-transform:uppercase;font-size:11px;}
    </style></head><body>
      <div class="top">
        <div><div class="brand">FAMEO</div><div style="font-size:11px;color:#9898a8;margin-top:4px;">Tax Invoice</div></div>
        <div class="meta">
          <div><b>${inv.invoiceNumber}</b></div>
          <div>Date: ${fmtDate(inv.paidAt)}</div>
          ${inv.paymentId ? `<div>Payment: ${inv.paymentId}</div>` : ''}
        </div>
      </div>
      <div class="row">
        <div class="blk"><h4>Billed To</h4>
          <p>${inv.billedTo?.name || '—'}<br>${inv.billedTo?.email || ''}<br>${inv.billedTo?.phone || ''}</p>
        </div>
        <div class="blk" style="text-align:right;"><h4>From</h4>
          <p>${inv.seller?.name || 'Fameo'}<br>${inv.seller?.support || ''}</p>
        </div>
      </div>
      <table>
        <thead><tr><th>Description</th><th>Period</th><th style="text-align:right;">Amount</th></tr></thead>
        <tbody>
          <tr>
            <td>${inv.planName} membership (${(inv.membershipType||'').toUpperCase()})</td>
            <td>${fmtDate(inv.periodStart)} – ${fmtDate(inv.periodEnd)}${inv.billingPeriod ? `<br><span style="color:#9898a8;font-size:11px;">${inv.billingPeriod}</span>` : ''}</td>
            <td style="text-align:right;">${fmtINR(inv.amount)}</td>
          </tr>
        </tbody>
      </table>
      <div class="total">Total: ${fmtINR(inv.amount)}</div>
      <div style="text-align:right;"><span class="paid">${inv.status || 'paid'}</span></div>
      <div class="foot">Thank you for being a Fameo member. This is a computer-generated invoice.</div>
      <div class="noprint"><button class="pbtn" onclick="window.print()">Print / Save as PDF</button></div>
    </body></html>
  `);
  w.document.close();
}
