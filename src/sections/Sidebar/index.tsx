import { T } from "@/lib/tokens";
import { Avatar } from "@/components/Common/Avatar";
import { useUserStore } from "@/store/useUserStore";
import { supabase } from "@/lib/supabase";

type View = string;

type NavItem = {
  icon: string;
  label: string;
  hash: string;
};

const NAV_ITEMS: NavItem[] = [
  { icon: "▣", label: "Dashboard",   hash: "dashboard"  },
  { icon: "≡", label: "Work Orders", hash: "workorders" },
  { icon: "◎", label: "Assets",      hash: "assets"     },
  { icon: "⌂", label: "Locations",   hash: "locations"  },
  { icon: "▦", label: "Inventory",   hash: "parts"      },
  { icon: "◈", label: "Reports",     hash: "reporting"  },
  { icon: "⊙", label: "Settings",    hash: "settings"   },
];

type SidebarProps = {
  currentView: View;
};

export const Sidebar = ({ currentView }: SidebarProps) => {
  const { activeUser } = useUserStore();

  const navigate = (hash: string) => {
    window.location.hash = hash;
  };

  const handleLogout = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await supabase.auth.signOut();
  };

  const userName = activeUser?.fullName ?? "Admin";
  const userRole = activeUser?.role ?? "Maintenance Manager";

  return (
    <aside
      style={{
        width: 212,
        background: T.surface,
        borderRight: `1px solid ${T.border}`,
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        height: "100vh",
        position: "sticky",
        top: 0,
      }}
    >
      {/* Logo */}
      <div style={{ padding: "22px 20px 18px", display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 35,
            height: 35,
            background: "linear-gradient(145deg,#3b82f6,#1d4ed8)",
            borderRadius: 11,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 18,
            boxShadow: "0 4px 14px rgba(59,130,246,0.45)",
            flexShrink: 0,
          }}
        >
          ☁
        </div>
        <span style={{ fontWeight: 700, fontSize: 17, color: T.text, letterSpacing: "-0.03em" }}>
          CMMS
        </span>
      </div>

      <div style={{ height: 1, background: T.border, margin: "0 20px" }} />

      {/* Nav */}
      <nav style={{ flex: 1, padding: "12px 10px", overflowY: "auto" }}>
        {NAV_ITEMS.map(({ icon, label, hash }) => {
          // Inventory maps to #parts hash
          const isActive =
            currentView === hash ||
            (hash === "parts" && currentView === "parts") ||
            (hash === "dashboard" && currentView === "dashboard");

          return (
            <div
              key={label}
              onClick={() => navigate(hash)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "9px 12px",
                borderRadius: 10,
                marginBottom: 1,
                cursor: "pointer",
                background: isActive ? T.blueGlow : "transparent",
                color: isActive ? T.blue : T.muted,
                fontWeight: isActive ? 600 : 400,
                fontSize: 13,
                transition: "all 0.18s ease",
                position: "relative",
              }}
            >
              {isActive && (
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: 3,
                    height: 18,
                    background: T.blue,
                    borderRadius: "0 3px 3px 0",
                  }}
                />
              )}
              <span style={{ fontSize: 12, opacity: isActive ? 1 : 0.6 }}>{icon}</span>
              {label}
            </div>
          );
        })}
      </nav>

      <div style={{ height: 1, background: T.border, margin: "0 20px" }} />

      {/* Account */}
      <div style={{ padding: "14px 16px" }}>
        <div
          style={{
            fontSize: 10,
            color: T.dim,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.07em",
            marginBottom: 10,
          }}
        >
          Account
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <Avatar
            name={userName}
            color="#fbbf24"
            size={33}
            imageUrl={activeUser?.avatarUrl ?? undefined}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 12.5,
                fontWeight: 600,
                color: T.text,
                lineHeight: 1.3,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {userName}
            </div>
            <div style={{ fontSize: 10.5, color: T.dim, fontWeight: 300 }}>{userRole}</div>
          </div>
          <button
            onClick={handleLogout}
            title="Log out"
            style={{
              background: "none",
              border: "none",
              color: T.dim,
              cursor: "pointer",
              fontSize: 14,
              padding: 4,
              lineHeight: 1,
              flexShrink: 0,
            }}
          >
            ↪
          </button>
        </div>
      </div>
    </aside>
  );
};
