import { useState } from "react";
import { T, inner } from "@/lib/tokens";
import { Avatar } from "@/components/Common/Avatar";
import { useUserStore } from "@/store/useUserStore";

export const Topbar = () => {
  const [search, setSearch] = useState("");
  const { activeUser } = useUserStore();
  const userName = activeUser?.fullName ?? "Admin";

  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        padding: "0 22px",
        height: 58,
        flexShrink: 0,
        borderBottom: `1px solid ${T.border}`,
        background: T.surface,
        gap: 12,
      }}
    >
      {/* Search */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          gap: 8,
          ...inner({ padding: "7px 14px", borderRadius: 12 }),
          maxWidth: 400,
        }}
      >
        <span style={{ color: T.dim, fontSize: 13 }}>⌕</span>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search anything…"
          style={{
            background: "none",
            border: "none",
            outline: "none",
            color: T.muted,
            fontSize: 13,
            width: "100%",
            fontFamily: "inherit",
          }}
        />
        {search && (
          <span
            onClick={() => setSearch("")}
            style={{ color: T.dim, cursor: "pointer", fontSize: 13 }}
          >
            ✕
          </span>
        )}
      </div>

      {/* Right side */}
      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
        {/* Notification bell */}
        <div style={{ position: "relative", cursor: "pointer" }}>
          <div
            style={{
              ...inner({ width: 34, height: 34, borderRadius: 10 }),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 15,
            }}
          >
            🔔
          </div>
          <div
            style={{
              position: "absolute",
              top: -3,
              right: -3,
              width: 16,
              height: 16,
              background: T.red,
              borderRadius: "50%",
              fontSize: 9,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              color: "#fff",
              border: `2px solid ${T.surface}`,
            }}
          >
            2
          </div>
        </div>

        {/* User */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Avatar
            name={userName}
            color="#fbbf24"
            size={34}
            imageUrl={activeUser?.avatarUrl ?? undefined}
          />
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: T.text, lineHeight: 1.3 }}>
              {userName}
            </div>
            <div style={{ fontSize: 10.5, color: T.dim, fontWeight: 300 }}>
              {activeUser?.role ?? "Maintenance Manager"}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
