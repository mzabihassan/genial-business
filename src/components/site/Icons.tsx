import type { SVGProps } from "react";

/**
 * A single drawn icon set: 24u grid, 1.6u strokes, square caps.
 * Everything is stroked the same way so a row of them reads as one drawing
 * rather than as clip-art from three different sources.
 */
type P = SVGProps<SVGSVGElement>;

function Glyph({ children, ...props }: P & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="square"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

/* --- Navigation & controls ------------------------------------------------ */

export const ArrowRight = (p: P) => (
  <Glyph {...p}>
    <path d="M3.5 12h16" />
    <path d="M13.5 6.5 19 12l-5.5 5.5" />
  </Glyph>
);

export const ArrowUpRight = (p: P) => (
  <Glyph {...p}>
    <path d="M7 17 17 7" />
    <path d="M8.5 7H17v8.5" />
  </Glyph>
);

export const ArrowLeft = (p: P) => (
  <Glyph {...p}>
    <path d="M20.5 12h-16" />
    <path d="M10.5 6.5 5 12l5.5 5.5" />
  </Glyph>
);

export const Check = (p: P) => (
  <Glyph {...p}>
    <path d="m4.5 12.5 4.6 4.6L19.5 6.7" />
  </Glyph>
);

export const Plus = (p: P) => (
  <Glyph {...p}>
    <path d="M12 5v14M5 12h14" />
  </Glyph>
);

export const Close = (p: P) => (
  <Glyph {...p}>
    <path d="m6 6 12 12M18 6 6 18" />
  </Glyph>
);

export const Paperclip = (p: P) => (
  <Glyph {...p}>
    <path d="M18.5 11.5 12 18a4.2 4.2 0 0 1-6-6l7-7a3 3 0 0 1 4.3 4.3l-7 7a1.8 1.8 0 0 1-2.6-2.6l6.4-6.4" />
  </Glyph>
);

export const Alert = (p: P) => (
  <Glyph {...p}>
    <circle cx="12" cy="12" r="8.6" />
    <path d="M12 7.5v5.2" />
    <path d="M12 16.1h.01" strokeLinecap="round" />
  </Glyph>
);

/* --- Project types -------------------------------------------------------- */

export const IconSite = (p: P) => (
  <Glyph {...p}>
    <rect x="2.8" y="4.2" width="18.4" height="15.6" rx="1.6" />
    <path d="M2.8 9.2h18.4" />
    <path d="M5.9 6.7h.01M8.4 6.7h.01" strokeLinecap="round" />
  </Glyph>
);

export const IconApp = (p: P) => (
  <Glyph {...p}>
    <rect x="2.8" y="4.2" width="18.4" height="15.6" rx="1.6" />
    <path d="M2.8 8.6h18.4" />
    <path d="M9 8.6v11.2" />
  </Glyph>
);

export const IconSaas = (p: P) => (
  <Glyph {...p}>
    <path d="m12 3 8.4 4.4-8.4 4.4L3.6 7.4z" />
    <path d="m3.6 12.2 8.4 4.4 8.4-4.4" />
    <path d="m3.6 16.6 8.4 4.4 8.4-4.4" />
  </Glyph>
);

export const IconDashboard = (p: P) => (
  <Glyph {...p}>
    <rect x="2.8" y="4.2" width="18.4" height="15.6" rx="1.6" />
    <path d="M7.2 16v-3.4M12 16V8.8M16.8 16v-5.2" />
  </Glyph>
);

export const IconWorkflow = (p: P) => (
  <Glyph {...p}>
    <rect x="2.6" y="3.4" width="7" height="5.6" rx="1.2" />
    <rect x="14.4" y="3.4" width="7" height="5.6" rx="1.2" />
    <rect x="8.5" y="15" width="7" height="5.6" rx="1.2" />
    <path d="M6.1 9v2.6h11.8V9" />
    <path d="M12 11.6V15" />
  </Glyph>
);

export const IconRefonte = (p: P) => (
  <Glyph {...p}>
    <path d="M20 12a8 8 0 1 1-2.5-5.8" />
    <path d="M20.3 3.8v4.4h-4.4" />
  </Glyph>
);

export const IconAi = (p: P) => (
  <Glyph {...p}>
    <rect x="7.4" y="7.4" width="9.2" height="9.2" rx="2.2" />
    <path d="M12 2.8v4.6M12 16.6v4.6M2.8 12h4.6M16.6 12h4.6" />
  </Glyph>
);

/* --- Product strata ------------------------------------------------------- */

export const IconUsers = (p: P) => (
  <Glyph {...p}>
    <circle cx="12" cy="8.2" r="3.4" />
    <path d="M5.4 19.8a6.6 6.6 0 0 1 13.2 0" />
  </Glyph>
);

export const IconShield = (p: P) => (
  <Glyph {...p}>
    <path d="M12 3.2 19 6v5.6c0 4.3-2.9 7.5-7 8.6-4.1-1.1-7-4.3-7-8.6V6z" />
    <path d="m9.2 12 2 2 3.6-3.8" />
  </Glyph>
);

export const IconMail = (p: P) => (
  <Glyph {...p}>
    <rect x="2.8" y="5.4" width="18.4" height="13.2" rx="1.6" />
    <path d="m3.4 7.2 8.6 6.1 8.6-6.1" />
  </Glyph>
);

export const IconPayment = (p: P) => (
  <Glyph {...p}>
    <rect x="2.8" y="5.4" width="18.4" height="13.2" rx="1.6" />
    <path d="M2.8 9.8h18.4" />
    <path d="M6.4 14.6h3.4" />
  </Glyph>
);

export const IconData = (p: P) => (
  <Glyph {...p}>
    <ellipse cx="12" cy="6.4" rx="7" ry="3.2" />
    <path d="M5 6.4v11.2c0 1.8 3.1 3.2 7 3.2s7-1.4 7-3.2V6.4" />
    <path d="M19 12c0 1.8-3.1 3.2-7 3.2S5 13.8 5 12" />
  </Glyph>
);

export const IconGrowth = (p: P) => (
  <Glyph {...p}>
    <path d="M3.6 20h16.8" />
    <path d="m6.4 15.6 4.2-4.8 3.6 3.1 5.4-6.6" />
    <path d="M15.4 7.3h4.2v4.2" />
  </Glyph>
);

export const IconMonitor = (p: P) => (
  <Glyph {...p}>
    <path d="M2.8 12h4l2.6-6.4 4.2 12.8 2.6-6.4h4.8" />
  </Glyph>
);

export const IconLaunch = (p: P) => (
  <Glyph {...p}>
    <path d="M12 20.4V4.2" />
    <path d="m6.4 9.8 5.6-5.6 5.6 5.6" />
    <path d="M4 21.5h16" />
  </Glyph>
);

export const IconSearch = (p: P) => (
  <Glyph {...p}>
    <circle cx="11" cy="11" r="6.3" />
    <path d="m15.6 15.6 4.4 4.4" />
  </Glyph>
);

export const IconSettings = (p: P) => (
  <Glyph {...p}>
    <path d="M3.4 8h9.2M17.2 8h3.4M3.4 16h4.2M12.2 16h8.4" />
    <circle cx="14.8" cy="8" r="2.2" />
    <circle cx="9.8" cy="16" r="2.2" />
  </Glyph>
);

export const IconDoc = (p: P) => (
  <Glyph {...p}>
    <path d="M6 3.6h7.6L18.4 8.4v12H6z" />
    <path d="M13.4 3.6v5h5" />
  </Glyph>
);

export const IconBell = (p: P) => (
  <Glyph {...p}>
    <path d="M7.6 10.4a4.4 4.4 0 0 1 8.8 0c0 4 1.6 5.8 1.6 5.8H6s1.6-1.8 1.6-5.8Z" />
    <path d="M10.2 19a2 2 0 0 0 3.6 0" />
  </Glyph>
);

export const IconServer = (p: P) => (
  <Glyph {...p}>
    <rect x="3.2" y="4" width="17.6" height="6.2" rx="1.4" />
    <rect x="3.2" y="13.8" width="17.6" height="6.2" rx="1.4" />
    <path d="M7 7.1h.01M7 16.9h.01" strokeLinecap="round" />
  </Glyph>
);

export const IconKey = (p: P) => (
  <Glyph {...p}>
    <circle cx="8" cy="15.4" r="3.8" />
    <path d="m10.8 12.7 8.4-8.4" />
    <path d="m16.4 6.9 2 2M14.2 9.1l2 2" />
  </Glyph>
);

export const IconCode = (p: P) => (
  <Glyph {...p}>
    <path d="M9 7 4.4 12 9 17" />
    <path d="m15 7 4.6 5-4.6 5" />
  </Glyph>
);

export const IconGlobe = (p: P) => (
  <Glyph {...p}>
    <circle cx="12" cy="12" r="8.6" />
    <path d="M3.4 12h17.2" />
    <path d="M12 3.4c2.5 2.7 3.8 5.6 3.8 8.6S14.5 18.3 12 20.6c-2.5-2.3-3.8-5.6-3.8-8.6S9.5 6.1 12 3.4Z" />
  </Glyph>
);

export const IconUpload = (p: P) => (
  <Glyph {...p}>
    <path d="M4 15.4v3.4a1.6 1.6 0 0 0 1.6 1.6h12.8a1.6 1.6 0 0 0 1.6-1.6v-3.4" />
    <path d="M12 15.6V3.8" />
    <path d="m7.4 8.4 4.6-4.6 4.6 4.6" />
  </Glyph>
);

export const IconCompass = (p: P) => (
  <Glyph {...p}>
    <circle cx="12" cy="12" r="8.6" />
    <path d="m15.4 8.6-2 5.4-5.4 2 2-5.4z" />
  </Glyph>
);
