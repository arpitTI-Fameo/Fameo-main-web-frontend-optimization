export const S = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=Jost:wght@300;400;500;600&display=swap');

  .ph-wrap {
    width: 100%;
    max-width: 1440px;
    margin: 0 auto 40px;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 24px;
  }

  .ph-left {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .ph-eyebrow {
    font-family: 'Jost', sans-serif;
    font-size: clamp(12px, 1.5vw, 14px);
    font-weight: 500;
    letter-spacing: 0.05em;
    color: var(--ink-muted, #54545E);
    margin: 0 0 8px 4px;
    text-transform: capitalize;
  }

  .ph-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(36px, 4.2vw, 56px);
    font-weight: 400;
    line-height: 1.1;
    color: var(--ink, #111118);
    margin: 0;
    letter-spacing: -0.01em;
  }

  .ph-title em {
    font-style: italic;
    font-weight: 300;
    /* You can apply gradient here if requested, but image shows solid dark text for both */
    color: var(--ink, #111118);
  }

  .ph-right {
    flex-shrink: 0;
    margin-bottom: 8px; /* Align slightly above the baseline of the huge title */
  }

  .ph-link {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(16px, 1.8vw, 18px);
    font-weight: 500;
    color: var(--rose, #DD8164);
    transition: opacity 0.25s ease;
  }

  .ph-link:hover {
    opacity: 0.7;
  }

  .ph-deco {
    display: flex;
    align-items: center;
  }

  .ph-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    border: 1px solid var(--rose, #DD8164);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .ph-dot::after {
    content: '';
    width: 4px;
    height: 4px;
    background: var(--rose, #DD8164);
    border-radius: 50%;
  }

  .ph-line {
    width: 40px;
    height: 1px;
    background: var(--rose, #DD8164);
    margin-left: -1px; /* Connect seamlessly to the circle */
    transition: width 0.3s cubic-bezier(0.22, 1, 0.36, 1);
  }

  .ph-link:hover .ph-line {
    width: 60px;
  }

  @media (max-width: 640px) {
    .ph-wrap {
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
      margin-bottom: 28px;
    }
    .ph-right { margin-bottom: 0; }
  }
`;
