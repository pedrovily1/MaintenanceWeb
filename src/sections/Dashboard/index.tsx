import { useMemo, useState } from "react";
import { T, card, inner, statusColor } from "@/lib/tokens";
import { KpiCard } from "@/components/Common/KpiCard";
import { Badge } from "@/components/Common/Badge";
import { Avatar } from "@/components/Common/Avatar";
import { Pill } from "@/components/Common/Pill";
import { HR } from "@/components/Common/HR";
import { DonutChart } from "@/components/Charts/DonutChart";
import { useWorkOrderStore } from "@/store/useWorkOrderStore";
import { useAssetStore } from "@/store/useAssetStore";
import { usePartStore } from "@/store/usePartStore";
import { needsRestock, getTotalStock } from "@/types/part";

const woStatusDisplay = (s: string) =>
    ({ Open: "Scheduled", "On Hold": "On Hold", "In Progress": "Ongoing", Done: "Completed" } as Record<string, string>)[s] ?? s;

const woStatusColor = (s: string) =>
    statusColor(woStatusDisplay(s));

const woColor = (s: string): string =>
    ({ Open: T.blue, "On Hold": T.amber, "In Progress": T.green, Done: T.muted } as Record<string, string>)[s] ?? T.muted;

const COST_BARS = [4, 6, 3, 8, 5, 9, 7, 4, 6, 8, 5, 7, 9, 6, 8, 5, 7, 4, 6, 8, 5, 3, 7, 5, 9, 6, 4, 8, 5, 7];

export const Dashboard = () => {
    const { workOrders } = useWorkOrderStore();
    const { assets } = useAssetStore();
    const { parts } = usePartStore();

    const [woTab, setWoTab] = useState("All");
    const [taskView, setTaskView] = useState("Week");

    const activeWOs = useMemo(
        () => workOrders.filter(wo => !wo.isRepeating),
        [workOrders]
    );


    const assetStatusCounts = useMemo(() => {
        return assets.reduce(
            (acc, asset) => {
                const status = asset.status?.trim();

                if (status === "Out of Service") {
                    acc.critical++;
                } else if (status === "Inactive") {
                    acc.attention++;
                } else {
                    acc.operational++; // default + Active
                }

                return acc;
            },
            { operational: 0, attention: 0, critical: 0 }
        );
    }, [assets]);
    const goodAssets     = assetStatusCounts.operational;
    const alertAssets    = assetStatusCounts.attention;
    const criticalAssets = assetStatusCounts.critical;

    const openCount      = activeWOs.filter(w => w.status !== "Done").length;
    const scheduledCount = activeWOs.filter(w => w.status === "Open").length;
    const lowStock       = parts.filter(p => needsRestock(p)).length;



    const recentWOs = useMemo(
        () => activeWOs.filter(w => w.status !== "Done").slice(0, 4),
        [activeWOs]
    );

    const lowStockParts = useMemo(
        () => parts.filter(p => needsRestock(p)).slice(0, 3),
        [parts]
    );


    return (
        <div
            style={{
                flex: 1,
                overflow: "auto",
                padding: "18px 22px",
                display: "flex",
                flexDirection: "column",
                gap: 14,
                background: T.bg,
            }}
        >
            {/* KPI Strip */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
                <KpiCard value={openCount}       label="Open Work Orders"   icon="⚡" color={T.blue}   />
                <KpiCard value={scheduledCount}  label="Scheduled WOs"      icon="📅" color={T.violet} />
                <KpiCard value={criticalAssets}  label="Critical Assets"    icon="⚠️" color={T.red}    />
                <KpiCard value={lowStock}        label="Parts Low on Stock" icon="📦" color={T.amber}  />
            </div>

            {/* Row 2 */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                {/* My Work Orders */}
                <div style={card()}>
                    <div
                        style={{
                            padding: "16px 20px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
            <span style={{ fontWeight: 600, fontSize: 14, letterSpacing: "-0.015em" }}>
              My Work Orders
            </span>
                        <button
                            onClick={() => { window.location.hash = "workorders"; window.dispatchEvent(new Event("trigger-new-work-order")); }}
                            style={{
                                background: "#1a2d4a",
                                color: "#7aacf0",
                                border: "1px solid rgba(59,130,246,0.22)",
                                borderRadius: 10,
                                padding: "7px 14px",
                                fontSize: 12,
                                fontWeight: 600,
                                cursor: "pointer",
                                fontFamily: "inherit",
                            }}
                        >
                            + New Work Order
                        </button>
                    </div>
                    <div style={{ display: "flex", gap: 2, padding: "0 20px 14px" }}>
                        {["All", "Scheduled", "Ongoing", "Completed"].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setWoTab(tab)}
                                style={{
                                    background: woTab === tab ? T.raised : "transparent",
                                    border: `1px solid ${woTab === tab ? T.borderHi : "transparent"}`,
                                    color: woTab === tab ? T.text : T.dim,
                                    borderRadius: 8,
                                    padding: "4px 9px",
                                    fontSize: 11.5,
                                    fontWeight: woTab === tab ? 600 : 400,
                                    cursor: "pointer",
                                    fontFamily: "inherit",
                                }}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                    <HR />
                    <div style={{ maxHeight: 226, overflowY: "auto" }}>
                        {recentWOs.length === 0 ? (
                            <div style={{ padding: "30px 20px", textAlign: "center", color: T.dim, fontSize: 12 }}>
                                No open work orders
                            </div>
                        ) : (
                            recentWOs.map((wo, i) => {
                                const col = woColor(wo.status);
                                return (
                                    <div key={wo.id}>
                                        <div
                                            onClick={() => { window.location.hash = "workorders"; }}
                                            style={{
                                                padding: "12px 20px",
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 11,
                                                cursor: "pointer",
                                                transition: "background 0.15s",
                                            }}
                                            onMouseEnter={e => (e.currentTarget.style.background = T.raised)}
                                            onMouseLeave={e => (e.currentTarget.style.background = "")}
                                        >
                                            <div style={{ width: 3, height: 34, borderRadius: 99, background: col, flexShrink: 0 }} />
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ display: "flex", gap: 5, alignItems: "center", marginBottom: 4, flexWrap: "wrap" }}>
                          <span style={{ color: T.dim, fontSize: 11, fontFamily: "monospace" }}>
                            {wo.workOrderNumber}
                          </span>
                                                    <Badge label={woStatusDisplay(wo.status)} color={woStatusColor(wo.status)} />
                                                    {wo.priority && <Badge label={wo.priority} color={wo.priority === "High" ? T.red : wo.priority === "Medium" ? T.amber : T.green} />}
                                                </div>
                                                <div
                                                    style={{
                                                        fontSize: 12.5,
                                                        color: T.text,
                                                        fontWeight: 500,
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                        whiteSpace: "nowrap",
                                                    }}
                                                >
                                                    {wo.title}
                                                </div>
                                                {wo.assignedTo && (
                                                    <div style={{ fontSize: 11, color: T.dim, marginTop: 2 }}>👤 {wo.assignedTo}</div>
                                                )}
                                            </div>
                                            <div style={{ textAlign: "right", flexShrink: 0 }}>
                                                <div style={{ fontSize: 9.5, color: T.dim, marginBottom: 2, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                                                    Due
                                                </div>
                                                <div style={{ fontSize: 12, color: T.muted, fontWeight: 600 }}>
                                                    {wo.dueDate ? new Date(wo.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—"}
                                                </div>
                                            </div>
                                            <Avatar name={wo.assignedTo || "?"} color={col} size={28} />
                                        </div>
                                        {i < recentWOs.length - 1 && <HR />}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Asset Overview */}
                <div style={card()}>
                    <div
                        style={{
                            padding: "16px 20px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
            <span style={{ fontWeight: 600, fontSize: 14, letterSpacing: "-0.015em" }}>
              Asset Overview
            </span>
                        <button
                            onClick={() => { window.location.hash = "assets"; }}
                            style={{
                                ...inner({ padding: "5px 12px", borderRadius: 10, border: `1px solid ${T.border}` }),
                                color: T.muted,
                                fontSize: 11.5,
                                cursor: "pointer",
                                fontFamily: "inherit",
                            }}
                        >
                            View All ▾
                        </button>
                    </div>
                    <div style={{ display: "flex" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "0 6px 12px 14px", flexShrink: 0 }}>
                            <DonutChart
                                segments={
                                    assets.length === 0
                                        ? [{ val: 1, color: T.border, label: "" }]
                                        : [
                                            { val: goodAssets,     color: "#34d399", label: "Operational" },
                                            { val: alertAssets,    color: "#fbbf24", label: "Attention"   },
                                            { val: criticalAssets, color: "#f87171", label: "Critical"    },
                                        ]
                                }
                            />
                        </div>
                        <div style={{ flex: 1, padding: "6px 16px 14px 4px", display: "flex", flexDirection: "column", gap: 7, justifyContent: "center" }}>
                            {[
                                { label: "Operational", count: goodAssets,     color: "#34d399" },
                                { label: "Attention",   count: alertAssets,    color: "#fbbf24" },
                                { label: "Critical",    count: criticalAssets, color: "#f87171" },
                            ].map(({ label, count, color }) => (
                                <div
                                    key={label}
                                    style={{
                                        ...inner({ padding: "9px 12px" }),
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        cursor: "pointer",
                                        transition: "border-color 0.15s",
                                    }}
                                    onMouseEnter={e => ((e.currentTarget as HTMLElement).style.borderColor = color + "40")}
                                    onMouseLeave={e => ((e.currentTarget as HTMLElement).style.borderColor = T.border)}
                                >
                                    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                                        <div style={{ width: 7, height: 7, borderRadius: "50%", background: color, boxShadow: `0 0 6px ${color}` }} />
                                        <span style={{ fontSize: 13, fontWeight: 500 }}>{label}</span>
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                                        <Badge label={String(count)} color={color} />
                                        <span style={{ color: T.dim, fontSize: 13 }}>›</span>
                                    </div>
                                </div>
                            ))}
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7, marginTop: 2 }}>
                                {[
                                    { label: "Total Assets", value: assets.length },
                                    { label: "Open WOs",     value: openCount    },
                                ].map(({ label, value }) => (
                                    <div key={label} style={inner({ padding: "10px 12px" })}>
                                        <div style={{ fontSize: 10, color: T.dim, marginBottom: 4, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                                            {label}
                                        </div>
                                        <div style={{ fontSize: 15, fontWeight: 700, color: T.text, letterSpacing: "-0.025em", fontVariantNumeric: "tabular-nums" }}>
                                            {value}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Row 3 */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                {/* Inventory Status */}
                <div style={card()}>
                    <div style={{ padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontWeight: 600, fontSize: 14, letterSpacing: "-0.015em" }}>Inventory Status</span>
                        <button
                            onClick={() => { window.location.hash = "parts"; }}
                            style={{
                                ...inner({ padding: "5px 12px", borderRadius: 10, border: `1px solid ${T.border}` }),
                                color: T.muted,
                                fontSize: 11.5,
                                cursor: "pointer",
                                fontFamily: "inherit",
                            }}
                        >
                            Manage ▾
                        </button>
                    </div>
                    <HR />
                    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 52px 52px 1fr", padding: "8px 20px", gap: 6 }}>
                        {["Part", "Status", "Min", "Stock", "Location"].map(h => (
                            <div key={h} style={{ fontSize: 10, color: T.dim, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em" }}>
                                {h}
                            </div>
                        ))}
                    </div>
                    <HR />
                    {lowStockParts.length === 0 ? (
                        <div style={{ padding: "20px", textAlign: "center", color: T.dim, fontSize: 12 }}>
                            All parts are sufficiently stocked
                        </div>
                    ) : (
                        lowStockParts.map((part, i) => {
                            const stock = getTotalStock(part);
                            return (
                                <div key={part.id}>
                                    <div
                                        style={{
                                            display: "grid",
                                            gridTemplateColumns: "2fr 1fr 52px 52px 1fr",
                                            padding: "12px 20px",
                                            gap: 6,
                                            alignItems: "center",
                                            cursor: "pointer",
                                            transition: "background 0.15s",
                                        }}
                                        onMouseEnter={e => (e.currentTarget.style.background = T.raised)}
                                        onMouseLeave={e => (e.currentTarget.style.background = "")}
                                    >
                                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                            <div style={{ ...inner({ width: 32, height: 32, borderRadius: 10 }), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>
                                                ⚙️
                                            </div>
                                            <div>
                                                <div style={{ fontSize: 12.5, fontWeight: 600, color: T.text }}>{part.name}</div>
                                                <div style={{ fontSize: 10.5, color: T.dim, marginTop: 1, fontWeight: 300 }}>{part.unit}</div>
                                            </div>
                                        </div>
                                        <div>
                                            <Badge label={stock === 0 ? "⚠ Out" : "Low"} color={stock === 0 ? "#f87171" : "#fbbf24"} />
                                        </div>
                                        <div style={{ fontSize: 13, color: T.muted, fontVariantNumeric: "tabular-nums" }}>{part.minStock}</div>
                                        <div style={{ fontSize: 13, color: stock === 0 ? "#f87171" : "#fbbf24", fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{stock}</div>
                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 11.5, color: T.dim }}>
                        {part.inventory?.[0]?.locationName ?? "—"}
                      </span>
                                            <span style={{ color: T.blue, fontSize: 14 }}>›</span>
                                        </div>
                                    </div>
                                    {i < lowStockParts.length - 1 && <HR />}
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Upcoming Tasks (static placeholder matching reference) */}
                <div style={card()}>
                    <div style={{ padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontWeight: 600, fontSize: 14, letterSpacing: "-0.015em" }}>Upcoming Tasks</span>
                        <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
                            <Pill active={taskView === "Week"} onClick={() => setTaskView("Week")}>Week</Pill>
                            <Pill active={taskView === "Month"} onClick={() => setTaskView("Month")}>Month</Pill>
                            <button
                                onClick={() => { window.location.hash = "calendar"; }}
                                style={{
                                    background: "#1a2d4a",
                                    color: "#7aacf0",
                                    border: "1px solid rgba(59,130,246,0.22)",
                                    borderRadius: 10,
                                    padding: "5px 12px",
                                    fontSize: 11.5,
                                    fontWeight: 600,
                                    cursor: "pointer",
                                    fontFamily: "inherit",
                                }}
                            >
                                Scheduler
                            </button>
                        </div>
                    </div>
                    <HR />
                    {[
                        { title: "Work Order Summary",     sub: "Steel Assets",   time: "07:00", tag: "Weekly"  },
                        { title: "Asset Downtime",         sub: "All Assets",     time: "11:00", tag: "Monthly" },
                        { title: "Technician Performance", sub: "Floor Assets",   time: "10:00", tag: "Weekly"  },
                        { title: "Inventory Usage",        sub: "Cooling Assets", time: "10:00", tag: "Monthly" },
                    ].map((task, i, arr) => (
                        <div key={task.title}>
                            <div
                                style={{ padding: "13px 20px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer", transition: "background 0.15s" }}
                                onMouseEnter={e => (e.currentTarget.style.background = T.raised)}
                                onMouseLeave={e => (e.currentTarget.style.background = "")}
                            >
                                <div style={{ ...inner({ width: 36, height: 36, borderRadius: 12 }), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>
                                    📊
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{task.title}</div>
                                    <div style={{ fontSize: 11, color: T.dim, marginTop: 2, fontWeight: 300 }}>{task.sub}</div>
                                </div>
                                <div style={{ textAlign: "right", flexShrink: 0 }}>
                                    <Badge label={task.tag} color={T.blue} />
                                    <div style={{ fontSize: 11.5, color: T.muted, marginTop: 5, fontVariantNumeric: "tabular-nums" }}>
                                        🕐 {task.time}
                                    </div>
                                </div>
                            </div>
                            {i < arr.length - 1 && <HR />}
                        </div>
                    ))}
                </div>
            </div>

            {/* Cost Trend */}
            <div style={card({ padding: "18px 22px" })}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <span style={{ fontWeight: 600, fontSize: 14, letterSpacing: "-0.015em" }}>Maintenance Cost Trend</span>
                    <div style={{ display: "flex", gap: 5 }}>
                        <Pill active>Week</Pill>
                        <Pill>Month</Pill>
                    </div>
                </div>
                <div style={{ height: 56, display: "flex", alignItems: "flex-end", gap: 3 }}>
                    {COST_BARS.map((v, i, a) => {
                        const recent = i > a.length - 9;
                        return (
                            <div
                                key={i}
                                style={{
                                    flex: 1,
                                    height: `${(v / 9) * 100}%`,
                                    background: recent ? `linear-gradient(to top,${T.blue},${T.blue}99)` : T.raised,
                                    borderRadius: "3px 3px 0 0",
                                    border: `1px solid ${recent ? T.blue + "44" : T.border}`,
                                    borderBottom: "none",
                                    boxShadow: recent ? `0 0 10px ${T.blue}22` : "none",
                                    opacity: recent ? 1 : 0.65,
                                }}
                            />
                        );
                    })}
                </div>
                <div style={{ height: 1, background: T.border }} />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 7 }}>
                    {["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map(m => (
                        <span key={m} style={{ fontSize: 10.5, color: T.dim }}>{m}</span>
                    ))}
                </div>
            </div>
        </div>
    );
};