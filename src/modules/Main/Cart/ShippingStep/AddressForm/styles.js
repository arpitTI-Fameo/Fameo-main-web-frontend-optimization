export const S = `
  .caf-form {
    margin-top: 18px;
    padding: clamp(18px, 2.6vh, 26px);
    border: 1px solid var(--ct-line);
    border-radius: 16px;
    background: #FFFFFF;
    max-width: 680px;
    animation: cafIn .3s cubic-bezier(.22,1,.36,1) both;
  }
  @keyframes cafIn { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: none; } }

  .caf-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px 16px;
  }
  .caf-field { display: grid; gap: 6px; min-width: 0; }
  .caf-field.is-wide { grid-column: 1 / -1; }

  .caf-label {
    font-size: 11px;
    font-weight: 500;
    letter-spacing: .06em;
    color: var(--ct-muted);
  }

  .caf-input {
    width: 100%;
    min-height: 44px;
    padding: 10px 15px;
    border-radius: 10px;
    border: 1px solid var(--ct-line);
    background: #FFFFFF;
    font: inherit;
    font-size: 13.5px;
    color: var(--ct-ink);
    transition: border-color .2s ease;
  }
  .caf-input:focus { outline: none; border-color: var(--ct-ink); }
  .caf-input.is-bad { border-color: var(--ct-danger); }

  .caf-error {
    margin: 0;
    font-size: 11.5px;
    color: var(--ct-danger);
  }

  .caf-actions {
    margin-top: 20px;
    display: flex;
    gap: 10px;
    justify-content: flex-end;
  }

  .caf-cancel, .caf-save {
    appearance: none;
    font: inherit;
    font-size: 13px;
    font-weight: 500;
    min-height: 44px;
    padding: 12px 26px;
    border-radius: 999px;
    cursor: pointer;
    transition: background .2s ease, color .2s ease, border-color .2s ease;
  }
  .caf-cancel {
    border: 1px solid var(--ct-line);
    background: transparent;
    color: var(--ct-soft);
  }
  .caf-cancel:hover { border-color: var(--ct-ink); color: var(--ct-ink); }
  .caf-save {
    border: 1px solid var(--ct-ink);
    background: var(--ct-ink);
    color: #FFFFFF;
  }
  .caf-save:hover { background: #2B2B33; border-color: #2B2B33; }
  .caf-cancel:focus-visible, .caf-save:focus-visible {
    outline: 1px solid var(--ct-ink);
    outline-offset: 2px;
  }

  @media (max-width: 560px) {
    .caf-grid { grid-template-columns: minmax(0, 1fr); }
    .caf-field.is-wide { grid-column: auto; }
    .caf-actions { flex-direction: column-reverse; }
  }
`;
