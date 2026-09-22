export const S = `
  .fav-page {
    background: #FFFFFF;
    padding-top: 64px;
    min-height: calc(100vh - 128px);
  }
  
  .fav-content {
    padding: clamp(40px, 6vh, 80px) 0;
  }

  .fav-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
  }

  .fav-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 24px;
  }

  .fav-empty {
    text-align: center;
    padding: 60px 20px;
    max-width: 480px;
    margin: 0 auto;
  }
  .fav-empty-icon {
    font-size: 48px;
    color: #D4D4D8;
    margin-bottom: 24px;
  }
  .fav-empty h2 {
    font-family: 'Cormorant Garamond', serif;
    font-size: 32px;
    font-weight: 500;
    color: #111118;
    margin: 0 0 12px;
  }
  .fav-empty p {
    font-size: 15px;
    color: #71717A;
    line-height: 1.6;
    margin: 0 0 32px;
  }
  .fav-empty-cta {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 14px 32px;
    background: #111118;
    color: #FFFFFF;
    font-size: 14px;
    font-weight: 500;
    border-radius: 999px;
    text-decoration: none;
    transition: background 0.2s, transform 0.2s;
  }
  .fav-empty-cta:hover {
    background: #000000;
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    .fav-grid {
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 16px;
    }
  }
  
  @media (max-width: 480px) {
    .fav-grid {
      grid-template-columns: 1fr;
    }
  }
`;
