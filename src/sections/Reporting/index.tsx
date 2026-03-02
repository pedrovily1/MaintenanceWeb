import { useMemo, useState } from "react";
import { useWorkOrderStore } from "@/store/useWorkOrderStore";
import { ExportData } from "./components/ExportData";
import { T, card } from "@/lib/tokens";

type Tab = "work-orders" | "asset-health" | "details" | "activity" | "export" | "dashboards";

const TABS: { key: Tab; label: string }[] = [
  { key: "work-orders", label: "Work Orders" },
  { key: "asset-health", label: "Asset Health" },
  { key: "details", label: "Reporting Details" },
  { key: "activity", label: "Recent Activity" },
  { key: "export", label: "Export Data" },
  { key: "dashboards", label: "Custom Dashboards" },
];

const tabStyle = (active: boolean) => ({
  flex: 1,
  padding: "12px 8px",
  background: "transparent",
  border: "none",
  borderBottom: active ? `2px solid ${T.blue}` : "2px solid transparent",
  color: active ? T.blue : T.muted,
  fontWeight: 500,
  fontSize: 13,
  cursor: "pointer",
  whiteSpace: "nowrap",
  transition: "all 0.15s",
} as const);

const filterPill: React.CSSProperties = {
  padding: "4px 12px",
  border: `1px solid ${T.border}`,
  borderRadius: 6,
  color: T.text,
  background: "transparent",
  cursor: "pointer",
  fontSize: 12,
};

const outlineBtn: React.CSSProperties = {
  padding: "6px 16px",
  border: `1px solid ${T.blue}`,
  borderRadius: 6,
  color: T.blue,
  background: "transparent",
  cursor: "pointer",
  fontSize: 13,
  fontWeight: 600,
};

const accentBtn: React.CSSProperties = {
  padding: "8px 20px",
  border: `1px solid ${T.blue}`,
  borderRadius: 6,
  color: "#fff",
  background: T.blue,
  cursor: "pointer",
  fontSize: 13,
  fontWeight: 600,
};

const ghostBtn: React.CSSProperties = {
  fontSize: 12,
  color: T.blue,
  background: "transparent",
  border: "none",
  cursor: "pointer",
  flexShrink: 0,
};

export const Reporting = () => {
  const { workOrders } = useWorkOrderStore();
  const [activeTab, setActiveTab] = useState<Tab>("work-orders");
  const [dateRange, setDateRange] = useState<{ start: Date; end: Date }>({
    start: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    end: new Date(),
  });

  const filteredData = useMemo(() => {
    return workOrders.filter((wo) => {
      const createdAt = new Date(wo.createdAt);
      const completedAt = wo.completedAt ? new Date(wo.completedAt) : null;
      const isInRange = (date: Date) => date >= dateRange.start && date <= dateRange.end;
      return isInRange(createdAt) || (completedAt && isInRange(completedAt));
    });
  }, [workOrders, dateRange]);

  const metrics = useMemo(() => {
    const created = filteredData.filter((wo) => {
      const d = new Date(wo.createdAt);
      return d >= dateRange.start && d <= dateRange.end;
    }).length;

    const completed = filteredData.filter((wo) => {
      if (!wo.completedAt) return false;
      const d = new Date(wo.completedAt);
      return d >= dateRange.start && d <= dateRange.end;
    }).length;

    const completionRate = created > 0 ? (completed / created) * 100 : 0;

    const byType = {
      Preventive: filteredData.filter((wo) => wo.workType === "Preventive").length,
      Reactive: filteredData.filter((wo) => wo.workType === "Corrective").length,
      Inspection: filteredData.filter((wo) => wo.workType === "Inspection").length,
      Other: filteredData.filter((wo) => wo.workType === "Other").length,
    };

    const totalByWorkType = byType.Preventive + byType.Reactive + byType.Inspection + byType.Other;
    const preventiveRatio = totalByWorkType > 0 ? (byType.Preventive / totalByWorkType) * 100 : 0;

    const repeating = filteredData.filter((wo) => wo.isRepeating).length;
    const nonRepeating = filteredData.length - repeating;
    const repeatingRatio = filteredData.length > 0 ? (repeating / filteredData.length) * 100 : 0;

    const statusDist = {
      Open: filteredData.filter((wo) => wo.status === "Open").length,
      OnHold: filteredData.filter((wo) => wo.status === "On Hold").length,
      InProgress: filteredData.filter((wo) => wo.status === "In Progress").length,
      Done: filteredData.filter((wo) => wo.status === "Done").length,
      SkippedCanceled: 0,
    };

    const priorityDist = {
      None: filteredData.filter((wo) => !wo.priority).length,
      Low: filteredData.filter((wo) => wo.priority === "Low").length,
      Medium: filteredData.filter((wo) => wo.priority === "Medium").length,
      High: filteredData.filter((wo) => wo.priority === "High").length,
    };

    const totalTime = filteredData.reduce((acc, wo) => acc + (wo.totalTimeHours || 0), 0);
    const totalCost = filteredData.reduce((acc, wo) => acc + (wo.totalCost || 0), 0);

    const completedWOs = filteredData.filter(wo => wo.status === "Done" && wo.completedAt);
    const totalHoursToComplete = completedWOs.reduce((acc, wo) => {
      const start = new Date(wo.createdAt).getTime();
      const end = new Date(wo.completedAt!).getTime();
      return acc + (end - start) / (1000 * 60 * 60);
    }, 0);
    const avgHoursToComplete = completedWOs.length > 0 ? totalHoursToComplete / completedWOs.length : 0;

    const nonRepeatingCompleted = completedWOs.filter(wo => !wo.isRepeating);
    const mttr = nonRepeatingCompleted.length > 0
      ? nonRepeatingCompleted.reduce((acc, wo) => {
          const start = new Date(wo.createdAt).getTime();
          const end = new Date(wo.completedAt!).getTime();
          return acc + (end - start) / (1000 * 60 * 60);
        }, 0) / nonRepeatingCompleted.length
      : 0;

    const now = new Date();
    const overdue = filteredData.filter(wo => wo.status !== "Done" && new Date(wo.dueDate) < now).length;
    const onTime = filteredData.length - overdue;

    const inspectionStats = filteredData.reduce((acc, wo) => {
      if (wo.workType === "Inspection") {
        const passFields = wo.sections.flatMap(s => s.fields).filter(f => f.label.toLowerCase().includes("pass")).length;
        const failFields = wo.sections.flatMap(s => s.fields).filter(f => f.label.toLowerCase().includes("fail")).length;
        acc.pass += passFields;
        acc.fail += failFields;
      }
      return acc;
    }, { pass: 0, fail: 0, flag: 0 });

    const byAsset = filteredData.reduce((acc, wo) => {
      acc[wo.asset] = (acc[wo.asset] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byUser = filteredData.reduce((acc, wo) => {
      acc[wo.assignedTo] = (acc[wo.assignedTo] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      created, completed, completionRate, byType, preventiveRatio,
      repeating, nonRepeating, repeatingRatio, statusDist, priorityDist,
      totalTime, totalCost, totalHoursToComplete, avgHoursToComplete, mttr,
      overdue, onTime, inspectionStats, byAsset, byUser,
    };
  }, [filteredData, dateRange]);

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden", background: T.bg }}>

      {/* Header */}
      <div style={{
        padding: "16px 24px",
        borderBottom: `1px solid ${T.border}`,
        background: T.surface,
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        gap: 16,
      }}>
        <h2 style={{ fontSize: 28, fontWeight: 700, letterSpacing: -0.5, color: T.text, margin: 0 }}>Reporting</h2>
        <span style={{ color: T.muted, fontSize: 13 }}>
          {dateRange.start.toLocaleDateString()} – {dateRange.end.toLocaleDateString()}
        </span>
        <button
          style={{ fontSize: 13, color: T.blue, background: "transparent", border: "none", cursor: "pointer", padding: "4px 8px" }}
          onClick={() => {
            const start = window.prompt("Enter Start Date (YYYY-MM-DD):", dateRange.start.toISOString().split("T")[0]);
            const end = window.prompt("Enter End Date (YYYY-MM-DD):", dateRange.end.toISOString().split("T")[0]);
            if (start && end) setDateRange({ start: new Date(start), end: new Date(end) });
          }}
        >
          Date Presets
        </button>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 13, color: T.muted }}>
          Total Time: {metrics.totalTime.toFixed(1)}h &nbsp;|&nbsp; Total Cost: ${metrics.totalCost.toFixed(2)}
        </span>
        <button style={outlineBtn}>Export</button>
        <button style={accentBtn}>Build report</button>
      </div>

      {/* Tab Bar */}
      <div style={{
        display: "flex",
        borderBottom: `1px solid ${T.border}`,
        background: T.surface,
        flexShrink: 0,
        overflowX: "auto",
      }}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)} style={tabStyle(activeTab === t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={{ flex: 1, overflow: "auto" }}>

        {activeTab === "work-orders" && (
          <div style={{ padding: "16px 24px 48px" }}>

            {/* Filter pills */}
            <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
              {["Assigned To", "Due Date", "Location", "Priority", "Add Filter"].map(f => (
                <button key={f} style={filterPill}>{f}</button>
              ))}
              <div style={{ flex: 1 }} />
              <button style={filterPill}>My Filters</button>
            </div>

            {/* Section header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ fontSize: 18, fontWeight: 600, margin: 0, color: T.text }}>Work Orders</h3>
              <div style={{ display: "flex", gap: 16, fontSize: 13 }}>
                <span style={{ color: T.muted }}>Overdue: <span style={{ color: T.red, fontWeight: 700 }}>{metrics.overdue}</span></span>
                <span style={{ color: T.muted }}>On-Time: <span style={{ color: T.green, fontWeight: 700 }}>{metrics.onTime}</span></span>
                <span style={{ color: T.muted }}>MTTR: <span style={{ color: T.text, fontWeight: 700 }}>{metrics.mttr.toFixed(1)}h</span></span>
              </div>
            </div>

            {/* Created vs Completed */}
            <div style={card({ borderRadius: 12, padding: 24, marginBottom: 16, overflow: "visible" })}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <span style={{ fontSize: 16, fontWeight: 600, color: T.blue }}>Created vs. Completed</span>
                <button style={ghostBtn}>Add to Dashboard</button>
              </div>
              <div style={{ display: "flex", gap: 32, alignItems: "flex-start", marginBottom: 24 }}>
                <div style={{ display: "flex", gap: 16 }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 48, fontWeight: 700, color: T.text, lineHeight: 1 }}>{metrics.created}</div>
                    <div style={{ marginTop: 8, padding: "4px 12px", border: `1px solid ${T.blue}`, color: T.blue, borderRadius: 4, fontSize: 12 }}>Created</div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 48, fontWeight: 700, color: T.green, lineHeight: 1 }}>{metrics.completed}</div>
                    <div style={{ marginTop: 8, padding: "4px 12px", border: `1px solid ${T.green}`, color: T.green, borderRadius: 4, fontSize: 12 }}>Completed</div>
                  </div>
                </div>
                <div style={{ flex: 1, textAlign: "center" }}>
                  <div style={{ fontSize: 48, fontWeight: 700, color: T.text }}>
                    {metrics.completionRate.toFixed(1)}<span style={{ fontSize: 24 }}>%</span>
                  </div>
                  <div style={{ color: T.muted, marginTop: 8, fontSize: 14 }}>Percent Completed</div>
                  {metrics.completed > metrics.created && (
                    <div style={{ color: T.muted, fontSize: 12, marginTop: 4 }}>*More Work Orders were completed than created during this period</div>
                  )}
                </div>
              </div>
              <div style={{ height: 80, background: T.raised, border: `1px solid ${T.border}`, borderRadius: 8, display: "flex", alignItems: "flex-end", gap: 8, padding: "12px 16px" }}>
                {[40, 60, 45, 80, 55, 90, 70].map((h, i) => (
                  <div key={i} style={{ flex: 1, background: T.blueGlow, borderTop: `2px solid ${T.blue}`, height: `${h}%`, borderRadius: "2px 2px 0 0" }} />
                ))}
              </div>
            </div>

            {/* By Type + Repeating */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>

              <div style={card({ borderRadius: 12, padding: 24, overflow: "visible" })}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <span style={{ fontSize: 15, fontWeight: 600, color: T.blue }}>Work Orders by Type</span>
                  <button style={ghostBtn}>Add to Dashboard</button>
                </div>
                <div style={{ display: "flex", gap: 24, alignItems: "flex-start", marginBottom: 16 }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {[
                      { label: "Preventive", count: metrics.byType.Preventive, color: T.green },
                      { label: "Reactive", count: metrics.byType.Reactive, color: T.blue },
                      { label: "Inspection", count: metrics.byType.Inspection, color: T.muted },
                      { label: "Other", count: metrics.byType.Other, color: T.dim },
                    ].map(row => (
                      <div key={row.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 20, fontWeight: 700, color: T.text }}>{row.count}</span>
                        <span style={{ fontSize: 11, padding: "2px 8px", border: `1px solid ${row.color}`, color: row.color, borderRadius: 4 }}>{row.label}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ flex: 1, textAlign: "center" }}>
                    <div style={{ fontSize: 36, fontWeight: 700, color: T.text }}>{metrics.preventiveRatio.toFixed(1)}<span style={{ fontSize: 18 }}>%</span></div>
                    <div style={{ color: T.muted, fontSize: 12, marginTop: 4 }}>Total Preventive Ratio</div>
                  </div>
                </div>
                <div style={{ height: 56, display: "flex", gap: 8, alignItems: "flex-end" }}>
                  <div style={{ flex: 1, background: T.green, opacity: 0.6, borderRadius: 4, height: `${Math.max(4, metrics.preventiveRatio)}%` }} />
                  <div style={{ flex: 1, background: T.blue, opacity: 0.6, borderRadius: 4, height: `${Math.max(4, 100 - metrics.preventiveRatio)}%` }} />
                </div>
              </div>

              <div style={card({ borderRadius: 12, padding: 24, overflow: "visible" })}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <span style={{ fontSize: 15, fontWeight: 600, color: T.blue }}>Non-Repeating vs. Repeating</span>
                  <button style={ghostBtn}>Add to Dashboard</button>
                </div>
                <div style={{ display: "flex", gap: 24, alignItems: "flex-start", marginBottom: 16 }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {[
                      { label: "Non-Repeating", count: metrics.nonRepeating },
                      { label: "Repeating", count: metrics.repeating },
                    ].map(row => (
                      <div key={row.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 20, fontWeight: 700, color: T.text }}>{row.count}</span>
                        <span style={{ fontSize: 11, padding: "2px 8px", border: `1px solid ${T.border}`, color: T.muted, borderRadius: 4 }}>{row.label}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ flex: 1, textAlign: "center" }}>
                    <div style={{ fontSize: 36, fontWeight: 700, color: T.text }}>{metrics.repeatingRatio.toFixed(1)}<span style={{ fontSize: 18 }}>%</span></div>
                    <div style={{ color: T.muted, fontSize: 12, marginTop: 4 }}>Repeating Ratio</div>
                  </div>
                </div>
                {filteredData.length > 0 ? (
                  <div style={{ height: 56, display: "flex", gap: 8, alignItems: "flex-end" }}>
                    <div style={{ flex: 1, background: T.dim, borderRadius: 4, height: `${Math.max(4, 100 - metrics.repeatingRatio)}%` }} />
                    <div style={{ flex: 1, background: T.blue, opacity: 0.6, borderRadius: 4, height: `${Math.max(4, metrics.repeatingRatio)}%` }} />
                  </div>
                ) : (
                  <div style={{ color: T.muted, textAlign: "center", fontSize: 13, padding: 16 }}>No data</div>
                )}
              </div>
            </div>

            {/* Status + Priority */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              <div style={card({ borderRadius: 12, padding: 24, overflow: "visible" })}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <span style={{ fontSize: 15, fontWeight: 600, color: T.text }}>Status</span>
                  <button style={ghostBtn}>Add to Dashboard</button>
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
                  {[
                    `Open: ${metrics.statusDist.Open}`,
                    `On Hold: ${metrics.statusDist.OnHold}`,
                    `In Progress: ${metrics.statusDist.InProgress}`,
                    `Done: ${metrics.statusDist.Done}`,
                    `Skipped/Canceled: ${metrics.statusDist.SkippedCanceled}`,
                  ].map(s => (
                    <span key={s} style={{ fontSize: 11, padding: "3px 8px", border: `1px solid ${T.border}`, color: T.muted, borderRadius: 4 }}>{s}</span>
                  ))}
                </div>
                <div style={{ height: 80, background: T.raised, border: `1px solid ${T.border}`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: T.muted, fontSize: 13 }}>
                  {filteredData.length > 0 ? "Status distribution" : "No data"}
                </div>
              </div>

              <div style={card({ borderRadius: 12, padding: 24, overflow: "visible" })}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <span style={{ fontSize: 15, fontWeight: 600, color: T.text }}>Priority</span>
                  <button style={ghostBtn}>Add to Dashboard</button>
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
                  {[
                    `None: ${metrics.priorityDist.None}`,
                    `Low: ${metrics.priorityDist.Low}`,
                    `Medium: ${metrics.priorityDist.Medium}`,
                    `High: ${metrics.priorityDist.High}`,
                  ].map(s => (
                    <span key={s} style={{ fontSize: 11, padding: "3px 8px", border: `1px solid ${T.border}`, color: T.muted, borderRadius: 4 }}>{s}</span>
                  ))}
                </div>
                <div style={{ height: 80, background: T.raised, border: `1px solid ${T.border}`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: T.muted, fontSize: 13 }}>
                  {filteredData.length > 0 ? "Priority distribution" : "No data"}
                </div>
              </div>
            </div>

            {/* Repeating WO table */}
            <div style={card({ borderRadius: 12, padding: 24, marginBottom: 16, overflow: "visible" })}>
              <h4 style={{ fontSize: 15, fontWeight: 600, margin: "0 0 16px", color: T.text }}>Repeating Work Orders</h4>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${T.border}` }}>
                      {["ID", "Title", "Status", "Priority", "Due Date"].map(h => (
                        <th key={h} style={{ padding: "8px 12px", textAlign: "left", color: T.muted, fontWeight: 600, fontSize: 12 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.filter(wo => wo.isRepeating).length > 0 ? (
                      filteredData.filter(wo => wo.isRepeating).map(wo => (
                        <tr key={wo.id} style={{ borderBottom: `1px solid ${T.border}` }}>
                          <td style={{ padding: "10px 12px", color: T.muted }}>{wo.workOrderNumber}</td>
                          <td style={{ padding: "10px 12px", color: T.text }}>{wo.title}</td>
                          <td style={{ padding: "10px 12px" }}>
                            <span style={{
                              padding: "2px 8px", borderRadius: 4, fontSize: 11,
                              background: wo.status === "Done" ? "rgba(52,211,153,0.15)" : "rgba(59,130,246,0.15)",
                              color: wo.status === "Done" ? T.green : T.blue,
                            }}>
                              {wo.status}
                            </span>
                          </td>
                          <td style={{ padding: "10px 12px", color: T.muted }}>{wo.priority}</td>
                          <td style={{ padding: "10px 12px", color: T.muted }}>{new Date(wo.dueDate).toLocaleDateString()}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} style={{ padding: 24, textAlign: "center", color: T.muted, fontStyle: "italic" }}>
                          No repeating work orders in this period
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* By Asset + By User */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              {(["By Asset", "By User"] as const).map(title => {
                const data = title === "By Asset" ? metrics.byAsset : metrics.byUser;
                return (
                  <div key={title} style={card({ borderRadius: 12, padding: 24, overflow: "visible" })}>
                    <h4 style={{ fontSize: 15, fontWeight: 600, margin: "0 0 16px", color: T.text }}>{title}</h4>
                    <div style={{ maxHeight: 192, overflowY: "auto" }}>
                      {Object.entries(data).length > 0 ? Object.entries(data).map(([name, count]) => (
                        <div key={name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: `1px solid ${T.border}`, fontSize: 13 }}>
                          <span style={{ color: T.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{name || "—"}</span>
                          <span style={{ fontWeight: 700, color: T.blue, minWidth: 24, textAlign: "right" }}>{count}</span>
                        </div>
                      )) : (
                        <div style={{ color: T.muted, textAlign: "center", fontStyle: "italic", padding: 16 }}>No data</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Inspections Summary */}
            <div style={card({ borderRadius: 12, padding: 24, marginBottom: 16, overflow: "visible" })}>
              <h4 style={{ fontSize: 15, fontWeight: 600, margin: "0 0 16px", color: T.text }}>Inspections Summary</h4>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                {[
                  { label: "Passes", count: metrics.inspectionStats.pass, color: T.green, bg: "rgba(52,211,153,0.1)" },
                  { label: "Failures", count: metrics.inspectionStats.fail, color: T.red, bg: "rgba(248,113,113,0.1)" },
                  { label: "Flags", count: metrics.inspectionStats.flag, color: T.amber, bg: "rgba(251,191,36,0.1)" },
                ].map(s => (
                  <div key={s.label} style={{ textAlign: "center", padding: 16, background: s.bg, border: `1px solid ${T.border}`, borderRadius: 8 }}>
                    <div style={{ fontSize: 28, fontWeight: 700, color: s.color }}>{s.count}</div>
                    <div style={{ fontSize: 11, color: s.color, fontWeight: 600, textTransform: "uppercase", marginTop: 4 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Suggestions CTA */}
            <div style={{ background: T.blueGlow, border: `1px solid rgba(59,130,246,0.2)`, borderRadius: 12, padding: 24, textAlign: "center" }}>
              <p style={{ fontSize: 16, fontWeight: 600, color: T.text, margin: "0 0 8px" }}>Looking for something else?</p>
              <p style={{ color: T.muted, fontSize: 14, margin: "0 0 16px" }}>
                We would love to hear from you, share all your needs and suggestions for the Reporting Dashboard.
              </p>
              <button style={accentBtn}>Send Suggestions</button>
            </div>

          </div>
        )}

        {activeTab === "export" && (
          <div style={{ padding: 16 }}>
            <ExportData />
          </div>
        )}

        {activeTab !== "work-orders" && activeTab !== "export" && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", color: T.muted, fontStyle: "italic", padding: 80 }}>
            Coming Soon...
          </div>
        )}

      </div>
    </div>
  );
};
