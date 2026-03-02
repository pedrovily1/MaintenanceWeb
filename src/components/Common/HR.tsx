import { T } from "@/lib/tokens";

export const HR = ({ mx = 20 }: { mx?: number }) => (
  <div style={{ height: 1, background: T.border, margin: `0 ${mx}px` }} />
);
