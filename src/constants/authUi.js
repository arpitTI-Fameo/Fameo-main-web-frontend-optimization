// constants/authUi.js
// Shared look and motion for the auth pages (register, login): Tailwind class
// fragments for fields and buttons, the page-load entrance classes, and the
// keyframes they run on. AuthShell renders AUTH_KEYFRAMES once per page.
// Everything expects the `.fameo-theme.fameo-fixed-scale` wrapper AuthShell
// provides, so spacing and text utilities are 1:1 px.
//
// Breakpoints: Tailwind's `max-[651px]:` means width < 651px, i.e. the
// handoff's `max-width: 650px`.

export const AUTH_KEYFRAMES = `
  @keyframes frgRise { from { transform: translateY(140%); } to { transform: none; } }
  @keyframes frgInk {
    from { clip-path: inset(-20% 100% -40% 0); filter: blur(4px); }
    to { clip-path: inset(-20% -8% -40% -4%); filter: blur(0); }
  }
  @keyframes frgDraw { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
  @keyframes frgFadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
  @keyframes frgFadeDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: none; } }
  @keyframes frgFadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes frgGrow { from { transform: scaleX(0); } to { transform: scaleX(1); } }
  @keyframes frgRingsIn { from { opacity: 0; transform: scale(.86); } to { opacity: 1; transform: none; } }
  @keyframes frgCardIn { from { opacity: 0; transform: translateY(34px) rotate(-5deg) scale(.95); } to { opacity: 1; transform: none; } }
  @keyframes frgFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-7px); } }
  @keyframes frgSheen {
    0% { transform: translateX(-160%) skewX(-18deg); }
    32%, 100% { transform: translateX(330%) skewX(-18deg); }
  }
  @keyframes frgSpin { to { transform: rotate(360deg); } }
  @keyframes frgSpinRev { to { transform: rotate(-360deg); } }
  @keyframes frgTwinkle {
    0%, 68%, 100% { transform: scale(1) rotate(0); opacity: 1; }
    80% { transform: scale(1.28) rotate(14deg); opacity: .65; }
  }
  @keyframes frgBreathe { 0%, 100% { opacity: 1; } 50% { opacity: .6; } }
  @keyframes frgPop { 0% { transform: scale(.7); } 60% { transform: scale(1.14); } 100% { transform: scale(1); } }
  @keyframes frgTick { from { clip-path: inset(0 100% 0 0); } to { clip-path: inset(0 0 0 0); } }
  @keyframes frgShine { from { transform: translateX(-160%) skewX(-20deg); } to { transform: translateX(320%) skewX(-20deg); } }
  @keyframes frgNudge { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(4px); } }
  @keyframes frgWiggle { 20% { transform: translateX(-4px); } 40% { transform: translateX(4px); } 60% { transform: translateX(-3px); } 80% { transform: translateX(2px); } }
  @keyframes frgRefIn { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: none; } }
  @keyframes frgDrift1 { to { transform: translate(46px, -34px) scale(1.06); } }
  @keyframes frgDrift2 { to { transform: translate(-54px, 30px) scale(1.06); } }
  @keyframes frgDrift3 { to { transform: translate(38px, 28px) scale(1.04); } }

  @media (prefers-reduced-motion: reduce) {
    .frg-motion *, .frg-motion *::before, .frg-motion *::after {
      animation-duration: .01ms !important;
      animation-iteration-count: 1 !important;
      animation-delay: 0s !important;
      transition-duration: .01ms !important;
    }
  }
`;

// Motion tokens, set on the AuthShell root. Named --frg-* because
// Tailwind already owns --ease-out.
export const MOTION_TOKENS = '[--frg-ease:cubic-bezier(.2,.8,.2,1)] [--frg-spring:cubic-bezier(.3,1.7,.5,1)]';

/* Page-load entrance. Each value is a complete animation shorthand (delay
   included), so there is no separate delay class for it to reset. */
export const ENTER = {
  header: 'animate-[frgFadeDown_.7s_var(--frg-ease)_.05s_both]',
  rule: 'before:origin-left before:animate-[frgGrow_.7s_var(--frg-ease)_.15s_both]',
  eyebrowText: 'animate-[frgFadeIn_.8s_ease_.35s_both]',
  line1: 'animate-[frgRise_1s_var(--frg-ease)_.25s_both]',
  line2: 'animate-[frgRise_1s_var(--frg-ease)_.36s_both]',
  ink: 'animate-[frgInk_1s_var(--frg-ease)_.8s_both]',
  swash: 'animate-[frgDraw_.9s_var(--frg-ease)_1.45s_forwards]',
  rings: 'animate-[frgRingsIn_1.2s_var(--frg-ease)_.45s_both]',
  card: 'animate-[frgCardIn_1.1s_var(--frg-ease)_.5s_both]',
  d380: 'animate-[frgFadeUp_.8s_var(--frg-ease)_.38s_both]',
  d420: 'animate-[frgFadeUp_.8s_var(--frg-ease)_.42s_both]',
  d500: 'animate-[frgFadeUp_.8s_var(--frg-ease)_.5s_both]',
  d560: 'animate-[frgFadeUp_.8s_var(--frg-ease)_.56s_both]',
  d620: 'animate-[frgFadeUp_.8s_var(--frg-ease)_.62s_both]',
  d680: 'animate-[frgFadeUp_.8s_var(--frg-ease)_.68s_both]',
  d740: 'animate-[frgFadeUp_.8s_var(--frg-ease)_.74s_both]',
  d800: 'animate-[frgFadeUp_.8s_var(--frg-ease)_.8s_both]',
  d860: 'animate-[frgFadeUp_.8s_var(--frg-ease)_.86s_both]',
  footer: 'animate-[frgFadeIn_.8s_ease_.86s_both]',
};

// Portal content (Select, Popover, Dialog) renders outside AuthShell.
export const PORTAL_THEME = 'fameo-theme fameo-fixed-scale';

// Input, Textarea, and the look shared by every field-shaped trigger.
export const INPUT = [
  'h-11.25 rounded-[9px] border-border bg-muted/50 px-3 text-xs text-foreground shadow-none md:text-xs max-[651px]:text-base',
  'placeholder:text-muted-foreground/60 disabled:opacity-60',
  'transition-[border-color,background-color,box-shadow] duration-250',
  'focus:border-primary focus:bg-background focus:ring-4 focus:ring-primary/11 focus:placeholder:text-muted-foreground/30',
  'focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/11',
  'aria-invalid:border-primary/45 aria-invalid:ring-0 aria-invalid:focus:ring-4',
].join(' ');

// shadcn InputGroup dressed as one field; its control is borderless inside.
export const GROUP = [
  'h-11.25 rounded-[9px] border-border bg-muted/50 shadow-none',
  'transition-[border-color,background-color,box-shadow] duration-250',
  'focus-within:border-primary focus-within:bg-background focus-within:ring-4 focus-within:ring-primary/11',
  'has-[[data-slot=input-group-control]:focus-visible]:border-primary has-[[data-slot=input-group-control]:focus-visible]:bg-background has-[[data-slot=input-group-control]:focus-visible]:ring-4 has-[[data-slot=input-group-control]:focus-visible]:ring-primary/11',
  'has-[[data-slot][aria-invalid=true]]:border-primary/45 has-[[data-slot][aria-invalid=true]]:ring-0',
  'pointer-coarse:h-auto pointer-coarse:min-h-11.25',
].join(' ');

export const GROUP_INPUT = 'h-full px-3 text-xs text-foreground md:text-xs max-[651px]:text-base placeholder:text-muted-foreground/60 focus:placeholder:text-muted-foreground/30 disabled:opacity-60';

// Primary call to action (Continue / Submit / Verify).
export const PRIMARY = [
  'h-auto min-h-10.75 gap-6 rounded-[10px] px-5.5 py-3 text-xs leading-[21px] font-medium has-[>svg]:px-5.5',
  'shadow-[0_5px_12px_rgb(233_30_99/0.07)] transition-[background-color,translate,opacity] duration-180',
  'hover:-translate-y-px disabled:translate-y-0 disabled:opacity-60 [&_svg:not([class*=size-])]:size-4 [&_svg]:stroke-[1.65]',
  'max-[371px]:gap-3.75 max-[371px]:px-4.25 max-[371px]:has-[>svg]:px-4.25',
].join(' ');

// Quiet text button (Back, Resend). Used with <Button variant="link">.
export const PLAIN = 'h-auto min-h-9 gap-1.75 px-0 py-2 text-xs font-normal text-brand-muted has-[>svg]:px-0 hover:text-brand-text hover:no-underline [&_svg:not([class*=size-])]:size-4 [&_svg]:stroke-[1.65]';

// A link-styled Button that sits inside a sentence (policy names, note actions).
export const INLINE_LINK = 'h-auto p-0 align-baseline text-[length:inherit] leading-[inherit] font-normal text-brand-text underline-offset-2';

// Small print under a field or section.
export const HINT = 'mt-1.75 text-10 leading-[1.6] text-muted-foreground/85';

export const HINT_ERROR = 'mt-1.75 text-10 leading-[1.6] text-accent-foreground';
