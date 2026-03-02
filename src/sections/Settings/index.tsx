import { useState, useEffect } from "react";
import {
  ClipboardList, Cpu, Activity, MapPin, Package, Gauge, Store,
  Clock, Users, HelpCircle, ShieldCheck, UserPlus,
} from "lucide-react";
import { T, inner } from "@/lib/tokens";
import { useSiteStore } from "@/store/useSiteStore";
import { useUserStore } from "@/store/useUserStore";
import { supabase } from "@/lib/supabase";
import { UserInviteModal } from "../Users/components/UserInviteModal";
import type { LucideIcon } from "lucide-react";

/* ─────────────────────── shared design primitives ─────────────────────── */

const Badge = ({ label, color }: { label: string; color: string }) => (
  <span style={{
    display: "inline-flex", alignItems: "center",
    background: color + "18", color,
    border: `1px solid ${color}28`,
    padding: "2px 9px", borderRadius: 99,
    fontSize: 10.5, fontWeight: 600, letterSpacing: "0.01em", whiteSpace: "nowrap",
  }}>
    {label}
  </span>
);

const RuledSection = ({ children, badge }: { children: string; badge?: React.ReactNode }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
    <div style={{ flex: 1, height: 1, background: T.border }} />
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <span style={{
        fontSize: 11, fontWeight: 700, color: T.muted,
        textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap",
      }}>
        {children}
      </span>
      {badge}
    </div>
    <div style={{ flex: 1, height: 1, background: T.border }} />
  </div>
);

const InitialAvatar = ({ name, color, size = 34 }: { name: string; color: string; size?: number }) => (
  <div style={{
    width: size, height: size, borderRadius: "50%", flexShrink: 0,
    background: `linear-gradient(145deg,${color},${color}88)`,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: size * 0.38, fontWeight: 700, color: "#fff",
    boxShadow: `0 0 0 1.5px ${T.surface}, 0 0 0 3px ${color}44`,
  }}>
    {name.trim()[0]?.toUpperCase() ?? "?"}
  </div>
);

const roleColor = (role?: string) =>
  role === "Administrator" ? T.violet : role === "Technician" ? T.blue : T.muted;

/* ─────────────────────── static export / import data ──────────────────── */

interface DataItem { href: string; Icon: LucideIcon; label: string; color: string; }

const EXPORT_ITEMS: DataItem[] = [
  { href: "/settings/export/workorders",       Icon: ClipboardList, label: "Work Orders",       color: T.blue   },
  { href: "/settings/export/assets",           Icon: Cpu,           label: "Assets",             color: T.green  },
  { href: "/settings/export/assetStatus",      Icon: Activity,      label: "Asset Status",       color: T.green  },
  { href: "/settings/export/locations",        Icon: MapPin,        label: "Locations",          color: T.violet },
  { href: "/settings/export/parts",            Icon: Package,       label: "Parts List",         color: T.amber  },
  { href: "/settings/export/partTransactions", Icon: Package,       label: "Parts Transactions", color: T.amber  },
  { href: "/settings/export/meters",           Icon: Gauge,         label: "Meters",             color: T.blue   },
  { href: "/settings/export/readings",         Icon: Gauge,         label: "Readings",           color: T.blue   },
  { href: "/settings/export/vendors",          Icon: Store,         label: "Vendors",            color: T.muted  },
  { href: "/settings/export/timeAndCost",      Icon: Clock,         label: "Time & Cost",        color: T.green  },
  { href: "/settings/export/laborUtilization", Icon: Users,         label: "Labor Utilization",  color: T.violet },
];

const IMPORT_ITEMS: DataItem[] = [
  { href: "/imports/assets",     Icon: Cpu,           label: "Assets",      color: T.green },
  { href: "/imports/parts",      Icon: Package,       label: "Parts",       color: T.amber },
  { href: "/imports/workorders", Icon: ClipboardList, label: "Work Orders", color: T.blue  },
];

function Tile({ item }: { item: DataItem }) {
  const base: React.CSSProperties = {
    ...inner({ padding: "18px 14px" }),
    display: "flex", flexDirection: "column", alignItems: "center",
    textAlign: "center", cursor: "pointer", transition: "all 0.2s ease",
  };
  return (
    <a href={item.href} style={{ textDecoration: "none" }}>
      <div
        style={base}
        onMouseEnter={e => {
          e.currentTarget.style.background = T.surface;
          e.currentTarget.style.borderColor = T.borderHi;
          e.currentTarget.style.transform = "translateY(-2px)";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = T.raised;
          e.currentTarget.style.borderColor = T.border;
          e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        <div style={{
          width: 44, height: 44, borderRadius: 13, margin: "0 auto 10px",
          background: item.color + "14", border: `1px solid ${item.color}28`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <item.Icon size={19} color={item.color} />
        </div>
        <span style={{ fontSize: 12, fontWeight: 500, color: T.muted, lineHeight: 1.4 }}>
          {item.label}
        </span>
      </div>
    </a>
  );
}

/* ─────────────────────── pending invite / site-request types ───────────── */

type PendingInvite = {
  id: string; email: string; full_name: string;
  role: string; requested_at: string; status: string;
};

type SiteRequest = {
  id: string; user_id: string; site_id: string;
  requested_role: string; status: string;
  requested_at: string; user_name: string;
};

/* ─────────────────────── top-level tabs ───────────────────────────────── */

type MainTab = "general" | "users";
type UserSubTab = "users" | "pending" | "site_requests";

const tabStyle = (active: boolean): React.CSSProperties => ({
  padding: "10px 16px", background: "transparent", border: "none",
  borderBottom: `2px solid ${active ? T.blue : "transparent"}`,
  color: active ? T.blue : T.muted,
  fontWeight: active ? 600 : 400, fontSize: 13,
  cursor: "pointer", transition: "all 0.15s",
  whiteSpace: "nowrap", fontFamily: "inherit",
});

const subTabStyle = (active: boolean): React.CSSProperties => ({
  padding: "6px 12px", background: "transparent", border: "none",
  borderBottom: `2px solid ${active ? T.blue : "transparent"}`,
  color: active ? T.blue : T.muted,
  fontWeight: active ? 600 : 400, fontSize: 12,
  cursor: "pointer", transition: "all 0.15s",
  whiteSpace: "nowrap", fontFamily: "inherit",
  display: "flex", alignItems: "center", gap: 6,
});

const actionBtn: React.CSSProperties = {
  background: "#1a2d4a", color: "#7aacf0",
  border: "1px solid rgba(59,130,246,0.28)",
  borderRadius: 12, padding: "8px 16px",
  fontSize: 13, fontWeight: 600, cursor: "pointer",
  fontFamily: "inherit", flexShrink: 0, whiteSpace: "nowrap",
  display: "flex", alignItems: "center", gap: 6,
};

/* ─────────────────────── helpers ───────────────────────────────────────── */

const formatLastVisit = (iso: string) => {
  if (!iso) return "Never";
  const d = new Date(iso);
  const now = new Date();
  const diff = Math.floor(
    (new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime() -
     new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()) /
    86400000
  );
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  return d.toLocaleDateString();
};

/* ═══════════════════════ Main component ════════════════════════════════ */

export const Settings = () => {
  /* ── top-level tab state ── */
  const [mainTab, setMainTab] = useState<MainTab>("general");

  /* ── stores ── */
  const { activeSiteName, activeSiteId, userSites } = useSiteStore();
  const { users, allUsers, activeUser } = useUserStore();

  /* ─── USERS TAB state ──────────────────────────────────────────── */
  const [userSubTab, setUserSubTab] = useState<UserSubTab>("users");
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [pendingInvites, setPendingInvites] = useState<PendingInvite[]>([]);
  const [pendingLoading, setPendingLoading] = useState(false);
  const [siteRequests, setSiteRequests] = useState<SiteRequest[]>([]);
  const [siteRequestsLoading, setSiteRequestsLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const loadPendingInvites = async () => {
    setPendingLoading(true);
    const { data, error } = await supabase
      .from("pending_invites")
      .select("*")
      .eq("status", "pending")
      .order("requested_at", { ascending: false });
    if (!error) setPendingInvites(data || []);
    setPendingLoading(false);
  };

  const loadSiteRequests = async () => {
    if (!activeSiteId) return;
    setSiteRequestsLoading(true);
    try {
      const { data, error } = await supabase
        .from("site_requests")
        .select("id, user_id, site_id, requested_role, status, requested_at")
        .eq("site_id", activeSiteId)
        .eq("status", "pending")
        .order("requested_at", { ascending: false });

      if (error) { setSiteRequests([]); return; }

      const userIds = (data || []).map(r => r.user_id);
      let userMap: Record<string, string> = {};
      if (userIds.length > 0) {
        const { data: usersData } = await supabase
          .from("users").select("id, full_name").in("id", userIds);
        if (usersData)
          userMap = Object.fromEntries(usersData.map(u => [u.id, u.full_name]));
      }

      setSiteRequests(
        (data || []).map(r => ({ ...r, user_name: userMap[r.user_id] || "Unknown User" }))
      );
    } finally {
      setSiteRequestsLoading(false);
    }
  };

  useEffect(() => {
    if (mainTab !== "users") return;
    if (userSubTab === "pending") loadPendingInvites().catch(console.error);
    else if (userSubTab === "site_requests") loadSiteRequests().catch(console.error);
  }, [mainTab, userSubTab, activeSiteId]);

  const handleApproveInvite = async (invite: PendingInvite) => {
    setActionLoading(invite.id);
    try {
      const { error } = await supabase.functions.invoke("clever-task", {
        body: { email: invite.email, full_name: invite.full_name, role: invite.role },
      });
      if (error) throw error;
      await supabase
        .from("pending_invites")
        .update({ status: "approved", reviewed_at: new Date().toISOString() })
        .eq("id", invite.id);
      setPendingInvites(prev => prev.filter(i => i.id !== invite.id));
      alert(`Invite email sent to ${invite.email}`);
    } catch (err: any) {
      alert(`Failed to send invite: ${err.message}`);
    }
    setActionLoading(null);
  };

  const handleRejectInvite = async (invite: PendingInvite) => {
    setActionLoading(invite.id);
    await supabase
      .from("pending_invites")
      .update({ status: "rejected", reviewed_at: new Date().toISOString() })
      .eq("id", invite.id);
    setPendingInvites(prev => prev.filter(i => i.id !== invite.id));
    setActionLoading(null);
  };

  const handleApproveSiteRequest = async (request: SiteRequest) => {
    setActionLoading(request.id);
    try {
      const { error: insertError } = await supabase
        .from("user_sites")
        .insert({ user_id: request.user_id, site_id: request.site_id, site_role: request.requested_role });
      if (insertError && insertError.code !== "23505") throw insertError;

      await supabase
        .from("site_requests")
        .update({
          status: "approved",
          reviewed_at: new Date().toISOString(),
          reviewed_by: (await supabase.auth.getUser()).data.user?.id,
        })
        .eq("id", request.id);
      setSiteRequests(prev => prev.filter(r => r.id !== request.id));
    } catch (err: any) {
      alert(`Failed to approve: ${err.message}`);
    }
    setActionLoading(null);
  };

  const handleDenySiteRequest = async (request: SiteRequest) => {
    setActionLoading(request.id);
    try {
      await supabase
        .from("site_requests")
        .update({
          status: "denied",
          reviewed_at: new Date().toISOString(),
          reviewed_by: (await supabase.auth.getUser()).data.user?.id,
        })
        .eq("id", request.id);
      setSiteRequests(prev => prev.filter(r => r.id !== request.id));
    } catch (err: any) {
      alert(`Failed to deny: ${err.message}`);
    }
    setActionLoading(null);
  };

  /* ─── derived ── */
  const siteName    = activeSiteName ?? "—";
  const memberCount = allUsers.length;
  const siteCount   = userSites.length;

  /* ═══════════════════════ RENDER ════════════════════════════════ */
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
      <style>{`
        .settings-tile-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          gap: 8px;
        }
        .settings-th {
          text-align: left; font-size: 11.5px; font-weight: 500;
          color: ${T.muted}; padding: 10px 16px; border-bottom: 1px solid ${T.border};
          white-space: nowrap;
        }
        .settings-tr:hover td { background: ${T.surface}; }
        .settings-td { padding: 10px 16px; font-size: 13px; color: ${T.text}; border-bottom: 1px solid ${T.border}; }
      `}</style>

      {/* ── Page header ──────────────────────────────────────────── */}
      <div style={{ padding: "20px 22px 0", flexShrink: 0 }}>
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "flex-start",
          gap: 12, flexWrap: "wrap", marginBottom: 12,
        }}>
          <div>
            <h1 style={{ fontSize: 21, fontWeight: 700, color: T.text, letterSpacing: "-0.03em", margin: 0 }}>
              Settings
            </h1>
            <p style={{ fontSize: 12, color: T.muted, fontWeight: 300, marginTop: 3, marginBottom: 0 }}>
              {mainTab === "general" && "Organization profile and data management"}
              {mainTab === "users"   && "Manage team members and access requests"}
            </p>
          </div>

          {mainTab === "general" && (
            <button style={actionBtn}>Edit Profile</button>
          )}
          {mainTab === "users" && (
            <button style={actionBtn} onClick={() => setIsInviteModalOpen(true)}>
              <UserPlus size={14} />
              Create New User
            </button>
          )}
        </div>

        {/* Main tab bar */}
        <div style={{ display: "flex", borderBottom: `1px solid ${T.border}` }}>
          {(["general", "users"] as MainTab[]).map(t => (
            <button key={t} onClick={() => setMainTab(t)} style={tabStyle(mainTab === t)}>
              {t === "general" ? "General" : "Users"}
            </button>
          ))}
        </div>
      </div>

      {/* ── Body ─────────────────────────────────────────────────── */}

      {/* ══ GENERAL TAB ══════════════════════════════════════════ */}
      {mainTab === "general" && (
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 22px 32px" }}>
          <div style={{ maxWidth: 820, margin: "0 auto", display: "flex", flexDirection: "column", gap: 10 }}>

            {/* Org card */}
            <div style={{
              background: T.surface, border: `1px solid ${T.border}`,
              borderRadius: 16, padding: "16px 18px",
              display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap",
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: 12, flexShrink: 0,
                background: `linear-gradient(145deg,${T.blue},${T.blue}88)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 20, fontWeight: 700, color: "#fff",
                boxShadow: `0 0 0 1.5px ${T.surface}, 0 0 0 3px ${T.blue}44`,
              }}>
                {siteName.trim()[0]?.toUpperCase() ?? "?"}
              </div>
              <div style={{ flex: 1, minWidth: 100 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: T.text, letterSpacing: "-0.02em", marginBottom: 3 }}>
                  {siteName}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 11, color: T.dim, fontWeight: 300 }}>
                    {memberCount} {memberCount === 1 ? "member" : "members"}
                  </span>
                  {siteCount > 1 && (
                    <span style={{ fontSize: 11, color: T.dim, fontWeight: 300 }}>· {siteCount} sites</span>
                  )}
                  {activeSiteId && (
                    <span style={{ fontSize: 10, color: T.dim, fontFamily: "monospace", opacity: 0.5 }}>
                      {activeSiteId.slice(0, 8)}…
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div style={{ height: 4 }} />

            {/* Your Account */}
            {activeUser && (
              <>
                <RuledSection>Your Account</RuledSection>
                <div style={inner({ padding: "12px 15px", display: "flex", alignItems: "center", gap: 12 })}>
                  <InitialAvatar name={activeUser.fullName} color={roleColor(activeUser.role)} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: T.text, marginBottom: 2 }}>{activeUser.fullName}</div>
                    <div style={{ fontSize: 11, color: T.dim, fontWeight: 300 }}>{activeUser.role}</div>
                  </div>
                  {activeUser.isActive && <Badge label="Active" color={T.green} />}
                </div>
                <div style={{ height: 4 }} />
              </>
            )}

            {/* Export Data */}
            <RuledSection badge={<span style={{ fontSize: 10.5, color: T.dim, fontWeight: 300 }}>{EXPORT_ITEMS.length}</span>}>
              Export Data
            </RuledSection>
            <div className="settings-tile-grid">
              {EXPORT_ITEMS.map(item => <Tile key={item.label} item={item} />)}
            </div>

            <div style={{ height: 4 }} />

            {/* Import Data */}
            <RuledSection>Import Data</RuledSection>
            <div className="settings-tile-grid">
              {IMPORT_ITEMS.map(item => <Tile key={item.label} item={item} />)}
              <div style={{ ...inner({ padding: "18px 14px" }), display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", opacity: 0.35, cursor: "default" }}>
                <div style={{ width: 44, height: 44, borderRadius: 13, margin: "0 auto 10px", background: T.dim + "14", border: `1px solid ${T.dim}28`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <HelpCircle size={19} color={T.dim} />
                </div>
                <span style={{ fontSize: 12, fontWeight: 500, color: T.muted }}>More soon</span>
              </div>
            </div>

            <div style={{ height: 4 }} />

            {/* Permissions */}
            <RuledSection>Permissions</RuledSection>
            <div style={inner({ padding: "12px 15px", display: "flex", alignItems: "center", gap: 14 })}>
              <div style={{
                width: 38, height: 38, borderRadius: 11, flexShrink: 0,
                background: "rgba(167,139,250,0.12)", border: "1px solid rgba(167,139,250,0.25)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <ShieldCheck size={17} color={T.violet} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: T.text, marginBottom: 2 }}>Roles & Permissions</div>
                <div style={{ fontSize: 11, color: T.dim, fontWeight: 300 }}>Manage access levels for your team members</div>
              </div>
              <button style={{
                background: "transparent", color: T.blue,
                border: "1px solid rgba(59,130,246,0.28)",
                borderRadius: 8, padding: "5px 14px",
                fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", flexShrink: 0,
              }}>
                Manage
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ══ USERS TAB ════════════════════════════════════════════ */}
      {mainTab === "users" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

          {/* User sub-tab bar */}
          <div style={{
            display: "flex", alignItems: "center", gap: 4,
            padding: "0 22px", borderBottom: `1px solid ${T.border}`,
            flexShrink: 0,
          }}>
            <button onClick={() => setUserSubTab("users")} style={subTabStyle(userSubTab === "users")}>
              All Users
              <span style={{
                fontSize: 10, fontWeight: 700, color: T.muted,
                background: T.raised, border: `1px solid ${T.border}`,
                borderRadius: 99, padding: "1px 6px",
              }}>
                {allUsers.length}
              </span>
            </button>
            <button onClick={() => setUserSubTab("pending")} style={subTabStyle(userSubTab === "pending")}>
              Pending Invites
              {pendingInvites.length > 0 && (
                <span style={{
                  fontSize: 10, fontWeight: 700, color: "#fff",
                  background: T.red, borderRadius: 99, padding: "1px 6px",
                }}>
                  {pendingInvites.length}
                </span>
              )}
            </button>
            <button onClick={() => setUserSubTab("site_requests")} style={subTabStyle(userSubTab === "site_requests")}>
              Site Requests
              {siteRequests.length > 0 && (
                <span style={{
                  fontSize: 10, fontWeight: 700, color: "#fff",
                  background: T.amber, borderRadius: 99, padding: "1px 6px",
                }}>
                  {siteRequests.length}
                </span>
              )}
            </button>
          </div>

          {/* Table area */}
          <div style={{ flex: 1, overflow: "auto", padding: "16px 22px" }}>

            {/* ── All Users ── */}
            {userSubTab === "users" && (
              <div style={{
                background: T.surface, border: `1px solid ${T.border}`,
                borderRadius: 14, overflow: "hidden",
              }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <th className="settings-th">Full Name</th>
                      <th className="settings-th">Role</th>
                      <th className="settings-th">Last Visit</th>
                      <th className="settings-th">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allUsers.map(user => (
                      <tr key={user.id} className="settings-tr" style={{ opacity: user.isActive ? 1 : 0.5 }}>
                        <td className="settings-td">
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <InitialAvatar name={user.fullName} color={roleColor(user.role)} size={30} />
                            <span style={{ fontWeight: 500 }}>{user.fullName}</span>
                          </div>
                        </td>
                        <td className="settings-td" style={{ color: T.muted }}>
                          {user.role}
                        </td>
                        <td className="settings-td" style={{ color: T.muted }}>
                          {formatLastVisit(user.lastVisit)}
                        </td>
                        <td className="settings-td">
                          <Badge
                            label={user.isActive ? "Active" : "Inactive"}
                            color={user.isActive ? T.green : T.dim}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div style={{
                  padding: "10px 16px", fontSize: 12, color: T.dim,
                  borderTop: `1px solid ${T.border}`,
                }}>
                  {allUsers.length > 0 ? `1 – ${allUsers.length} of ${allUsers.length} users` : "No users"}
                </div>
              </div>
            )}

            {/* ── Pending Invites ── */}
            {userSubTab === "pending" && (
              pendingLoading ? (
                <div style={{ textAlign: "center", padding: "48px 0", color: T.muted, fontSize: 13 }}>Loading…</div>
              ) : pendingInvites.length === 0 ? (
                <div style={{ textAlign: "center", padding: "48px 0", color: T.muted }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>✓</div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: T.text, marginBottom: 4 }}>No pending invite requests</div>
                  <div style={{ fontSize: 12 }}>New access requests will appear here</div>
                </div>
              ) : (
                <div style={{
                  background: T.surface, border: `1px solid ${T.border}`,
                  borderRadius: 14, overflow: "hidden",
                }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr>
                        <th className="settings-th">Name</th>
                        <th className="settings-th">Email</th>
                        <th className="settings-th">Role</th>
                        <th className="settings-th">Requested</th>
                        <th className="settings-th">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingInvites.map(invite => (
                        <tr key={invite.id} className="settings-tr">
                          <td className="settings-td" style={{ fontWeight: 500 }}>{invite.full_name}</td>
                          <td className="settings-td" style={{ color: T.muted }}>{invite.email}</td>
                          <td className="settings-td">
                            <Badge label={invite.role} color={T.blue} />
                          </td>
                          <td className="settings-td" style={{ color: T.muted }}>
                            {new Date(invite.requested_at).toLocaleDateString()}
                          </td>
                          <td className="settings-td">
                            <div style={{ display: "flex", gap: 6 }}>
                              <button
                                disabled={actionLoading === invite.id}
                                onClick={() => handleApproveInvite(invite)}
                                style={{
                                  background: T.green + "22", color: T.green,
                                  border: `1px solid ${T.green}44`,
                                  borderRadius: 7, padding: "4px 12px",
                                  fontSize: 11.5, fontWeight: 700,
                                  cursor: "pointer", fontFamily: "inherit",
                                  opacity: actionLoading === invite.id ? 0.5 : 1,
                                }}
                              >
                                {actionLoading === invite.id ? "…" : "Approve"}
                              </button>
                              <button
                                disabled={actionLoading === invite.id}
                                onClick={() => handleRejectInvite(invite)}
                                style={{
                                  background: T.red + "18", color: T.red,
                                  border: `1px solid ${T.red}33`,
                                  borderRadius: 7, padding: "4px 12px",
                                  fontSize: 11.5, fontWeight: 700,
                                  cursor: "pointer", fontFamily: "inherit",
                                  opacity: actionLoading === invite.id ? 0.5 : 1,
                                }}
                              >
                                Reject
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            )}

            {/* ── Site Requests ── */}
            {userSubTab === "site_requests" && (
              siteRequestsLoading ? (
                <div style={{ textAlign: "center", padding: "48px 0", color: T.muted, fontSize: 13 }}>Loading…</div>
              ) : siteRequests.length === 0 ? (
                <div style={{ textAlign: "center", padding: "48px 0", color: T.muted }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>✓</div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: T.text, marginBottom: 4 }}>No pending site requests</div>
                  <div style={{ fontSize: 12 }}>When users request access to this site, they'll appear here</div>
                </div>
              ) : (
                <div style={{
                  background: T.surface, border: `1px solid ${T.border}`,
                  borderRadius: 14, overflow: "hidden",
                }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr>
                        <th className="settings-th">User</th>
                        <th className="settings-th">Requested Role</th>
                        <th className="settings-th">Requested</th>
                        <th className="settings-th">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {siteRequests.map(req => (
                        <tr key={req.id} className="settings-tr">
                          <td className="settings-td" style={{ fontWeight: 500 }}>{req.user_name}</td>
                          <td className="settings-td">
                            <Badge label={req.requested_role} color={T.amber} />
                          </td>
                          <td className="settings-td" style={{ color: T.muted }}>
                            {new Date(req.requested_at).toLocaleDateString()}
                          </td>
                          <td className="settings-td">
                            <div style={{ display: "flex", gap: 6 }}>
                              <button
                                disabled={actionLoading === req.id}
                                onClick={() => handleApproveSiteRequest(req)}
                                style={{
                                  background: T.green + "22", color: T.green,
                                  border: `1px solid ${T.green}44`,
                                  borderRadius: 7, padding: "4px 12px",
                                  fontSize: 11.5, fontWeight: 700,
                                  cursor: "pointer", fontFamily: "inherit",
                                  opacity: actionLoading === req.id ? 0.5 : 1,
                                }}
                              >
                                {actionLoading === req.id ? "…" : "Approve"}
                              </button>
                              <button
                                disabled={actionLoading === req.id}
                                onClick={() => handleDenySiteRequest(req)}
                                style={{
                                  background: T.red + "18", color: T.red,
                                  border: `1px solid ${T.red}33`,
                                  borderRadius: 7, padding: "4px 12px",
                                  fontSize: 11.5, fontWeight: 700,
                                  cursor: "pointer", fontFamily: "inherit",
                                  opacity: actionLoading === req.id ? 0.5 : 1,
                                }}
                              >
                                Deny
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* ── Modal ────────────────────────────────────────────────── */}
      <UserInviteModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
      />
    </div>
  );
};
