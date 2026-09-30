# Fameo theme for shadcn/ui

Matches the approved Resources preview: white background, primary #E91E63,
silver supporting surfaces, DM Sans and DM Serif Display italic accents.

Target: an existing React + shadcn/ui project using **Tailwind CSS v4**.
The root-layout example uses **Next.js App Router**. The provider also works
in a Vite React app; instructions are below. This is a theme integration kit,
not the complete Resources page or a standalone app.

## Install

1. Run `npm install next-themes` using your project's existing package manager.
2. Copy `components/fameo-theme-provider.tsx` into your components directory.
3. Copy `styles/fameo-theme.css` into your styles directory.
4. Copy the contents of `public/fonts/fameo/` into the same public path in your app.
   These are bundled fonts, so there is no Google Fonts runtime request.
5. In your existing global CSS, add this import after the existing imports
   (adjust the relative path). All CSS imports must stay before other rules:

   ```css
   @import "tailwindcss";
   /* Keep your existing shadcn/animation imports here. */
   @import "../styles/fameo-theme.css";
   ```

6. Replace the old shadcn color-token `:root` and `.dark` blocks and overlapping
   `@theme inline` mappings with the supplied theme. Do not retain a second set
   of conflicting color/font/radius mappings below it. Keep unrelated CSS,
   animation definitions and custom application tokens.
7. In `components.json`, keep existing settings and ensure
   `tailwind.cssVariables` is `true`. Do not replace the entire file.
8. Merge `examples/next-layout.tsx` into your layout. Replace an existing
   next-themes provider rather than nesting another one. Preserve your other
   providers and metadata. Keep `className="light"` on `<html>` for SSR and
   `suppressHydrationWarning` because next-themes manages the root class.

If your app uses `src/`, adjust import paths accordingly. If you already apply
a different `next/font` class to `<body>`, remove that conflicting class or
switch it to the same DM fonts. If deployed under a base path, update the
`/fonts/fameo/...` font URLs in the CSS.

## Vite React

Use the same CSS and provider. Import global CSS once in `src/main.tsx`, and
wrap `<App />` with `<FameoThemeProvider>`. Set `class="light"` on the `<html>`
element in `index.html`; the provider manages that class afterward. No Next.js
imports are used by the provider. Replace the `@/` alias in the example if your
project uses different imports.

## What is automatic

Standard token-based shadcn buttons, inputs, cards, menus, dialogs, selects,
tabs, badges and focus rings inherit the colors. Tokens are on the document
root, so portaled dialogs and dropdowns inherit them too. Font family inherits
from the body. Border radii inherit through the registered Tailwind radius scale.

Hardcoded classes such as `bg-blue-600`, `text-black`, inline colors, or a
component-specific font will override the theme; replace those with semantic
classes like `bg-primary`, `text-foreground`, and `font-sans`.

The provider enforces light mode. System dark mode and a previously saved dark
preference cannot change this design. Remove or hide an existing theme toggle
while light mode is forced. For a nonce-based CSP, pass your request nonce to
`<FameoThemeProvider nonce={nonce}>`.

## Design-specific classes

| Intent | Class |
| --- | --- |
| Main action | Standard `<Button>` / `bg-primary text-primary-foreground` |
| Strong small rose text | `text-brand-text` |
| Serif editorial accent | `font-serif italic text-primary` |
| Soft selected surface | `bg-accent text-accent-foreground` |
| Silver surface | `bg-secondary text-secondary-foreground` |
| Silver shine | `bg-silver-sheen` |
| Subtle panel shadow | `shadow-fameo-soft` |
| Rose action shadow | `shadow-fameo-rose` |
| Custom exact hover | `hover:bg-primary-hover` |

Small rose text uses a darker supporting token for readability. The primary
brand color remains exactly #E91E63. Decorative serif typography is opt-in:
do not apply it to every form label, menu or heading. No global animations are
added. Use a short `transition-colors duration-200 motion-reduce:transition-none`
where needed. The theme does not set component heights, page spacing, photo
crops, layout or content; those remain in your page/component code.

`examples/theme-demo.tsx` demonstrates standard shadcn usage. It requires
Button, Input, Badge and Card in your project; it is optional, not an app page.

## Tailwind v3

Do not paste this v4 stylesheet unchanged into a v3 project. V3 requires token
registration in `tailwind.config` and older shadcn components commonly wrap
color values in `hsl(...)`. This kit uses complete hex color values with v4
`@theme inline`. Confirm your Tailwind major version in package.json first.

## Verification

Check one primary button, secondary button, input focus ring, dropdown,
portaled dialog and serif heading after integration. Primary should be #E91E63,
page background #FFFFFF, text #28252C. Test with OS dark mode enabled: Fameo
should stay light. Check the browser Network panel for successful local font
loads. Theme token references and bundled font paths have been checked; this kit has not been built inside
your project because your project files were not supplied.

## Sources and licensing

- shadcn theming: https://ui.shadcn.com/docs/theming
- Official next-themes integration: https://ui.shadcn.com/docs/dark-mode/next
- Tailwind v4 guidance: https://ui.shadcn.com/docs/tailwind-v4

The DM Sans and DM Serif Display font licenses are included in `licenses/`.
Retain those licenses when distributing the bundled font files.
