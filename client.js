/**
 * Client half of `dsh-umbrella-theme` — the black-and-red Umbrella
 * Corporation theme for the Harness Web UI.
 *
 * Two jobs, both registered as effects on the plugin's own context:
 *
 *   1. Stack one alias-token override layer over the active built-in theme, so
 *      the palette is live without touching the user's theme preference.
 *   2. Render the corporate mark as artwork — the sidebar brand mark, the
 *      blank-session hero mark, and an ambient frame-wide HUD layer.
 *
 * All artwork draws with literal colors (the skill permits artwork its own
 * colors); every container, control and text token comes from the override
 * layer, so a renamed token degrades the artwork but never blank rendering.
 */
window.__ModuleLoader__.load({
  id: 'dsh-umbrella-theme',
  factory(require) {
    const React = require('react');
    const h = React.createElement;

    /** Override-layer identity. One layer per source, replaced on re-register. */
    const SOURCE = 'dsh-umbrella-theme';

    /**
     * A single slot seats exactly one active entry and the shipped occupant
     * registers at priority 0; this baseline ordered the seat by the lower
     * priority. A negative value therefore takes the seat without disposing the
     * shipped entry, so removing this layer hands the seat straight back.
     */
    const PREEMPT = -1000;

    /* ------------------------------------------------------------- palette -- */

    const RED = '#E4002B';
    const RED_HI = '#FF2D3F';
    const RED_DEEP = '#7A0018';
    const INK = '#04050A';
    const SURFACE_1 = '#0A0C12';
    const SURFACE_2 = '#12141C';
    const OVERLAY = '#08090F';
    const SIDEBAR = '#02030A';
    const HAIRLINE_1 = 'rgba(228, 0, 43, 0.30)';
    const HAIRLINE_2 = 'rgba(228, 0, 43, 0.55)';
    const TEXT_1 = '#EDEFF3';
    const TEXT_2 = '#98A0AE';
    const ERROR = '#FF3B47';
    const IDLE = '#5E6673';
    const SUCCESS = '#2FC98A';
    const WARN = '#FFB020';

    /**
     * Light segment of the corporate mark. The Umbrella logo is red-and-white;
     * set this to `#1A1D24` for a strictly red-on-black mark.
     */
    const LOGO_LIGHT = '#FFFFFF';
    const LOGO_LIGHT_STROKE = '#FFFFFF';

    /**
     * HUD wordmark. This is part of the artwork — a corporate brand name, not
     * localizable interface copy — so it is a literal, like the mark itself.
     */
    const WORDMARK = 'UMBRELLA CORP.';

    /**
     * Every alias token the Theme provider reports as overridable. The built-in
     * base stylesheets still carry the light palette; both modes intentionally
     * resolve to the same black-and-red identity so the theme reads the same
     * whatever the OS colour scheme is.
     */
    const TOKENS = {
      '--dsw-alias-bg-base': { light: "#FFFFFF", dark: "#05060B" },
      '--dsw-alias-bg-document-preview': { light: "#F7F8FA", dark: "#0A0C12" },
      '--dsw-alias-bg-document-selection': { light: "color-mix(in srgb,#E4002B 18%,transparent)", dark: "color-mix(in srgb,#E4002B 30%,transparent)" },
      '--dsw-alias-bg-layer-1': { light: "#F7F8FA", dark: "#0A0C12" },
      '--dsw-alias-bg-layer-2': { light: "#F1F3F5", dark: "#0E1017" },
      '--dsw-alias-bg-layer-3': { light: "#EAEDF0", dark: "#13161F" },
      '--dsw-alias-bg-mask-1': { light: "#0000003d", dark: "#000000A6" },
      '--dsw-alias-bg-mask-2': { light: "#0000001f", dark: "#00000066" },
      '--dsw-alias-bg-mask-3': { light: "#0000007a", dark: "#0000007A" },
      '--dsw-alias-bg-mask-drop': { light: "#ffffffb3", dark: "#0E1017C0" },
      '--dsw-alias-bg-mask-photo': { light: "#000000e0", dark: "#000000E0" },
      '--dsw-alias-bg-module-platform': { light: "#F7F8FA", dark: "#13161F" },
      '--dsw-alias-bg-multi-select': { light: "#F1F3F5", dark: "#181C26" },
      '--dsw-alias-bg-overlay': { light: "#FFFFFF", dark: "#0E1017" },
      '--dsw-alias-bg-skeleton': { light: "#0000000a", dark: "#FFFFFF14" },
      '--dsw-alias-border-inverted': { light: "#0000", dark: "#FFFFFF12" },
      '--dsw-alias-border-inverted2': { light: "#0000", dark: "#FFFFFF1F" },
      '--dsw-alias-border-l1': { light: "#E4002B1F", dark: "#E4002B26" },
      '--dsw-alias-border-l2': { light: "#E4002B33", dark: "#E4002B3D" },
      '--dsw-alias-border-l2-darkmode-thin': { light: "#E4002B1F", dark: "#E4002B26" },
      '--dsw-alias-border-l3': { light: "#E4002B47", dark: "#E4002B4D" },
      '--dsw-alias-border-l4': { light: "#E4002B5C", dark: "#E4002B66" },
      '--dsw-alias-brand-primary': { light: "#E4002B", dark: "#E4002B" },
      '--dsw-alias-brand-primary-invert': { light: "#FFFFFF", dark: "#FFFFFF" },
      '--dsw-alias-brand-primary-new-colorprimary-new-color': { light: "#E4002B", dark: "#E4002B" },
      '--dsw-alias-brand-text': { light: "#FFFFFF", dark: "#FFFFFF" },
      '--dsw-alias-button-contrast-fill': { light: "var(--dsw-static-neutral-bluish-700)", dark: "#C7F7D8" },
      '--dsw-alias-button-elevated-fill': { light: "var(--dsw-static-neutral-bluish-00)", dark: "#1A1116" },
      '--dsw-alias-button-floating-fill': { light: "var(--dsw-static-neutral-bluish-00)", dark: "#13161F" },
      '--dsw-alias-button-floating-hover': { light: "var(--dsw-static-neutral-bluish-75)", dark: "#181C26" },
      '--dsw-alias-button-ghost-active-border': { light: "var(--dsw-static-neutral-bluish-500)", dark: "#6E0A19" },
      '--dsw-alias-button-ghost-active-fill': { light: "var(--dsw-static-neutral-bluish-100)", dark: "#1E222D" },
      '--dsw-alias-button-ghost-active-hover': { light: "var(--dsw-static-neutral-bluish-150)", dark: "#262A36" },
      '--dsw-alias-button-info-fill': { light: "#E4002B", dark: "#E4002B" },
      '--dsw-alias-button-info-hover': { light: "#C9001F", dark: "#FF2D3F" },
      '--dsw-alias-button-primary-dimmed': { light: "#F6C6CE", dark: "#4A0410" },
      '--dsw-alias-button-primary-fill': { light: "var(--dsw-alias-brand-primary)", dark: "var(--dsw-alias-brand-primary)" },
      '--dsw-alias-button-primary-hover': { light: "#C9001F", dark: "#FF2D3F" },
      '--dsw-alias-button-tool-bar-fill': { light: "#54555780", dark: "#54555780" },
      '--dsw-alias-button-tool-bar-fill-invisible': { light: "#1f1f1f5c", dark: "#1f1f1f5c" },
      '--dsw-alias-button-tool-bar-hover': { light: "#54555799", dark: "#54555799" },
      '--dsw-alias-code-diff-added': { light: "var(--dsw-static-green-500-a08)", dark: "var(--dsw-static-green-500-a12)" },
      '--dsw-alias-code-diff-deleted': { light: "var(--dsw-static-red-600-a08)", dark: "var(--dsw-static-red-400-a12)" },
      '--dsw-alias-file-diff-added-bg': { light: "#e6f4e7", dark: "#1f3124" },
      '--dsw-alias-file-diff-added-gutter': { light: "#edf7ed", dark: "#132016" },
      '--dsw-alias-file-diff-added-marker': { light: "#01a241", dark: "#41c977" },
      '--dsw-alias-file-diff-deleted-bg': { light: "#fce6e2", dark: "#3c1f1b" },
      '--dsw-alias-file-diff-deleted-gutter': { light: "#fdece9", dark: "#28130e" },
      '--dsw-alias-file-diff-deleted-marker': { light: "#ba2723", dark: "#fa423e" },
      '--dsw-alias-interactive-bg-active': { light: "#2631481a", dark: "#E4002B33" },
      '--dsw-alias-interactive-bg-hover': { light: "#2631480f", dark: "#FFFFFF14" },
      '--dsw-alias-interactive-bg-hover-accent': { light: "#26314824", dark: "#E4002B2E" },
      '--dsw-alias-interactive-bg-hover-danger': { light: "#ec13130d", dark: "#FF3B4726" },
      '--dsw-alias-interactive-bg-hover-solid': { light: "var(--dsw-static-neutral-bluish-75)", dark: "#181C26" },
      '--dsw-alias-label-caption': { light: "var(--dsw-static-neutral-bluish-600)", dark: "#55A96F" },
      '--dsw-alias-label-deep-diving': { light: "#C4001F", dark: "color-mix(in srgb,#E4002B 60%,#8A93A2)" },
      '--dsw-alias-label-deep-diving-shimmer': { light: "color-mix(in srgb,#C4001F 55%,transparent)", dark: "color-mix(in srgb,#FF6B78 70%,#DDE1E8)" },
      '--dsw-alias-label-dimmed': { light: "var(--dsw-static-neutral-bluish-400)", dark: "#47905F" },
      '--dsw-alias-label-document-preview': { light: "var(--dsw-static-neutral-bluish-700)", dark: "#66C688" },
      '--dsw-alias-label-primary': { light: "var(--dsw-static-neutral-bluish-1000)", dark: "#8CEBAA" },
      '--dsw-alias-label-primary-bluish': { light: "var(--dsw-static-neutral-bluish-1000)", dark: "#8CEBAA" },
      '--dsw-alias-label-primary-dimmed': { light: "var(--dsw-static-neutral-bluish-950)", dark: "#79D79A" },
      '--dsw-alias-label-primary-foreground': { light: "var(--dsw-static-neutral-bluish-00)", dark: "#FFFFFF" },
      '--dsw-alias-label-primary-inverted': { light: "var(--dsw-static-neutral-bluish-00)", dark: "#04120A" },
      '--dsw-alias-label-secondary': { light: "var(--dsw-static-neutral-bluish-700)", dark: "#66C688" },
      '--dsw-alias-label-shimmer': { light: "color-mix(in srgb,#0F1115 45%,transparent)", dark: "color-mix(in srgb,#8CEBAA 45%,transparent)" },
      '--dsw-alias-label-tertiary': { light: "var(--dsw-static-neutral-bluish-600)", dark: "#57A874" },
      '--dsw-alias-link': { light: "#C4001F", dark: "#FF2D3F" },
      '--dsw-alias-markdown-citation': { light: "#F2F4F7", dark: "#12241A" },
      '--dsw-alias-markdown-code-block': { light: "#F4F6F8", dark: "#05100A" },
      '--dsw-alias-markdown-code-block-banner': { light: "#FBF0F2", dark: "#0A1810" },
      '--dsw-alias-markdown-code-segment-selected': { light: "#E9EDF1", dark: "#14281B" },
      '--dsw-alias-markdown-code-segment-unselected': { light: "#F4F6F8", dark: "#05100A" },
      '--dsw-alias-markdown-inline-code': { light: "#EDF0F3", dark: "#0F2116" },
      '--dsw-alias-markdown-placeholder': { light: "#F4F6F8", dark: "#0A1810" },
      '--dsw-alias-markdown-tag': { light: "#F4F6F8", dark: "#0A1810" },
      '--dsw-alias-menu-group-header-fill': { light: "#f8f9faf0", dark: "#13161FF0" },
      '--dsw-alias-menu-icon': { light: "var(--dsw-static-neutral-bluish-800)", dark: "#55A96F" },
      '--dsw-alias-scrollbar-bg-l1': { light: "var(--dsw-static-neutral-200)", dark: "#1E222D" },
      '--dsw-alias-scrollbar-bg-l2': { light: "var(--dsw-static-neutral-200)", dark: "#1E222D" },
      '--dsw-alias-scrollbar-hover-l1': { light: "var(--dsw-static-neutral-300)", dark: "#6E0A19" },
      '--dsw-alias-scrollbar-hover-l2': { light: "var(--dsw-static-neutral-300)", dark: "#4A0410" },
      '--dsw-alias-state-business-primary': { light: "#E4002B", dark: "#FF2D3F" },
      '--dsw-alias-state-business-tertiary': { light: "var(--dsw-static-deepseek-100)", dark: "#4A0410" },
      '--dsw-alias-state-error-primary': { light: "var(--dsw-static-red-600)", dark: "#FF3B47" },
      '--dsw-alias-state-error-secondary': { light: "var(--dsw-static-red-400)", dark: "#FF8089" },
      '--dsw-alias-state-idle-primary': { light: "var(--dsw-static-neutral-300)", dark: "#5E6673" },
      '--dsw-alias-state-success-primary': { light: "#0E7A45", dark: "#2FC98A" },
      '--dsw-alias-state-success-secondary': { light: "var(--dsw-static-green-400)", dark: "#3FD69B" },
      '--dsw-alias-state-success-tertiary': { light: "var(--dsw-static-green-100)", dark: "#123A2C" },
      '--dsw-alias-state-warn-label': { light: "#8A5300", dark: "#FFB020" },
      '--dsw-alias-state-warn-primary': { light: "var(--dsw-static-amber-500)", dark: "#FFB020" },
      '--dsw-alias-state-warn-secondary': { light: "var(--dsw-static-amber-400)", dark: "#FFC861" },
      '--dsw-alias-state-warn-tertiary': { light: "var(--dsw-static-amber-100)", dark: "#3A2A08" },
      '--dsw-alias-switch-thumb': { light: "#FFFFFF", dark: "#B7F5CB" },
      '--dsw-alias-toast-bg': { light: "var(--dsw-static-neutral-bluish-800)", dark: "#1E222D" },
      '--dsw-alias-toast-label': { light: "var(--dsw-static-neutral-bluish-00)", dark: "#8CEBAA" },
      '--dsw-alias-tooltip-bg': { light: "var(--dsw-static-neutral-bluish-850)", dark: "#1E222D" },
      '--dsw-alias-tooltip-key-bg': { light: "color-mix(in srgb, var(--dsw-alias-tooltip-bg), white 18%)", dark: "color-mix(in srgb, var(--dsw-alias-tooltip-bg), white 18%)" },
      '--dsw-alias-turn-trigger-bg': { light: "var(--dsw-alias-markdown-code-block)", dark: "#FFFFFF14" },
      '--dsw-alias-turn-trigger-bg-hover': { light: "var(--dsw-alias-interactive-bg-hover)", dark: "#FFFFFF24" },
      '--dsw-menu-surface-fill': { light: "#f8f9fa94", dark: "#12141CE8" },
      '--dsw-specific-bubble': { light: "#FCEDF0", dark: "#1A1116" },
      '--dsw-specific-bubble-highlight': { light: "#F9DDE3", dark: "#2A1119" },
      '--dsw-specific-input-major': { light: "var(--dsw-static-neutral-bluish-00)", dark: "#0E1017" },
      '--dsw-specific-login-input': { light: "var(--dsw-static-neutral-bluish-50)", dark: "#0A0C12" },
      '--dsw-specific-menu': { light: "var(--dsw-menu-surface-fill)", dark: "var(--dsw-menu-surface-fill)" },
      '--dsw-specific-selector': { light: "var(--dsw-static-neutral-bluish-60)", dark: "#13161F" },
      '--dsw-specific-sidebar-fill': { light: "var(--dsw-static-neutral-bluish-75)", dark: "#03040A" },
      '--dsw-specific-sidebar-nav-item-active': { light: "var(--dsw-static-neutral-bluish-150)", dark: "#1A1116" },
      '--dsw-specific-sidebar-nav-item-active-accent': { light: "#E4002B24", dark: "#E4002B26" },
      '--dsw-specific-sidebar-nav-item-hover': { light: "var(--dsw-static-neutral-bluish-100)", dark: "#FFFFFF14" },
      '--dsw-specific-tip': { light: "var(--dsw-static-neutral-bluish-60)", dark: "#13161F" },
    };
    /* ------------------------------------------------------------ geometry -- */

    const APEX_X = 150;
    const APEX_Y = 140;
    const R_TIP = 146;
    /** Control radius that pulls each panel's outer edge inward, to r = 121. */
    const R_SCALLOP = 107.1;
    /** Panel outline only. The watermark renders at 720px, where the old 2.2-unit
     *  stroke came out 5px thick and read as a chunky pinwheel rather than a canopy;
     *  1.2 reads as the seam BETWEEN panels and nothing else. */
    const PANEL_STROKE = 1.2;
    /** Ripple control radius of the one unbroken outline around the rim. */
    const R_RIM = R_SCALLOP;
    /** Ferrule at the apex. */
    const R_HUB = 8.6;

    const round = (value) => Math.round(value * 10) / 10;
    const at = (radius, angle) =>
      round(APEX_X + radius * Math.cos(angle)) +
      ' ' +
      round(APEX_Y + radius * Math.sin(angle));

    /**
     * Eight equal panels of the canopy, converging on the apex. Even indices are
     * red, odd indices light: the alternating eight-segment mark. Each panel's
     * outer edge is one quadratic that sags to r = 121 between its r = 146
     * corners, which is the canopy ripple.
     */
    const PANELS = [];
    for (let index = 0; index < 8; index += 1) {
      const from = ((-90 + index * 45) * Math.PI) / 180;
      const to = ((-90 + (index + 1) * 45) * Math.PI) / 180;
      PANELS.push({
        red: index % 2 === 0,
        d:
          'M' + APEX_X + ' ' + APEX_Y +
          'L' + at(R_TIP, from) +
          'Q' + at(R_SCALLOP, (from + to) / 2) + ' ' + at(R_TIP, to) +
          'Z',
      });
    }

    /* Each panel carries nothing but its own fill and its own outline: the outline IS the
       seam to its neighbours, so the eight wedges read as a canopy without a single line
       crossing the inside of a petal. Earlier builds painted a rib up each panel's centre
       line plus a concentric stitch inside it — both surplus ink on the watermark. */
    const RIM = (() => {
      const parts = ['M' + at(R_TIP, (-90 * Math.PI) / 180)];
      for (let index = 0; index < 8; index += 1) {
        const from = ((-90 + index * 45) * Math.PI) / 180;
        const to = ((-90 + (index + 1) * 45) * Math.PI) / 180;
        parts.push('Q' + at(R_RIM, (from + to) / 2) + ' ' + at(R_TIP, to));
      }
      parts.push('Z');
      return parts.join('');
    })();

    /** Octagon frame of the HUD variant, circumradius 144, flat-topped. */
    const OCTAGON =
      '283 205.1 205.1 283 94.9 283 17 205.1 17 94.9 94.9 17 205.1 17 283 94.9';

    /** Corner brackets of the HUD variant, on a 300 box inset by 8. */
    const BRACKETS = [
      'M8 38 L8 8 L38 8',
      'M262 8 L292 8 L292 38',
      'M292 262 L292 292 L262 292',
      'M38 292 L8 292 L8 262',
    ];

    /* ------------------------------------------------------------- artwork -- */

    function canopy(scale, grad, hub) {
      return h(
        'g',
        {
          key: 'canopy',
          transform:
            'translate(150 150) scale(' + scale + ') translate(-150 -140)',
        },
        PANELS.map((panel, index) =>
          h('path', {
            key: index,
            /* The SVG attributes stay as the fallback; the classes let each scheme
               restate the pair (dark: light panels on black; light: mid-grey panels
               on white, because a near-white petal would vanish into the canvas). */
            className:
              'dsh-umbrella-panel ' + (panel.red ? 'is-red' : 'is-light'),
            d: panel.d,
            fill: panel.red ? RED : LOGO_LIGHT,
            stroke: panel.red ? LOGO_LIGHT : RED,
            strokeWidth: PANEL_STROKE,
          }),
        ),
        h('path', {
          key: 'shade',
          d: RIM,
          fill: grad ? 'url(#' + grad + ')' : 'none',
        }),
        h('path', {
          key: 'rim',
          d: RIM,
          fill: 'none',
          stroke: RED,
          strokeWidth: 0.9,
          opacity: 0.5,
        }),
        hub === false
          ? null
          : h(
              'g',
              { key: 'hub' },
              h('circle', {
                cx: APEX_X,
                cy: APEX_Y,
                r: R_HUB,
                fill: RED_DEEP,
                stroke: LOGO_LIGHT_STROKE,
                strokeWidth: 0.8,
                opacity: 0.95,
              }),
              h('circle', {
                cx: APEX_X,
                cy: APEX_Y,
                r: R_HUB * 0.36,
                fill: RED_HI,
              }),
            ),
      );
    }

    /** The corporate mark. `hud` adds the octagon frame, tick ring and brackets. */
    function Mark(props) {
      const size = props.size;
      const hud = props.hud === true;
      const nodes = [];
      /* One gradient id per rendered size, so several marks can share a page without
         colliding on the reference. */
      const shade = 'dsh-umbrella-shade-' + size;

      nodes.push(
        h(
          'defs',
          { key: 'defs' },
          h(
            'radialGradient',
            {
              id: shade,
              gradientUnits: 'userSpaceOnUse',
              cx: APEX_X,
              cy: APEX_Y,
              r: R_TIP * 0.99,
            },
            h('stop', { offset: '0', stopColor: '#FFFFFF', stopOpacity: 0.1 }),
            h('stop', { offset: '0.52', stopColor: '#FFFFFF', stopOpacity: 0 }),
            h('stop', { offset: '1', stopColor: '#000000', stopOpacity: 0.34 }),
          ),
        ),
      );

      if (hud) {
        nodes.push(
          h('polygon', {
            key: 'frame',
            points: OCTAGON,
            fill: 'none',
            stroke: RED,
            strokeWidth: 3,
            opacity: 0.85,
          }),
          h('circle', {
            key: 'ticks',
            className: 'dsh-umbrella-spin',
            cx: 150,
            cy: 150,
            r: 141,
            fill: 'none',
            stroke: RED_HI,
            strokeWidth: 1.5,
            strokeDasharray: '4 11',
            opacity: 0.5,
          }),
        );
      }

      nodes.push(canopy(hud ? 0.76 : 0.94, shade, props.hub !== false));

      if (hud) {
        nodes.push(
          h(
            'g',
            { key: 'brackets', fill: 'none', stroke: RED_HI, strokeWidth: 2.5, opacity: 0.6 },
            BRACKETS.map((d, index) => h('path', { key: index, d: d })),
          ),
        );
      }

      return h(
        'svg',
        {
          viewBox: '0 0 300 300',
          width: size,
          height: size,
          'aria-hidden': true,
          focusable: 'false',
          style: { display: 'block' },
        },
        nodes,
      );
    }

    /* The palette is applied twice on purpose: ctx.theme.overrideTokens reaches the
       token registry, and this stylesheet redeclares the same values on :root/body
       so every consumer resolves them regardless of where the host declares its own
       palette. !important is required to outrank the host's own body{} declarations.
       The nine --shiki-* entries are the one palette the host keeps outside --dsw-*:
       Shiki's css-variables theme ships light syntax colors on :root, so the code
       blocks stay dark-on-dark until they are replaced too. */
    /* The palette is applied twice per scheme on purpose: ctx.theme.overrideTokens
       hands the registry a {light, dark} pair, and these two sheets redeclare the same
       values so every consumer resolves them wherever the host declares its own palette.
       `!important` is required to outrank the host's own :root/body declarations.
       LIGHT lands on `:root,body`; DARK lands on `body[data-ds-dark-theme]` — specificity
       (0,1,1) beats `:root,body` (0,0,1) — AND on `html:has(body[data-ds-dark-theme])`,
       because a custom property is substituted on the element that DECLARES it. The host
       declares `--shiki-background: var(--dsw-alias-markdown-code-block)` on `:root`, so
       that chain resolves against the html-level values; a body-only override left it at
       the host's LIGHT code surface (bluish-50, near white) and every fenced code block
       painted a white <pre> — the component sets backgroundColor via an inline style —
       while the block's own container stayed dark. Overriding at html as well fixes the
       whole family of `:root`-declared chained variables, not just that one.
       The app writes that attribute from its own Appearance setting — System follows
       the OS — so the theme now follows the system instead of pinning dark.
       The nine --shiki-* entries are the one palette the host keeps outside --dsw-*:
       Shiki's css-variables theme ships LIGHT syntax colours on :root, so dark code
       blocks need them replaced; the light sheet replaces them with the theme's own
       deep-green ramp. `--shiki-foreground`/`--shiki-background` are NOT redeclared —
       the host chains them to label-primary and markdown-code-block, which are per-scheme
       here, so plain code text and the code surface follow the scheme for free.
       The --dsh-umbrella-* entries at the end of each sheet are this artwork's own
       scheme hooks (canopy panel colours, watermark strength, the green/red accent). */
    const PALETTE_LIGHT = ":root,body{--shiki-background:var(--dsw-alias-markdown-code-block)!important;--shiki-foreground:var(--dsw-alias-label-primary)!important;--dsw-alias-bg-base:#FFFFFF!important;--dsw-alias-bg-document-preview:#F7F8FA!important;--dsw-alias-bg-document-selection:color-mix(in srgb,#E4002B 18%,transparent)!important;--dsw-alias-bg-layer-1:#F7F8FA!important;--dsw-alias-bg-layer-2:#F1F3F5!important;--dsw-alias-bg-layer-3:#EAEDF0!important;--dsw-alias-bg-mask-1:#0000003d!important;--dsw-alias-bg-mask-2:#0000001f!important;--dsw-alias-bg-mask-3:#0000007a!important;--dsw-alias-bg-mask-drop:#ffffffb3!important;--dsw-alias-bg-mask-photo:#000000e0!important;--dsw-alias-bg-module-platform:#F7F8FA!important;--dsw-alias-bg-multi-select:#F1F3F5!important;--dsw-alias-bg-overlay:#FFFFFF!important;--dsw-alias-bg-skeleton:#0000000a!important;--dsw-alias-border-inverted:#0000!important;--dsw-alias-border-inverted2:#0000!important;--dsw-alias-border-l1:#E4002B1F!important;--dsw-alias-border-l2:#E4002B33!important;--dsw-alias-border-l2-darkmode-thin:#E4002B1F!important;--dsw-alias-border-l3:#E4002B47!important;--dsw-alias-border-l4:#E4002B5C!important;--dsw-alias-brand-primary:#E4002B!important;--dsw-alias-brand-primary-invert:#FFFFFF!important;--dsw-alias-brand-primary-new-colorprimary-new-color:#E4002B!important;--dsw-alias-brand-text:#FFFFFF!important;--dsw-alias-button-contrast-fill:var(--dsw-static-neutral-bluish-700)!important;--dsw-alias-button-elevated-fill:var(--dsw-static-neutral-bluish-00)!important;--dsw-alias-button-floating-fill:var(--dsw-static-neutral-bluish-00)!important;--dsw-alias-button-floating-hover:var(--dsw-static-neutral-bluish-75)!important;--dsw-alias-button-ghost-active-border:var(--dsw-static-neutral-bluish-500)!important;--dsw-alias-button-ghost-active-fill:var(--dsw-static-neutral-bluish-100)!important;--dsw-alias-button-ghost-active-hover:var(--dsw-static-neutral-bluish-150)!important;--dsw-alias-button-info-fill:#E4002B!important;--dsw-alias-button-info-hover:#C9001F!important;--dsw-alias-button-primary-dimmed:#F6C6CE!important;--dsw-alias-button-primary-fill:var(--dsw-alias-brand-primary)!important;--dsw-alias-button-primary-hover:#C9001F!important;--dsw-alias-button-tool-bar-fill:#54555780!important;--dsw-alias-button-tool-bar-fill-invisible:#1f1f1f5c!important;--dsw-alias-button-tool-bar-hover:#54555799!important;--dsw-alias-code-diff-added:var(--dsw-static-green-500-a08)!important;--dsw-alias-code-diff-deleted:var(--dsw-static-red-600-a08)!important;--dsw-alias-file-diff-added-bg:#e6f4e7!important;--dsw-alias-file-diff-added-gutter:#edf7ed!important;--dsw-alias-file-diff-added-marker:#01a241!important;--dsw-alias-file-diff-deleted-bg:#fce6e2!important;--dsw-alias-file-diff-deleted-gutter:#fdece9!important;--dsw-alias-file-diff-deleted-marker:#ba2723!important;--dsw-alias-interactive-bg-active:#2631481a!important;--dsw-alias-interactive-bg-hover:#2631480f!important;--dsw-alias-interactive-bg-hover-accent:#26314824!important;--dsw-alias-interactive-bg-hover-danger:#ec13130d!important;--dsw-alias-interactive-bg-hover-solid:var(--dsw-static-neutral-bluish-75)!important;--dsw-alias-label-caption:var(--dsw-static-neutral-bluish-600)!important;--dsw-alias-label-deep-diving:#C4001F!important;--dsw-alias-label-deep-diving-shimmer:color-mix(in srgb,#C4001F 55%,transparent)!important;--dsw-alias-label-dimmed:var(--dsw-static-neutral-bluish-400)!important;--dsw-alias-label-document-preview:var(--dsw-static-neutral-bluish-700)!important;--dsw-alias-label-primary:var(--dsw-static-neutral-bluish-1000)!important;--dsw-alias-label-primary-bluish:var(--dsw-static-neutral-bluish-1000)!important;--dsw-alias-label-primary-dimmed:var(--dsw-static-neutral-bluish-950)!important;--dsw-alias-label-primary-foreground:var(--dsw-static-neutral-bluish-00)!important;--dsw-alias-label-primary-inverted:var(--dsw-static-neutral-bluish-00)!important;--dsw-alias-label-secondary:var(--dsw-static-neutral-bluish-700)!important;--dsw-alias-label-shimmer:color-mix(in srgb,#0F1115 45%,transparent)!important;--dsw-alias-label-tertiary:var(--dsw-static-neutral-bluish-600)!important;--dsw-alias-link:#C4001F!important;--dsw-alias-markdown-citation:#F2F4F7!important;--dsw-alias-markdown-code-block:#F4F6F8!important;--dsw-alias-markdown-code-block-banner:#FBF0F2!important;--dsw-alias-markdown-code-segment-selected:#E9EDF1!important;--dsw-alias-markdown-code-segment-unselected:#F4F6F8!important;--dsw-alias-markdown-inline-code:#EDF0F3!important;--dsw-alias-markdown-placeholder:#F4F6F8!important;--dsw-alias-markdown-tag:#F4F6F8!important;--dsw-alias-menu-group-header-fill:#f8f9faf0!important;--dsw-alias-menu-icon:var(--dsw-static-neutral-bluish-800)!important;--dsw-alias-scrollbar-bg-l1:var(--dsw-static-neutral-200)!important;--dsw-alias-scrollbar-bg-l2:var(--dsw-static-neutral-200)!important;--dsw-alias-scrollbar-hover-l1:var(--dsw-static-neutral-300)!important;--dsw-alias-scrollbar-hover-l2:var(--dsw-static-neutral-300)!important;--dsw-alias-state-business-primary:#E4002B!important;--dsw-alias-state-business-tertiary:var(--dsw-static-deepseek-100)!important;--dsw-alias-state-error-primary:var(--dsw-static-red-600)!important;--dsw-alias-state-error-secondary:var(--dsw-static-red-400)!important;--dsw-alias-state-idle-primary:var(--dsw-static-neutral-300)!important;--dsw-alias-state-success-primary:#0E7A45!important;--dsw-alias-state-success-secondary:var(--dsw-static-green-400)!important;--dsw-alias-state-success-tertiary:var(--dsw-static-green-100)!important;--dsw-alias-state-warn-label:#8A5300!important;--dsw-alias-state-warn-primary:var(--dsw-static-amber-500)!important;--dsw-alias-state-warn-secondary:var(--dsw-static-amber-400)!important;--dsw-alias-state-warn-tertiary:var(--dsw-static-amber-100)!important;--dsw-alias-switch-thumb:#FFFFFF!important;--dsw-alias-toast-bg:var(--dsw-static-neutral-bluish-800)!important;--dsw-alias-toast-label:var(--dsw-static-neutral-bluish-00)!important;--dsw-alias-tooltip-bg:var(--dsw-static-neutral-bluish-850)!important;--dsw-alias-tooltip-key-bg:color-mix(in srgb, var(--dsw-alias-tooltip-bg), white 18%)!important;--dsw-alias-turn-trigger-bg:var(--dsw-alias-markdown-code-block)!important;--dsw-alias-turn-trigger-bg-hover:var(--dsw-alias-interactive-bg-hover)!important;--dsw-menu-surface-fill:#f8f9fa94!important;--dsw-specific-bubble:#FCEDF0!important;--dsw-specific-bubble-highlight:#F9DDE3!important;--dsw-specific-input-major:var(--dsw-static-neutral-bluish-00)!important;--dsw-specific-login-input:var(--dsw-static-neutral-bluish-50)!important;--dsw-specific-menu:var(--dsw-menu-surface-fill)!important;--dsw-specific-selector:var(--dsw-static-neutral-bluish-60)!important;--dsw-specific-sidebar-fill:var(--dsw-static-neutral-bluish-75)!important;--dsw-specific-sidebar-nav-item-active:var(--dsw-static-neutral-bluish-150)!important;--dsw-specific-sidebar-nav-item-active-accent:#E4002B24!important;--dsw-specific-sidebar-nav-item-hover:var(--dsw-static-neutral-bluish-100)!important;--dsw-specific-tip:var(--dsw-static-neutral-bluish-60)!important;--shiki-token-constant:#0D6357!important;--shiki-token-string:#14683A!important;--shiki-token-comment:#56705F!important;--shiki-token-keyword:#0A5D28!important;--shiki-token-parameter:#2C7048!important;--shiki-token-function:#0B5A45!important;--shiki-token-string-expression:#0E5730!important;--shiki-token-punctuation:#39423F!important;--shiki-token-link:#0A5D28!important;--dsh-umbrella-panel-red:#E4002B;--dsh-umbrella-panel-red-edge:#FFFFFF;--dsh-umbrella-panel-light:#FFFFFF;--dsh-umbrella-panel-light-edge:#E4002B;--dsh-umbrella-wm-opacity:.14;--dsh-umbrella-wm-glow:rgba(228,0,43,.10);--dsh-umbrella-accent:#0A5D28;--dsh-umbrella-tab-fg:#1A1D21;--dsh-umbrella-tab-fg-hover:#0A5D28;--dsh-umbrella-glow:radial-gradient(58% 38% at 50% -6%,rgba(228,0,43,.045),rgba(228,0,43,.014) 45%,transparent 72%);--dsh-umbrella-grid-line:rgba(15,17,21,.045)}";

    const PALETTE_DARK = "html:has(body[data-ds-dark-theme]),body[data-ds-dark-theme]{--shiki-background:var(--dsw-alias-markdown-code-block)!important;--shiki-foreground:var(--dsw-alias-label-primary)!important;--dsw-alias-bg-base:#05060B!important;--dsw-alias-bg-document-preview:#0A0C12!important;--dsw-alias-bg-document-selection:color-mix(in srgb,#E4002B 30%,transparent)!important;--dsw-alias-bg-layer-1:#0A0C12!important;--dsw-alias-bg-layer-2:#0E1017!important;--dsw-alias-bg-layer-3:#13161F!important;--dsw-alias-bg-mask-1:#000000A6!important;--dsw-alias-bg-mask-2:#00000066!important;--dsw-alias-bg-mask-3:#0000007A!important;--dsw-alias-bg-mask-drop:#0E1017C0!important;--dsw-alias-bg-mask-photo:#000000E0!important;--dsw-alias-bg-module-platform:#13161F!important;--dsw-alias-bg-multi-select:#181C26!important;--dsw-alias-bg-overlay:#0E1017!important;--dsw-alias-bg-skeleton:#FFFFFF14!important;--dsw-alias-border-inverted:#FFFFFF12!important;--dsw-alias-border-inverted2:#FFFFFF1F!important;--dsw-alias-border-l1:#E4002B26!important;--dsw-alias-border-l2:#E4002B3D!important;--dsw-alias-border-l2-darkmode-thin:#E4002B26!important;--dsw-alias-border-l3:#E4002B4D!important;--dsw-alias-border-l4:#E4002B66!important;--dsw-alias-brand-primary:#E4002B!important;--dsw-alias-brand-primary-invert:#FFFFFF!important;--dsw-alias-brand-primary-new-colorprimary-new-color:#E4002B!important;--dsw-alias-brand-text:#FFFFFF!important;--dsw-alias-button-contrast-fill:#C7F7D8!important;--dsw-alias-button-elevated-fill:#1A1116!important;--dsw-alias-button-floating-fill:#13161F!important;--dsw-alias-button-floating-hover:#181C26!important;--dsw-alias-button-ghost-active-border:#6E0A19!important;--dsw-alias-button-ghost-active-fill:#1E222D!important;--dsw-alias-button-ghost-active-hover:#262A36!important;--dsw-alias-button-info-fill:#E4002B!important;--dsw-alias-button-info-hover:#FF2D3F!important;--dsw-alias-button-primary-dimmed:#4A0410!important;--dsw-alias-button-primary-fill:var(--dsw-alias-brand-primary)!important;--dsw-alias-button-primary-hover:#FF2D3F!important;--dsw-alias-button-tool-bar-fill:#54555780!important;--dsw-alias-button-tool-bar-fill-invisible:#1f1f1f5c!important;--dsw-alias-button-tool-bar-hover:#54555799!important;--dsw-alias-code-diff-added:var(--dsw-static-green-500-a12)!important;--dsw-alias-code-diff-deleted:var(--dsw-static-red-400-a12)!important;--dsw-alias-file-diff-added-bg:#1f3124!important;--dsw-alias-file-diff-added-gutter:#132016!important;--dsw-alias-file-diff-added-marker:#41c977!important;--dsw-alias-file-diff-deleted-bg:#3c1f1b!important;--dsw-alias-file-diff-deleted-gutter:#28130e!important;--dsw-alias-file-diff-deleted-marker:#fa423e!important;--dsw-alias-interactive-bg-active:#E4002B33!important;--dsw-alias-interactive-bg-hover:#FFFFFF14!important;--dsw-alias-interactive-bg-hover-accent:#E4002B2E!important;--dsw-alias-interactive-bg-hover-danger:#FF3B4726!important;--dsw-alias-interactive-bg-hover-solid:#181C26!important;--dsw-alias-label-caption:#55A96F!important;--dsw-alias-label-deep-diving:color-mix(in srgb,#E4002B 60%,#8A93A2)!important;--dsw-alias-label-deep-diving-shimmer:color-mix(in srgb,#FF6B78 70%,#DDE1E8)!important;--dsw-alias-label-dimmed:#47905F!important;--dsw-alias-label-document-preview:#66C688!important;--dsw-alias-label-primary:#8CEBAA!important;--dsw-alias-label-primary-bluish:#8CEBAA!important;--dsw-alias-label-primary-dimmed:#79D79A!important;--dsw-alias-label-primary-foreground:#FFFFFF!important;--dsw-alias-label-primary-inverted:#04120A!important;--dsw-alias-label-secondary:#66C688!important;--dsw-alias-label-shimmer:color-mix(in srgb,#8CEBAA 45%,transparent)!important;--dsw-alias-label-tertiary:#57A874!important;--dsw-alias-link:#FF2D3F!important;--dsw-alias-markdown-citation:#12241A!important;--dsw-alias-markdown-code-block:#05100A!important;--dsw-alias-markdown-code-block-banner:#0A1810!important;--dsw-alias-markdown-code-segment-selected:#14281B!important;--dsw-alias-markdown-code-segment-unselected:#05100A!important;--dsw-alias-markdown-inline-code:#0F2116!important;--dsw-alias-markdown-placeholder:#0A1810!important;--dsw-alias-markdown-tag:#0A1810!important;--dsw-alias-menu-group-header-fill:#13161FF0!important;--dsw-alias-menu-icon:#55A96F!important;--dsw-alias-scrollbar-bg-l1:#1E222D!important;--dsw-alias-scrollbar-bg-l2:#1E222D!important;--dsw-alias-scrollbar-hover-l1:#6E0A19!important;--dsw-alias-scrollbar-hover-l2:#4A0410!important;--dsw-alias-state-business-primary:#FF2D3F!important;--dsw-alias-state-business-tertiary:#4A0410!important;--dsw-alias-state-error-primary:#FF3B47!important;--dsw-alias-state-error-secondary:#FF8089!important;--dsw-alias-state-idle-primary:#5E6673!important;--dsw-alias-state-success-primary:#2FC98A!important;--dsw-alias-state-success-secondary:#3FD69B!important;--dsw-alias-state-success-tertiary:#123A2C!important;--dsw-alias-state-warn-label:#FFB020!important;--dsw-alias-state-warn-primary:#FFB020!important;--dsw-alias-state-warn-secondary:#FFC861!important;--dsw-alias-state-warn-tertiary:#3A2A08!important;--dsw-alias-switch-thumb:#B7F5CB!important;--dsw-alias-toast-bg:#1E222D!important;--dsw-alias-toast-label:#8CEBAA!important;--dsw-alias-tooltip-bg:#1E222D!important;--dsw-alias-tooltip-key-bg:color-mix(in srgb, var(--dsw-alias-tooltip-bg), white 18%)!important;--dsw-alias-turn-trigger-bg:#FFFFFF14!important;--dsw-alias-turn-trigger-bg-hover:#FFFFFF24!important;--dsw-menu-surface-fill:#12141CE8!important;--dsw-specific-bubble:#1A1116!important;--dsw-specific-bubble-highlight:#2A1119!important;--dsw-specific-input-major:#0E1017!important;--dsw-specific-login-input:#0A0C12!important;--dsw-specific-menu:var(--dsw-menu-surface-fill)!important;--dsw-specific-selector:#13161F!important;--dsw-specific-sidebar-fill:#03040A!important;--dsw-specific-sidebar-nav-item-active:#1A1116!important;--dsw-specific-sidebar-nav-item-active-accent:#E4002B26!important;--dsw-specific-sidebar-nav-item-hover:#FFFFFF14!important;--dsw-specific-tip:#13161F!important;--shiki-token-constant:#29E37E!important;--shiki-token-string:#7DFFA8!important;--shiki-token-comment:#57A874!important;--shiki-token-keyword:#00FF41!important;--shiki-token-parameter:#6FE79C!important;--shiki-token-function:#B4FFCE!important;--shiki-token-string-expression:#8FFFBE!important;--shiki-token-punctuation:#79C795!important;--shiki-token-link:#5BFF9E!important;--dsh-umbrella-panel-red:#E4002B;--dsh-umbrella-panel-red-edge:#FFFFFF;--dsh-umbrella-panel-light:#FFFFFF;--dsh-umbrella-panel-light-edge:#E4002B;--dsh-umbrella-wm-opacity:.2;--dsh-umbrella-wm-glow:rgba(228,0,43,.42);--dsh-umbrella-accent:#57E88B;--dsh-umbrella-tab-fg:#8CEBAA;--dsh-umbrella-tab-fg-hover:#B7F5CB;--dsh-umbrella-glow:radial-gradient(58% 38% at 50% -6%,rgba(228,0,43,.20),rgba(228,0,43,.05) 45%,transparent 72%);--dsh-umbrella-grid-line:rgba(228,0,43,.055)}";

    const CSS = [
      PALETTE_LIGHT,
      PALETTE_DARK,
      '.dsh-umbrella-layer{position:absolute;inset:0;overflow:hidden;pointer-events:none}',
      '.dsh-umbrella-glow{position:absolute;inset:0;background:var(--dsh-umbrella-glow)}',
      '.dsh-umbrella-grid{position:absolute;inset:0;background-image:linear-gradient(var(--dsh-umbrella-grid-line,rgba(228,0,43,.055)) 1px,transparent 1px),linear-gradient(90deg,var(--dsh-umbrella-grid-line,rgba(228,0,43,.055)) 1px,transparent 1px);background-size:76px 76px;-webkit-mask-image:radial-gradient(125% 78% at 50% 42%,transparent 32%,#000 80%);mask-image:radial-gradient(125% 78% at 50% 42%,transparent 32%,#000 80%)}',
      '.dsh-umbrella-corner{position:absolute;width:30px;height:30px;border:0 solid rgba(255,45,63,.55)}',
      '.dsh-umbrella-corner.tl{top:9px;left:9px;border-top-width:1.5px;border-left-width:1.5px}',
      '.dsh-umbrella-corner.tr{top:9px;right:9px;border-top-width:1.5px;border-right-width:1.5px}',
      '.dsh-umbrella-corner.bl{bottom:9px;left:9px;border-bottom-width:1.5px;border-left-width:1.5px}',
      '.dsh-umbrella-corner.br{bottom:9px;right:9px;border-bottom-width:1.5px;border-right-width:1.5px}',
      '.dsh-umbrella-chip{position:absolute;right:16px;bottom:14px;display:flex;align-items:center;gap:7px;opacity:.6}',
      '.dsh-umbrella-chip-text{font-family:var(--dsw-font-family-code,ui-monospace,SFMono-Regular,Menlo,monospace);font-size:9px;font-weight:600;letter-spacing:.24em;color:var(--dsh-umbrella-accent,#57E88B);white-space:nowrap}',
      /* The hero mark's dashed tick ring. Both the prefixed and the unprefixed
         transform-box are spelled out here on purpose: this rule is the one place left
         where the axis depends on `transform-box` being honoured. The watermark used the
         unprefixed form alone and, on this renderer, silently measured `150px` against
         the svg's border box instead of the viewBox — the axis landed 130px left of the
         artwork and the logo swung around the line. Keep both forms, or rebuild the
         rotation on an HTML box as the watermark now does. */
      '.dsh-umbrella-spin{-webkit-transform-box:view-box;transform-box:view-box;transform-origin:150px 150px;animation:dsh-umbrella-rotate 14s linear infinite}',
      '@keyframes dsh-umbrella-rotate{to{transform:rotate(360deg)}}',

      /* The document canvas: the only part of the chrome no token reaches. Several
         surfaces (notably the macOS sidebar) paint a partly transparent fill over
         this canvas, so an unset canvas bleeds a light backdrop through them. */
      'html{color-scheme:light!important;background-color:#FFFFFF!important}',
      'html:has(body[data-ds-dark-theme]){color-scheme:dark!important;background-color:#05060B!important}',
      'body{background-color:#FFFFFF!important}',
      'body[data-ds-dark-theme]{background-color:#05060B!important}',

      /* macOS paints the sidebar's New Session pill with a hardcoded translucent
         white literal — [data-platform=darwin] .newSession{background:#ffffff8c} —
         not a token, so no palette can reach it and its label ends up white on
         white. `button[class*=...]` keys off the stable CSS-modules local name. */
      '[data-platform=darwin] button[class*="newSession"]{background-color:#E4002B!important;color:#FFFFFF!important;border-color:transparent!important;box-shadow:0 1px 10px rgba(228,0,43,.35)!important}',
      '[data-platform=darwin] button[class*="newSession"]:hover{background-color:#C9001F!important;color:#FFFFFF!important;box-shadow:0 2px 16px rgba(201,0,31,.55)!important}',
      /* The watermark sits at the middle of the WINDOW (`fixed` + viewport percentages,
         since 50%/50% of the overlay slot's own box is what we can rely on), and it
         turns like a coin ON its own vertical centre line.
         The rotation lives on an inner HTML div, never on the svg. `transform-origin`
         on an HTML box has no viewBox to resolve against, so 50% 50% is unambiguously
         the middle of the 720px artwork box — which is the middle of the glyph, because
         canopy() translates the apex onto the viewBox centre. Putting the rotation on
         the svg instead (`transform-box:view-box; transform-origin:150px 150px`) is the
         fragile version: whether 150px means 150 user units or 150 CSS px decides
         whether the y axis runs through the logo's centre or ~130px to its left, and a
         left-of-centre axis makes the whole logo swing AROUND the line instead of
         spinning ON it. The user reported exactly that swing, so the axis is now fixed
         by construction rather than by interpretation. */
      '.dsh-umbrella-watermark{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;opacity:var(--dsh-umbrella-wm-opacity,.2);filter:drop-shadow(0 0 60px var(--dsh-umbrella-wm-glow,rgba(228,0,43,.42)));perspective:1800px}',
      '.dsh-umbrella-spinner{width:720px;height:720px;flex:none;transform-origin:50% 50%;animation:dsh-umbrella-flip 48s linear infinite}',
      '@keyframes dsh-umbrella-flip{from{transform:rotateY(0deg)}to{transform:rotateY(360deg)}}',
      '.dsh-umbrella-panel.is-red{fill:var(--dsh-umbrella-panel-red,#E4002B);stroke:var(--dsh-umbrella-panel-red-edge,#FFFFFF)}',
      '.dsh-umbrella-panel.is-light{fill:var(--dsh-umbrella-panel-light,#FFFFFF);stroke:var(--dsh-umbrella-panel-light-edge,#E4002B)}',
      '.dsh-umbrella-bio{opacity:.9;flex:none}',
      '.dsh-umbrella-bio text,.dsh-umbrella-bio path,.dsh-umbrella-bio circle{shape-rendering:geometricPrecision}',
      /* Bare trefoil on the account row, not stacked above it. The host lays the sidebar
         foot out as a column — [sidebar.footer.action] first, the account area second —
         so this flips the foot to a row and swaps the two seats with `order`. That puts
         the emblem at the right of the user row without touching the row's own markup.
         Suffix matching scoped through the foot keeps the hit on the sidebar: the
         user-questions composer has its own unrelated `footerActions` module class. */
      '[class*="_footArea"]{flex-direction:row!important;align-items:center!important;gap:8px!important}',
      '[class*="_footArea"]>[class*="_settingsArea"]{order:1!important;flex:1 1 auto!important;width:auto!important;min-width:0!important}',
      '[class*="_footArea"]>[class*="_footerActions"]{order:2!important;flex:none!important;width:auto!important}',
      '.dsh-umbrella-bio-seat{display:inline-flex;align-items:center;justify-content:center;flex:none;padding:0;background:none;border:0;box-shadow:none;opacity:.92}',
      '.dsh-umbrella-bio-seat:hover{opacity:1}',
      '.dsh-umbrella-hudline{position:absolute;left:0;right:0;bottom:0;height:1px;background:linear-gradient(90deg,transparent,rgba(228,0,43,.8),transparent)}',
      /* Conversation View tabs (Chat / Trajectory): the host renders them as
         `[data-conversation-tabs]` + `role="tab"` with an underline on the active one.
         Rebuilt as borderless red cards: a faint red pill for the inactive tab, solid
         Umbrella red for the active one, no border and no underline anywhere. Near-white
         on #E4002B is ~4.9:1; green there would be 3.4:1, so the active card keeps white. */
      '[data-conversation-tabs]{gap:10px!important;padding-left:0!important;margin-top:8px!important;background:transparent!important}',
      '[data-conversation-tabs] [role="tab"]{background:#E4002B1F!important;color:var(--dsh-umbrella-tab-fg,#8CEBAA)!important;border:0!important;border-radius:0!important;padding:5px 14px!important;font-weight:600!important;line-height:16px!important;transition:background-color .16s ease,color .16s ease!important}',
      '[data-conversation-tabs] [role="tab"]:after{display:none!important}',
      '[data-conversation-tabs] [role="tab"]:hover{background:#E4002B33!important;color:var(--dsh-umbrella-tab-fg-hover,#B7F5CB)!important}',
      '[data-conversation-tabs] [role="tab"][aria-selected="true"]{background:#E4002B!important;color:#FFFFFF!important;box-shadow:0 2px 12px rgba(228,0,43,.45)!important}',
      '[data-conversation-tabs] [role="tab"][aria-selected="true"]:after{display:none!important}',

      /* Small windows: the corner wordmark is the first thing to go. Every wide
         horizontal decoration lives at the bottom of the window, so on narrow windows
         they compete with the composer row for the same room. */
      '@media (max-width:1200px){.dsh-umbrella-chip{display:none!important}}',
      '@media (prefers-reduced-motion:reduce){.dsh-umbrella-spin,.dsh-umbrella-spinner{animation:none}}',
    ].join('');

    /* ---------------------------------------------------------- components -- */

    function styleSheet() {
      return h('style', { key: 'umbrella-css' }, CSS);
    }

    function SidebarMark(props) {
      const size =
        typeof props.size === 'number' && props.size > 0 ? props.size : 26;
      return h(
        React.Fragment,
        null,
        styleSheet(),
        h(
          'span',
          {
            style: {
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              lineHeight: 0,
              filter: 'drop-shadow(0 0 6px rgba(255,45,63,.45))',
            },
          },
          h(Mark, { size: size }),
        ),
      );
    }

    function HeroMark(props) {
      const size =
        typeof props.size === 'number' && props.size > 0 ? props.size : 88;
      return h(
        React.Fragment,
        null,
        styleSheet(),
        h(
          'span',
          {
            className: props.className,
            style: {
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              lineHeight: 0,
              filter: 'drop-shadow(0 0 14px rgba(255,45,63,.5))',
            },
          },
          h(Mark, { size: size, hud: true }),
        ),
      );
    }

    /** Large, faint corporate mark behind the conversation column. The inner div is the
     *  part that turns: an HTML box, so its 50% 50% cannot be misread as anything but
     *  the middle of the artwork, which is also the middle of the glyph. */
    function Watermark() {
      return h(
        'div',
        { className: 'dsh-umbrella-watermark' },
        h(
          'div',
          { className: 'dsh-umbrella-spinner' },
          /* hub: false — the background logo is canopy only, no ferrule disc at the apex. */
          h(Mark, { size: 720, hub: false }),
        ),
      );
    }

    /** Biohazard trefoil: three interlocking rings around a centre ring. Strokes are
     *  heavy on purpose — below ~20px a thin ring antialiases away to nothing, and at
     *  16-19px in the sidebar foot a thin one reads as a smudge rather than a symbol. */
    const BIO_RINGS = [
      [50, 30],
      [67.3, 60],
      [32.7, 60],
    ];

    function Biohazard(props) {
      const size =
        typeof props.size === 'number' && props.size > 0 ? props.size : 28;
      return h(
        'svg',
        {
          className: 'dsh-umbrella-bio',
          viewBox: '0 0 100 100',
          width: size,
          height: size,
          'aria-hidden': true,
          focusable: 'false',
          style: { display: 'block' },
        },
        BIO_RINGS.map((centre, index) =>
          h('circle', {
            key: index,
            cx: centre[0],
            cy: centre[1],
            r: 13,
            fill: 'none',
            stroke: RED,
            strokeWidth: 8,
          }),
        ).concat([
          h('circle', {
            key: 'core',
            cx: 50,
            cy: 50,
            r: 6,
            fill: 'none',
            stroke: RED_HI,
            strokeWidth: 6,
          }),
        ]),
      );
    }

    /** Sidebar foot seat: the trefoil sits immediately right of the user row, on a
     *  faint red card, and shrinks with the sidebar instead of being dropped. */
    function BiohazardSeat(props) {
      const wide = !props || props.wide !== false;
      return h(
        React.Fragment,
        null,
        styleSheet(),
        h(
          'span',
          {
            className: 'dsh-umbrella-bio-seat',
            title: 'BIOHAZARD',
            'aria-label': 'Biohazard',
          },
          h(Biohazard, { size: wide ? 19 : 17 }),
        ),
      );
    }

    const CORNERS = ['tl', 'tr', 'bl', 'br'];

    function HudLayer() {
      return h(
        React.Fragment,
        null,
        styleSheet(),
        h(
          'div',
          { className: 'dsh-umbrella-layer' },
          h('div', { className: 'dsh-umbrella-glow' }),
          h('div', { className: 'dsh-umbrella-grid' }),
          h(Watermark, { key: 'watermark' }),
          CORNERS.map((corner) =>
            h('div', {
              key: corner,
              className: 'dsh-umbrella-corner ' + corner,
            }),
          ),
          h('div', { key: 'hudline', className: 'dsh-umbrella-hudline' }),
          h(
            'div',
            { className: 'dsh-umbrella-chip' },
            h(Mark, { size: 16 }),
            h('span', { className: 'dsh-umbrella-chip-text' }, WORDMARK),
          ),
        ),
      );
    }

    /* -------------------------------------------------------------- plugin -- */

    /**
     * LIGHT AND DARK ARE BOTH REAL PAGES NOW.
     *
     * The palette carries two sheets (see PALETTE_LIGHT / PALETTE_DARK) and the artwork
     * follows them through --dsh-umbrella-* hooks, so the app's own scheme flag is left
     * alone: the Appearance setting (System follows the OS) switches the theme. Earlier
     * builds pinned `body[data-ds-dark-theme]` because module-local properties — the
     * changed-files card, the delivery cards, the empty states, the macOS New Session
     * pill — read the STATIC palette and branch on that flag, so a light palette under a
     * dark flag (or the reverse) painted light cards onto a black UI. A matching pair of
     * schemes is exactly what those branches expect, so the pin is gone.
     *
     * Dark is the deep black-and-red page it always was; light is the grey-and-white page
     * with the same Umbrella red, dark-grey prose and a deep-green syntax ramp. */
    return {
      inject: ['theme', 'slots'],
      apply(ctx) {
        ctx.effect(
          () => ctx.theme.overrideTokens(SOURCE, TOKENS),
          'umbrella-theme palette',
        );

        ctx.slots.inject('sidebar.brand.mark', () =>
          ctx.slots.register(
            { name: 'sidebar.brand.mark', priority: PREEMPT },
            SidebarMark,
          ),
        );

        ctx.slots.inject('conversation.hero.brand.mark', () =>
          ctx.slots.register(
            { name: 'conversation.hero.brand.mark', priority: PREEMPT },
            HeroMark,
          ),
        );

        ctx.slots.inject('sidebar.footer.action', () =>
          ctx.slots.register(
            {
              name: 'sidebar.footer.action',
              id: 'umbrella-biohazard',
              order: 10,
              label: 'Umbrella biohazard',
            },
            BiohazardSeat,
          ),
        );

        ctx.slots.inject('shell.overlay', () =>
          ctx.slots.register(
            {
              name: 'shell.overlay',
              id: 'umbrella-hud',
              order: -10,
              label: 'Umbrella HUD',
            },
            HudLayer,
          ),
        );
      },
    };
  },
});