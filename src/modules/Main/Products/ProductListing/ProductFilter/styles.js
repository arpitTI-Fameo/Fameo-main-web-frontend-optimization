export const S = `
.fm-wrap {
  display: flex;
  flex-direction: column;
  gap: 32px;
}
.fm-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
  border-bottom: 1px solid #F4F4F5;
  padding-bottom: 32px;
}
.fm-section:last-child {
  border-bottom: none;
  padding-bottom: 0;
}
.fm-subtitle {
  font-family: 'Schibsted Grotesk', sans-serif;
  font-size: 15px;
  font-weight: 500;
  color: var(--ink, #1A1A1A);
  margin: 0;
}
.fm-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.fm-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 50px;
  background: var(--card, #F4F4F5);
  color: var(--ink, #1A1A1A);
  font-family: 'Schibsted Grotesk', sans-serif;
  font-size: 14px;
  font-weight: 400;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease;
}
.fm-pill:hover {
  background: #E4E4E7;
}
.fm-pill.on {
  background: var(--ink, #1A1A1A);
  color: #FFFFFF;
}
.fm-color-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: inline-block;
}
.fm-color-dot.has-border {
  border: 1px solid #E4E4E7;
}
.fm-pill.on .fm-color-dot.has-border {
  border-color: #3F3F46;
}
.fm-price-slider {
  padding: 0 8px;
}
.fm-footer {
  position: sticky;
  bottom: -24px;
  background: var(--card, #FBFAF7);
  padding: 16px 0 24px;
  margin-top: -16px;
  border-top: 1px solid #F4F4F5;
  z-index: 10;
}
.fm-apply-btn {
  width: 100%;
  padding: 18px;
  border-radius: 50px;
  background: #3F3F3F;
  color: #FFFFFF;
  font-family: 'Schibsted Grotesk', sans-serif;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.05em;
  border: none;
  cursor: pointer;
  transition: background 0.2s;
}
.fm-apply-btn:hover {
  background: var(--ink, #1A1A1A);
}
`;
