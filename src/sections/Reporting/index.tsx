import { useMemo, useState } from "react";
import { useWorkOrderStore } from "@/store/useWorkOrderStore";
import { ExportData } from "./components/ExportData";

export const Reporting = () => {
  const { workOrders } = useWorkOrderStore();
  const [activeTab, setActiveTab] = useState<'work-orders' | 'asset-health' | 'details' | 'activity' | 'export' | 'dashboards'>('work-orders');
  const [dateRange, setDateRange] = useState<{ start: Date; end: Date }>({
    start: new Date(new Date().setMonth(new Date().getMonth() - 1)), // Last month
    end: new Date(),
  });

  const filteredData = useMemo(() => {
    return workOrders.filter((wo) => {
      const createdAt = new Date(wo.createdAt);
      const completedAt = wo.completedAt ? new Date(wo.completedAt) : null;

      const isInRange = (date: Date) =>
        date >= dateRange.start && date <= dateRange.end;

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
      SkippedCanceled: 0, // Placeholder as not in status type
    };

    const priorityDist = {
      None: filteredData.filter((wo) => !wo.priority).length,
      Low: filteredData.filter((wo) => wo.priority === "Low").length,
      Medium: filteredData.filter((wo) => wo.priority === "Medium").length,
      High: filteredData.filter((wo) => wo.priority === "High").length,
    };

    // Time and Cost
    const totalTime = filteredData.reduce((acc, wo) => acc + (wo.totalTimeHours || 0), 0);
    const totalCost = filteredData.reduce((acc, wo) => acc + (wo.totalCost || 0), 0);

    // Time to complete
    const completedWOs = filteredData.filter(wo => wo.status === 'Done' && wo.completedAt);
    const totalHoursToComplete = completedWOs.reduce((acc, wo) => {
      const start = new Date(wo.createdAt).getTime();
      const end = new Date(wo.completedAt!).getTime();
      return acc + (end - start) / (1000 * 60 * 60);
    }, 0);
    const avgHoursToComplete = completedWOs.length > 0 ? totalHoursToComplete / completedWOs.length : 0;

    // MTTR (non-repeating only)
    const nonRepeatingCompleted = completedWOs.filter(wo => !wo.isRepeating);
    const mttr = nonRepeatingCompleted.length > 0 
      ? nonRepeatingCompleted.reduce((acc, wo) => {
          const start = new Date(wo.createdAt).getTime();
          const end = new Date(wo.completedAt!).getTime();
          return acc + (end - start) / (1000 * 60 * 60);
        }, 0) / nonRepeatingCompleted.length 
      : 0;

    // Overdue
    const now = new Date();
    const overdue = filteredData.filter(wo => wo.status !== 'Done' && new Date(wo.dueDate) < now).length;
    const onTime = filteredData.length - overdue;

    // Inspection pass / flag / fail counts
    const inspectionStats = filteredData.reduce((acc, wo) => {
      if (wo.workType === 'Inspection') {
        const hasFailures = wo.sections.some(s => s.fields.some(f => f.type === 'checkbox' && f.value === false)); // Assuming false means fail in some context, or just count them
        // In this project, we don't have a clear "pass/fail" field, so we'll look for specific field labels if they exist
        const passFields = wo.sections.flatMap(s => s.fields).filter(f => f.label.toLowerCase().includes('pass')).length;
        const failFields = wo.sections.flatMap(s => s.fields).filter(f => f.label.toLowerCase().includes('fail')).length;
        acc.pass += passFields;
        acc.fail += failFields;
      }
      return acc;
    }, { pass: 0, fail: 0, flag: 0 });

    // Grouped counts
    const byAsset = filteredData.reduce((acc, wo) => {
      acc[wo.asset] = (acc[wo.asset] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byUser = filteredData.reduce((acc, wo) => {
      acc[wo.assignedTo] = (acc[wo.assignedTo] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      created,
      completed,
      completionRate,
      byType,
      preventiveRatio,
      repeating,
      nonRepeating,
      repeatingRatio,
      statusDist,
      priorityDist,
      totalTime,
      totalCost,
      totalHoursToComplete,
      avgHoursToComplete,
      mttr,
      overdue,
      onTime,
      inspectionStats,
      byAsset,
      byUser
    };
  }, [filteredData, dateRange]);

  return (
    <div className="relative bg-[var(--panel-2)] box-border caret-transparent flex basis-[0%] flex-col grow overflow-auto">
      <div className="bg-[var(--panel-2)] border-b border-[var(--border)] shadow-[inset_0_-1px_0_rgba(255,255,255,0.03)] box-border caret-transparent shrink-0 px-4 py-4 mb-4">
        <div className="items-center box-border caret-transparent gap-x-4 flex basis-[0%] grow gap-y-4">
          <div className="items-center box-border caret-transparent gap-x-4 flex shrink-0 gap-y-4">
            <h2 className="text-[31.9998px] font-bold box-border caret-transparent shrink-0 tracking-[-0.2px] leading-[39.9997px]">
              Reporting
            </h2>
            <div className="box-border caret-transparent shrink-0">
              <button
                type="button"
                className="items-start bg-transparent caret-transparent gap-x-1 flex shrink-0 justify-between gap-y-1 text-center p-2 rounded-bl rounded-br rounded-tl rounded-tr"
              >
                <span className="box-border caret-transparent flex text-nowrap">
                  {dateRange.start.toLocaleDateString()} - {dateRange.end.toLocaleDateString()}
                </span>
              </button>
            </div>
            <button
              type="button"
              className="text-blue-500 font-medium items-center bg-transparent caret-transparent flex shrink-0 justify-center text-center px-2 py-1 rounded-bl rounded-br rounded-tl rounded-tr hover:bg-gray-100"
              onClick={() => {
                const start = window.prompt("Enter Start Date (YYYY-MM-DD):", dateRange.start.toISOString().split('T')[0]);
                const end = window.prompt("Enter End Date (YYYY-MM-DD):", dateRange.end.toISOString().split('T')[0]);
                if (start && end) {
                  setDateRange({ start: new Date(start), end: new Date(end) });
                }
              }}
            >
              Date Presets
            </button>
          </div>
          <div className="items-center box-border caret-transparent gap-x-4 flex basis-[0%] grow justify-end gap-y-4">
            <div className="text-sm text-gray-500 mr-4">
              Total Time: {metrics.totalTime.toFixed(1)}h | Total Cost: ${metrics.totalCost.toFixed(2)}
            </div>
            <button
              type="button"
              className="relative text-blue-500 font-bold items-center bg-transparent caret-transparent gap-x-1 flex shrink-0 h-8 justify-center tracking-[-0.2px] leading-[14px] gap-y-1 text-center text-nowrap border border-blue-500 px-3 rounded-bl rounded-br rounded-tl rounded-tr border-solid hover:text-blue-400 hover:border-blue-400"
            >
              Export
            </button>
            <button
              type="button"
              className="relative text-white font-bold items-center bg-blue-500 caret-transparent gap-x-1 flex shrink-0 h-10 justify-center tracking-[-0.2px] leading-[14px] gap-y-1 text-center text-nowrap border border-blue-500 px-4 rounded-bl rounded-br rounded-tl rounded-tr border-solid hover:bg-blue-400 hover:border-blue-400"
            >
              Build report
            </button>
          </div>
        </div>
      </div>

      <div className="bg-[var(--panel-2)] border-b border-[var(--border)] box-border caret-transparent flex shrink-0 flex-wrap px-4">
        <button
          type="button"
          onClick={() => setActiveTab('work-orders')}
          className={`${activeTab === 'work-orders' ? 'text-[var(--accent)] border-b-[var(--accent)]' : 'text-[var(--muted)] border-b-transparent'} bg-transparent caret-transparent block basis-[0%] grow text-center -mb-px px-2 py-2.5 border-t-0 border-x-0 border-b-2 hover:bg-[var(--panel)] transition-all`}
        >
          Work Orders
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('asset-health')}
          className={`${activeTab === 'asset-health' ? 'text-[var(--accent)] border-b-[var(--accent)]' : 'text-[var(--muted)] border-b-transparent'} bg-transparent caret-transparent block basis-[0%] grow text-center -mb-px px-2 py-2.5 border-t-0 border-x-0 border-b-2 hover:bg-[var(--panel)] transition-all`}
        >
          Asset Health
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('details')}
          className={`${activeTab === 'details' ? 'text-[var(--accent)] border-b-[var(--accent)]' : 'text-[var(--muted)] border-b-transparent'} bg-transparent caret-transparent block basis-[0%] grow text-center -mb-px px-2 py-2.5 border-t-0 border-x-0 border-b-2 hover:bg-[var(--panel)] transition-all`}
        >
          Reporting Details
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('activity')}
          className={`${activeTab === 'activity' ? 'text-[var(--accent)] border-b-[var(--accent)]' : 'text-[var(--muted)] border-b-transparent'} bg-transparent caret-transparent block basis-[0%] grow text-center -mb-px px-2 py-2.5 border-t-0 border-x-0 border-b-2 hover:bg-[var(--panel)] transition-all`}
        >
          Recent Activity
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('export')}
          className={`${activeTab === 'export' ? 'text-[var(--accent)] border-b-[var(--accent)]' : 'text-[var(--muted)] border-b-transparent'} bg-transparent caret-transparent block basis-[0%] grow text-center -mb-px px-2 py-2.5 border-t-0 border-x-0 border-b-2 hover:bg-[var(--panel)] transition-all`}
        >
          Export Data
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('dashboards')}
          className={`${activeTab === 'dashboards' ? 'text-[var(--accent)] border-b-[var(--accent)]' : 'text-[var(--muted)] border-b-transparent'} bg-transparent caret-transparent block basis-[0%] grow text-center -mb-px px-2 py-2.5 border-t-0 border-x-0 border-b-2 hover:bg-[var(--panel)] transition-all`}
        >
          Custom Dashboards
        </button>
      </div>

      {activeTab === 'work-orders' && (
        <>
          <div className="box-border caret-transparent shrink-0 px-4 py-3">
            <div className="items-center box-border caret-transparent flex shrink-0">
              <div className="box-border caret-transparent flex basis-[0%] grow gap-x-2">
                <button
                  type="button"
                  className="items-center bg-transparent caret-transparent flex h-8 justify-center tracking-[-0.2px] leading-[20.0004px] text-center border border-[var(--border)] px-2 rounded-bl rounded-br rounded-tl rounded-tr border-solid hover:border-neutral-300"
                >
                  Assigned To
                </button>
                <button
                  type="button"
                  className="items-center bg-transparent caret-transparent flex h-8 justify-center tracking-[-0.2px] leading-[20.0004px] text-center border border-[var(--border)] px-2 rounded-bl rounded-br rounded-tl rounded-tr border-solid hover:border-neutral-300"
                >
                  Due Date
                </button>
                <button
                  type="button"
                  className="items-center bg-transparent caret-transparent flex h-8 justify-center tracking-[-0.2px] leading-[20.0004px] text-center border border-[var(--border)] px-2 rounded-bl rounded-br rounded-tl rounded-tr border-solid hover:border-neutral-300"
                >
                  Location
                </button>
                <button
                  type="button"
                  className="items-center bg-transparent caret-transparent flex h-8 justify-center tracking-[-0.2px] leading-[20.0004px] text-center border border-[var(--border)] px-2 rounded-bl rounded-br rounded-tl rounded-tr border-solid hover:border-neutral-300"
                >
                  Priority
                </button>
                <button
                  type="button"
                  className="items-center bg-transparent caret-transparent flex h-8 justify-center tracking-[-0.2px] leading-[20.0004px] text-center border border-[var(--border)] px-2 rounded-bl rounded-br rounded-tl rounded-tr border-solid hover:border-neutral-300"
                >
                  Add Filter
                </button>
              </div>
              <button
                type="button"
                className="items-center bg-transparent caret-transparent flex h-8 justify-center tracking-[-0.2px] leading-[20.0004px] text-center border border-[var(--border)] px-2 rounded-bl rounded-br rounded-tl rounded-tr border-solid hover:border-neutral-300 ml-2"
              >
                My Filters
              </button>
            </div>
          </div>

          <div className="box-border caret-transparent flex basis-[0%] grow overflow-auto px-4 pb-8">
            <div className="box-border caret-transparent w-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-[20.0004px] font-semibold box-border caret-transparent shrink-0 tracking-[-0.2px] leading-[28.0006px]">
                  Work Orders
                </h2>
                <div className="flex gap-4 text-sm text-gray-500">
                  <div>Overdue: <span className="text-red-500 font-bold">{metrics.overdue}</span></div>
                  <div>On-Time: <span className="text-green-500 font-bold">{metrics.onTime}</span></div>
                  <div>MTTR: <span className="font-bold">{metrics.mttr.toFixed(1)}h</span></div>
                </div>
              </div>

          <div className="omp-panel shadow-none box-border caret-transparent border border-[var(--border)] rounded-bl rounded-br rounded-tl rounded-tr border-solid p-6 mb-4">
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                className="text-[var(--accent)] font-medium text-lg hover:text-[var(--accent-2)] transition-colors"
              >
                Created vs. Completed
              </button>
              <button
                type="button"
                className="text-[var(--accent)] font-medium text-sm hover:text-[var(--accent-2)] transition-colors"
              >
                Add to Dashboard
              </button>
            </div>
            <div className="flex items-start gap-8 mb-6">
              <div className="flex gap-4">
                <div className="text-center">
                  <div className="text-5xl font-bold mb-2 text-[var(--text)]">{metrics.created}</div>
                  <div className="text-[var(--accent)] border border-[var(--accent)] px-3 py-1 rounded text-sm">
                    Created
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-bold mb-2 text-[var(--status-active)]">{metrics.completed}</div>
                  <div className="text-[var(--status-active)] border border-[var(--status-active)] px-3 py-1 rounded text-sm">
                    Completed
                  </div>
                </div>
              </div>
              <div className="flex-1 text-center">
                <div className="text-5xl font-bold text-[var(--text)]">
                  {metrics.completionRate.toFixed(1)}<span className="text-2xl">%</span>
                </div>
                <div className="text-[var(--muted)] mt-2">Percent Completed</div>
                <div className="text-[var(--muted)] text-xs mt-1">
                  {metrics.completed > metrics.created ? "*More Work Orders were completed than created during this time period" : ""}
                </div>
              </div>
            </div>
            <div className="h-64 bg-[var(--panel-2)] border border-[var(--border)] rounded flex flex-col items-center justify-center text-[var(--muted)]">
              <div className="text-sm mb-2">Completion Trend (Sample Data)</div>
              <div className="flex items-end gap-2 h-32">
                 {[40, 60, 45, 80, 55, 90, 70].map((h, i) => (
                   <div key={i} className="w-8 bg-blue-200" style={{ height: `${h}%` }}></div>
                 ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="omp-panel shadow-none box-border caret-transparent border border-[var(--border)] rounded-bl rounded-br rounded-tl rounded-tr border-solid p-6">
              <div className="flex items-center justify-between mb-4">
                <button
                  type="button"
                  className="text-blue-500 font-medium text-lg hover:text-blue-400"
                >
                  Work Orders by Type
                </button>
                <button
                  type="button"
                  className="text-blue-500 font-medium text-sm hover:text-blue-400"
                >
                  Add to Dashboard
                </button>
              </div>
              <div className="flex items-start gap-8 mb-6">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <div className="text-2xl font-bold">{metrics.byType.Preventive}</div>
                    <div className="text-teal-500 border border-teal-500 px-2 py-1 rounded text-xs">
                      Preventive
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-2xl font-bold">{metrics.byType.Reactive}</div>
                    <div className="text-blue-500 border border-blue-500 px-2 py-1 rounded text-xs">
                      Reactive
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-2xl font-bold text-gray-400">{metrics.byType.Inspection}</div>
                    <div className="text-gray-400 border border-[var(--border)] px-2 py-1 rounded text-xs">
                      Inspection
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-2xl font-bold text-gray-400">{metrics.byType.Other}</div>
                    <div className="text-gray-400 border border-[var(--border)] px-2 py-1 rounded text-xs">
                      Other
                    </div>
                  </div>
                </div>
                <div className="flex-1 text-center">
                  <div className="text-4xl font-bold">
                    {metrics.preventiveRatio.toFixed(1)}<span className="text-xl">%</span>
                  </div>
                  <div className="text-gray-600 mt-2 text-sm">Total Preventive Ratio</div>
                </div>
              </div>
              <div className="h-48 bg-gray-50 rounded flex items-center justify-center text-gray-400">
                <div className="flex gap-1 items-end h-32">
                  <div className="w-12 bg-teal-400" style={{ height: `${metrics.preventiveRatio}%` }}></div>
                  <div className="w-12 bg-blue-400" style={{ height: `${100 - metrics.preventiveRatio}%` }}></div>
                </div>
              </div>
            </div>

            <div className="omp-panel shadow-none box-border caret-transparent border border-[var(--border)] rounded-bl rounded-br rounded-tl rounded-tr border-solid p-6">
              <div className="flex items-center justify-between mb-4">
                <button
                  type="button"
                  className="text-blue-500 font-medium text-lg hover:text-blue-400"
                >
                  Non-Repeating vs. Repeating
                </button>
                <button
                  type="button"
                  className="text-blue-500 font-medium text-sm hover:text-blue-400"
                >
                  Add to Dashboard
                </button>
              </div>
              <div className="flex items-start gap-8 mb-6">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <div className="text-2xl font-bold">{metrics.nonRepeating}</div>
                    <div className="text-gray-400 border border-[var(--border)] px-2 py-1 rounded text-xs">
                      Non-Repeating
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-2xl font-bold">{metrics.repeating}</div>
                    <div className="text-gray-400 border border-[var(--border)] px-2 py-1 rounded text-xs">
                      Repeating
                    </div>
                  </div>
                </div>
                <div className="flex-1 text-center">
                  <div className="text-4xl font-bold">
                    {metrics.repeatingRatio.toFixed(1)}<span className="text-xl">%</span>
                  </div>
                  <div className="text-gray-600 mt-2 text-sm">Repeating Ratio</div>
                </div>
              </div>
              <div className="h-48 bg-gray-50 rounded flex items-center justify-center text-gray-400">
                {filteredData.length > 0 ? (
                  <div className="flex gap-1 items-end h-32">
                    <div className="w-12 bg-gray-300" style={{ height: `${100 - metrics.repeatingRatio}%` }}></div>
                    <div className="w-12 bg-blue-300" style={{ height: `${metrics.repeatingRatio}%` }}></div>
                  </div>
                ) : "No data"}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="omp-panel shadow-none box-border caret-transparent border border-[var(--border)] rounded-bl rounded-br rounded-tl rounded-tr border-solid p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-lg">Status</h4>
                <button
                  type="button"
                  className="text-blue-500 font-medium text-sm hover:text-blue-400"
                >
                  Add to Dashboard
                </button>
              </div>
              <div className="flex gap-2 flex-wrap mb-4">
                <div className="text-gray-600 border border-[var(--border)] px-2 py-1 rounded text-xs">
                  Open: {metrics.statusDist.Open}
                </div>
                <div className="text-gray-600 border border-[var(--border)] px-2 py-1 rounded text-xs">
                  On Hold: {metrics.statusDist.OnHold}
                </div>
                <div className="text-gray-600 border border-[var(--border)] px-2 py-1 rounded text-xs">
                  In Progress: {metrics.statusDist.InProgress}
                </div>
                <div className="text-gray-600 border border-[var(--border)] px-2 py-1 rounded text-xs">
                  Done: {metrics.statusDist.Done}
                </div>
                <div className="text-gray-400 border border-[var(--border)] px-2 py-1 rounded text-xs">
                  Skipped/Canceled: {metrics.statusDist.SkippedCanceled}
                </div>
              </div>
              <div className="h-48 bg-gray-50 rounded flex items-center justify-center text-gray-400">
                {filteredData.length > 0 ? "Status distribution chart" : "No data"}
              </div>
            </div>

            <div className="omp-panel shadow-none box-border caret-transparent border border-[var(--border)] rounded-bl rounded-br rounded-tl rounded-tr border-solid p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-lg">Priority</h4>
                <button
                  type="button"
                  className="text-blue-500 font-medium text-sm hover:text-blue-400"
                >
                  Add to Dashboard
                </button>
              </div>
              <div className="flex gap-2 flex-wrap mb-4">
                <div className="text-gray-600 border border-[var(--border)] px-2 py-1 rounded text-xs">
                  None: {metrics.priorityDist.None}
                </div>
                <div className="text-gray-600 border border-[var(--border)] px-2 py-1 rounded text-xs">
                  Low: {metrics.priorityDist.Low}
                </div>
                <div className="text-gray-600 border border-[var(--border)] px-2 py-1 rounded text-xs">
                  Medium: {metrics.priorityDist.Medium}
                </div>
                <div className="text-gray-600 border border-[var(--border)] px-2 py-1 rounded text-xs">
                  High: {metrics.priorityDist.High}
                </div>
              </div>
              <div className="h-48 bg-gray-50 rounded flex items-center justify-center text-gray-400">
                {filteredData.length > 0 ? "Priority distribution chart" : "No data"}
              </div>
            </div>
          </div>

          {/* New Table: Repeating Work Orders */}
          <div className="bg-white shadow-[rgba(242,242,242,0.6)_0px_0px_12px_2px] box-border caret-transparent border border-[var(--border)] rounded-bl rounded-br rounded-tl rounded-tr border-solid p-6 mb-8">
            <h4 className="font-medium text-lg mb-4">Repeating Work Orders</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="pb-2 font-semibold">ID</th>
                    <th className="pb-2 font-semibold">Title</th>
                    <th className="pb-2 font-semibold">Status</th>
                    <th className="pb-2 font-semibold">Priority</th>
                    <th className="pb-2 font-semibold">Due Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.filter(wo => wo.isRepeating).length > 0 ? (
                    filteredData.filter(wo => wo.isRepeating).map(wo => (
                      <tr key={wo.id} className="border-b last:border-0">
                        <td className="py-2">{wo.workOrderNumber}</td>
                        <td className="py-2">{wo.title}</td>
                        <td className="py-2">
                           <span className={`px-2 py-1 rounded text-xs ${
                             wo.status === 'Done' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                           }`}>
                             {wo.status}
                           </span>
                        </td>
                        <td className="py-2">{wo.priority}</td>
                        <td className="py-2">{new Date(wo.dueDate).toLocaleDateString()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-4 text-center text-gray-400">No repeating work orders in this period</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-white shadow-[rgba(242,242,242,0.6)_0px_0px_12px_2px] box-border caret-transparent border border-[var(--border)] rounded-bl rounded-br rounded-tl rounded-tr border-solid p-6">
              <h4 className="font-medium text-lg mb-4">By Asset</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                 {Object.entries(metrics.byAsset).length > 0 ? Object.entries(metrics.byAsset).map(([name, count]) => (
                   <div key={name} className="flex justify-between items-center text-sm p-2 border-b last:border-0">
                      <span className="truncate">{name}</span>
                      <span className="font-bold bg-gray-100 px-2 rounded">{count}</span>
                   </div>
                 )) : <div className="text-gray-400 text-center py-4 italic">No data</div>}
              </div>
            </div>
            <div className="bg-white shadow-[rgba(242,242,242,0.6)_0px_0px_12px_2px] box-border caret-transparent border border-[var(--border)] rounded-bl rounded-br rounded-tl rounded-tr border-solid p-6">
              <h4 className="font-medium text-lg mb-4">By User</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                 {Object.entries(metrics.byUser).length > 0 ? Object.entries(metrics.byUser).map(([name, count]) => (
                   <div key={name} className="flex justify-between items-center text-sm p-2 border-b last:border-0">
                      <span className="truncate">{name}</span>
                      <span className="font-bold bg-gray-100 px-2 rounded">{count}</span>
                   </div>
                 )) : <div className="text-gray-400 text-center py-4 italic">No data</div>}
              </div>
            </div>
          </div>

          <div className="bg-white shadow-[rgba(242,242,242,0.6)_0px_0px_12px_2px] box-border caret-transparent border border-[var(--border)] rounded-bl rounded-br rounded-tl rounded-tr border-solid p-6 mb-8">
            <h4 className="font-medium text-lg mb-4">Inspections Summary</h4>
            <div className="grid grid-cols-3 gap-4">
               <div className="text-center p-4 border rounded bg-green-50">
                  <div className="text-2xl font-bold text-green-700">{metrics.inspectionStats.pass}</div>
                  <div className="text-xs text-green-600 uppercase font-semibold">Passes</div>
               </div>
               <div className="text-center p-4 border rounded bg-red-50">
                  <div className="text-2xl font-bold text-red-700">{metrics.inspectionStats.fail}</div>
                  <div className="text-xs text-red-600 uppercase font-semibold">Failures</div>
               </div>
               <div className="text-center p-4 border rounded bg-yellow-50">
                  <div className="text-2xl font-bold text-yellow-700">{metrics.inspectionStats.flag}</div>
                  <div className="text-xs text-yellow-600 uppercase font-semibold">Flags</div>
               </div>
            </div>
          </div>

          <div className="bg-sky-50 border border-blue-200 rounded-lg p-6 text-center">
            <p className="text-lg font-semibold mb-2">Looking for something else?</p>
            <p className="text-gray-600 mb-4">
              We would love to hear from you, share all your needs and suggestions for Reporting Dashboard.
            </p>
            <button
              type="button"
              className="relative text-white font-bold items-center bg-blue-500 caret-transparent gap-x-1 inline-flex shrink-0 h-10 justify-center tracking-[-0.2px] leading-[14px] gap-y-1 text-center text-nowrap border border-blue-500 px-4 rounded-bl rounded-br rounded-tl rounded-tr border-solid hover:bg-blue-400 hover:border-blue-400"
            >
              Send Suggestions
            </button>
          </div>
        </div>
      </div>
      </>
      )}

      {activeTab === 'export' && (
        <div className="flex-1 overflow-auto p-4">
          <ExportData />
        </div>
      )}

      {activeTab !== 'work-orders' && activeTab !== 'export' && (
        <div className="flex-1 flex items-center justify-center text-gray-400 italic">
          Coming Soon...
        </div>
      )}
    </div>
  );
};
