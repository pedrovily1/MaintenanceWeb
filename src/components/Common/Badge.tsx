import { T } from "@/lib/tokens";

type BadgeProps = {
  label: string;
  color?: string;
};

export const Badge = ({ label, color = T.muted }: BadgeProps) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      background: color + "18",
      color,
      border: `1px solid ${color}28`,
      padding: "2px 9px",
      borderRadius: 99,
      fontSize: 10.5,
      fontWeight: 600,
      letterSpacing: "0.01em",
      whiteSpace: "nowrap",
    }}
  >
    {label}
  </span>
);
