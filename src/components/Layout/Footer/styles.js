export const S = `
  @keyframes tssOPop {
    from { transform: scale(.5); opacity: 0; }
    to   { transform: scale(1);  opacity: 1; }
  }
  @keyframes tssODraw {
    0%  { stroke-dashoffset: 1; }
    45% { stroke-dashoffset: 0; }
    100%{ stroke-dashoffset: 0; }
  }
`;
