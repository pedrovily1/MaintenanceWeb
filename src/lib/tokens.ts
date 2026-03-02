/** Design tokens — matches the reference cmms-dashboard palette */
export const T = {
  bg:       "#02070f",
  surface:  "#070e1a",
  raised:   "#0c1522",
  border:   "rgba(255,255,255,0.06)",
  borderHi: "rgba(255,255,255,0.10)",
  text:     "#f0f4f8",
  muted:    "#8896a6",
  dim:      "#3d4f62",
  blue:     "#3b82f6",
  blueGlow: "rgba(59,130,246,0.12)",
  green:    "#34d399",
  amber:    "#fbbf24",
  red:      "#f87171",
  violet:   "#a78bfa",
} as const;

/** Surface-level card style */
export const card = (overrides: React.CSSProperties = {}): React.CSSProperties => ({
  background: T.surface,
  border: `1px solid ${T.border}`,
  borderRadius: 20,
  overflow: "hidden",
  ...overrides,
});

/** Raised inner panel style */
export const inner = (overrides: React.CSSProperties = {}): React.CSSProperties => ({
  background: T.raised,
  border: `1px solid ${T.border}`,
  borderRadius: 12,
  ...overrides,
});

export const statusColor = (s: string): string =>
  ({ Scheduled: "#3b82f6", "On Hold": "#fbbf24", Ongoing: "#34d399", Completed: "#8896a6", Emergency: "#f87171" } as Record<string, string>)[s] ?? T.muted;

export const priorityColor = (p: string): string =>
  ({ High: "#f87171", Medium: "#fbbf24", Low: "#34d399" } as Record<string, string>)[p] ?? T.muted;

export const assetStatusColor = (s: string): string =>
  s === "Good" ? "#34d399" : s === "Alert" ? "#fbbf24" : "#f87171";
