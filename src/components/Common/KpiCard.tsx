import { useState } from "react";
import { T, inner } from "@/lib/tokens";

type KpiCardProps = {
  value: string | number;
  label: string;
  icon: string;
  color: string;
};

export const KpiCard = ({ value, label, icon, color }: KpiCardProps) => {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        ...inner({ padding: "18px 20px", cursor: "pointer" }),
        transform: hov ? "translateY(-3px)" : "translateY(0)",
        boxShadow: hov ? `0 16px 40px ${color}0d` : "none",
        borderColor: hov ? color + "28" : T.border,
        transition: "all 0.28s cubic-bezier(.34,1.56,.64,1)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div
            style={{
              fontSize: 36,
              fontWeight: 800,
              color,
              lineHeight: 1,
              letterSpacing: "-0.04em",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {value}
          </div>
          <div style={{ fontSize: 11.5, color: T.muted, marginTop: 7, fontWeight: 500 }}>{label}</div>
        </div>
        <div
          style={{
            width: 42,
            height: 42,
            background: color + "14",
            border: `1px solid ${color}28`,
            borderRadius: 13,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 19,
          }}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};
