export const S = `
.rng-wrap {
  width: 100%;
  padding: 10px 0;
  user-select: none;
}
.rng-labels {
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;
  font-family: 'Schibsted Grotesk', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: var(--ink, #1A1A1A);
}
.rng-track-wrap {
  position: relative;
  height: 24px;
  display: flex;
  align-items: center;
  cursor: pointer;
}
.rng-track-bg {
  position: absolute;
  left: 0; right: 0;
  height: 2px;
  background: var(--line, #E4E4E7);
  border-radius: 1px;
}
.rng-track-fill {
  position: absolute;
  height: 2px;
  background: var(--ink, #1A1A1A);
  border-radius: 1px;
}
.rng-thumb {
  position: absolute;
  top: 50%;
  width: 20px;
  height: 20px;
  background: var(--ink, #1A1A1A);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  cursor: grab;
  touch-action: none;
  box-shadow: 0 2px 6px rgba(0,0,0,0.2);
}
.rng-thumb:active {
  cursor: grabbing;
  transform: translate(-50%, -50%) scale(1.1);
}
`;
