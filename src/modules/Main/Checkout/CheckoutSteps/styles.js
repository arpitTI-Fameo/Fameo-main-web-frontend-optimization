export const S = `
  .cs-wrap {
    display: flex;
    align-items: center;
    margin-bottom: clamp(28px, 4.5vh, 44px);
  }

  .cs-step { display: flex; align-items: center; gap: 10px; flex: 1; }

  .cs-num {
    flex-shrink: 0;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    border: 1px solid var(--chk-line);
    background: #FFFFFF;
    color: var(--chk-faint);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11.5px;
    font-weight: 500;
    font-variant-numeric: tabular-nums;
    transition: background .3s ease, color .3s ease, border-color .3s ease;
  }
  .cs-step.active .cs-num {
    background: var(--chk-ink);
    border-color: var(--chk-ink);
    color: #FFFFFF;
  }
  .cs-step.done .cs-num {
    background: var(--chk-accent);
    border-color: var(--chk-accent);
    color: #FFFFFF;
  }

  .cs-label {
    font-size: 11px;
    font-weight: 500;
    letter-spacing: .14em;
    text-transform: uppercase;
    color: var(--chk-faint);
    transition: color .3s ease;
  }
  .cs-step.active .cs-label { color: var(--chk-ink); }
  .cs-step.done .cs-label { color: var(--chk-accent); }

  .cs-line {
    flex: 1;
    height: 1px;
    margin: 0 12px;
    background: var(--chk-line);
  }

  @media (max-width: 720px) {
    .cs-label { display: none; }
    .cs-step { flex: 0 0 auto; }
  }
`;
