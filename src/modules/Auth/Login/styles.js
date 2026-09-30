// modules/Auth/Login/styles.js
// Login-only Tailwind fragments. The shared field, button and motion
// fragments live in @/constants/authUi; these only size them to the login
// handoff (47px fields, 13px text, 16px icons, a 46px full-width action).

// One field: shadcn InputGroup with an icon addon on the left.
export const FIELD = 'h-11.75 max-[651px]:h-11.75';
export const FIELD_ICON = 'pr-0 pl-3.25 text-[#B098BD] [&>svg]:size-4 [&>svg]:stroke-[1.65]';
export const FIELD_INPUT = 'pl-2.5 text-13 text-[#493853] md:text-13 max-[651px]:text-base placeholder:text-[#B0A5B8]';

// Show / hide password (InputGroupButton).
export const REVEAL = 'size-9.5 rounded-md text-[#A791B0] hover:bg-accent hover:text-brand-text [&_svg]:size-4 [&_svg]:stroke-[1.65] pointer-coarse:size-11';

// The Sign in action: full width, a little taller than the register CTA.
export const SIGN_IN = 'mt-6 min-h-11.5 w-full gap-5 px-4.5';

// The two silver rings (CSS artwork from the handoff). The border is the ring;
// the mask cuts the middle out so only the conic-gradient band shows.
export const RING = [
  'absolute h-43 w-31.25 rounded-[50%] border-[23px] border-transparent',
  '[-webkit-mask:linear-gradient(#fff_0_0)_padding-box,linear-gradient(#fff_0_0)] [-webkit-mask-composite:xor] [mask:linear-gradient(#fff_0_0)_padding-box_exclude,linear-gradient(#fff_0_0)]',
  'drop-shadow-[0_14px_12px_#927D9F2B] transition-transform duration-500 ease-[cubic-bezier(.2,.7,.2,1)]',
].join(' ');
export const RING_ONE_BG = '[background:conic-gradient(from_22deg,#D3C9DD,#FBF9FE_14%,#C0B4CD_28%,#EEE8F3_41%,#FEFCFF_51%,#CEC1DA_69%,#F9F6FC_85%,#D3C9DD)_border-box]';
export const RING_TWO_BG = '[background:conic-gradient(from_210deg,#D8CADF,#FEFCFF_20%,#CEBFD7_34%,#F7F0F7_47%,#BCAAC7_64%,#F9F7FC_80%,#D8CADF)_border-box]';
