import { T } from "@/lib/tokens";

type PillProps = {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
};

export const Pill = ({ children, active, onClick }: PillProps) => (
  <button
    onClick={onClick}
    style={{
      background: active ? "#1a2d4a" : "transparent",
      color: active ? "#7aacf0" : T.muted,
      border: `1px solid ${active ? "rgba(59,130,246,0.28)" : T.border}`,
      borderRadius: 99,
      padding: "4px 13px",
      fontSize: 11.5,
      fontWeight: 600,
      cursor: "pointer",
      transition: "all 0.2s ease",
      fontFamily: "inherit",
    }}
  >
    {children}
  </button>
);
