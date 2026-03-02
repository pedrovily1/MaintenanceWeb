import React, { useState } from 'react';
import { useWorkOrderStore } from '@/store/useWorkOrderStore';
import { FileText, ChevronDown, ChevronRight, Check, Loader2, AlertCircle } from 'lucide-react';
import { generateWorkOrderPDF, downloadPDF, ExportOptions } from '@/services/export/pdfExport';
import { ExportPreviewModal } from '@/components/Export/ExportPreviewModal';
import { T, card } from '@/lib/tokens';

export const ExportData = () => {
  const { workOrders } = useWorkOrderStore();
  const [format, setFormat] = useState<'PDF' | 'CSV'>('PDF');
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [includeStatus, setIncludeStatus] = useState({
    planned: false,
    due: false,
    completed: true
  });
  const [procedureFormat, setProcedureFormat] = useState<'Summary' | 'Full'>('Full');
  const [additionalOptions, setAdditionalOptions] = useState({
    maintenancePlan: true,
    onePerPage: false
  });
  const [showColumns, setShowColumns] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState<Record<string, boolean>>({
    id: true,
    title: true,
    status: true,
    priority: true,
    dueDate: true,
    assignedTo: true,
    asset: true,
    location: true,
    categories: false,
    createdAt: true,
    completedAt: true
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [previewPdf, setPreviewPdf] = useState<{ url: string; doc: any } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progressText, setProgressText] = useState('');

  const getExportOptions = (): ExportOptions => ({
    dateRange,
    includeStatus,
    procedureFormat,
    additionalOptions,
    selectedColumns,
    onProgress: (msg: string) => setProgressText(msg)
  });

  const getFilename = () => {
    const type = includeStatus.completed ? 'completed' : 'work-orders';
    return `work-orders-${type}_${dateRange.start}_to_${dateRange.end}`;
  };

  const handlePreview = async () => {
    try {
      setIsGenerating(true);
      setError(null);
      setProgressText('');
      const options = getExportOptions();
      const doc = await generateWorkOrderPDF(workOrders, options);
      const blob = doc.output('bloburl');
      setPreviewPdf({ url: blob as string, doc });
    } catch (err) {
      console.error(err);
      setError('Failed to generate PDF preview.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExport = async () => {
    if (format === 'PDF') {
      try {
        setIsGenerating(true);
        setError(null);
        setProgressText('');
        const options = getExportOptions();
        const doc = await generateWorkOrderPDF(workOrders, options);
        downloadPDF(doc, `${getFilename()}.pdf`);
      } catch (err) {
        console.error(err);
        setError('Failed to export PDF.');
      } finally {
        setIsGenerating(false);
      }
    } else {
      handleExportCSV();
    }
  };

  const handleExportCSV = () => {
    const options = getExportOptions();
    const headers = Object.entries(selectedColumns)
      .filter(([_, enabled]) => enabled)
      .map(([key]) => key);

    const filteredWOs = workOrders.filter(wo => {
      const createdAt = (wo.createdAt || (wo as any).created_at || '').split('T')[0];
      const completedAt = ((wo.completedAt || (wo as any).completed_at) ?? '').split('T')[0] || null;
      const dueDate = (wo.dueDate || (wo as any).due_date || '').split('T')[0];
      if (options.includeStatus.planned && createdAt >= options.dateRange.start && createdAt <= options.dateRange.end) return true;
      if (options.includeStatus.due && dueDate >= options.dateRange.start && dueDate <= options.dateRange.end) return true;
      if (options.includeStatus.completed && wo.status === 'Done' && completedAt && completedAt >= options.dateRange.start && completedAt <= options.dateRange.end) return true;
      return false;
    });

    const csvContent = [
      headers.join(','),
      ...filteredWOs.map(wo => {
        return headers.map(h => {
          let val = (wo as any)[h];
          if (h === 'categories') val = (wo.categories || []).join('; ');
          if (h === 'dueDate' || h === 'createdAt' || h === 'completedAt') val = val ? new Date(val).toLocaleDateString() : '';
          const escaped = String(val || '').replace(/"/g, '""');
          return `"${escaped}"`;
        }).join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `${getFilename()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleToggleColumn = (col: string) => {
    setSelectedColumns(prev => ({ ...prev, [col]: !prev[col] }));
  };

  const rowCount = workOrders.filter(wo => {
    const createdAt = wo.createdAt.split('T')[0];
    const completedAt = wo.completedAt?.split('T')[0];
    const dueDate = wo.dueDate.split('T')[0];
    if (includeStatus.planned && createdAt >= dateRange.start && createdAt <= dateRange.end) return true;
    if (includeStatus.due && dueDate >= dateRange.start && dueDate <= dateRange.end) return true;
    if (includeStatus.completed && wo.status === 'Done' && completedAt && completedAt >= dateRange.start && completedAt <= dateRange.end) return true;
    return false;
  }).length;

  const labelStyle: React.CSSProperties = { fontSize: 13, fontWeight: 500, color: T.text };
  const checkRowStyle: React.CSSProperties = {
    display: "flex", alignItems: "center", gap: 12, padding: "10px 12px",
    border: `1px solid ${T.border}`, borderRadius: 6, cursor: "pointer",
  };

  return (
    <div style={{ maxWidth: 896, margin: "0 auto", display: "flex", flexDirection: "column", gap: 16, paddingBottom: 48 }}>

      {rowCount > 50 && (
        <div style={{ background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.3)", borderRadius: 8, padding: "12px 16px", display: "flex", alignItems: "flex-start", gap: 12 }}>
          <AlertCircle color={T.amber} size={20} style={{ flexShrink: 0, marginTop: 1 }} />
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: T.amber, margin: "0 0 2px" }}>Large export: {rowCount} work orders selected</p>
            <p style={{ fontSize: 12, color: T.muted, margin: 0 }}>Exporting many items may take a moment to generate.</p>
          </div>
        </div>
      )}

      {error && (
        <div style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)", borderRadius: 8, padding: "12px 16px", display: "flex", alignItems: "flex-start", gap: 12 }}>
          <AlertCircle color={T.red} size={20} style={{ flexShrink: 0, marginTop: 1 }} />
          <p style={{ fontSize: 13, fontWeight: 600, color: T.red, margin: 0 }}>{error}</p>
        </div>
      )}

      <div style={card({ borderRadius: 12, overflow: "hidden" })}>

        {/* Card header */}
        <div style={{ padding: "20px 24px", borderBottom: `1px solid ${T.border}`, background: T.raised, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ background: T.blueGlow, padding: 8, borderRadius: 6, display: "flex" }}>
            <FileText color={T.blue} size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: T.text, margin: "0 0 2px" }}>Export Work Order List</h3>
            <p style={{ fontSize: 13, color: T.muted, margin: 0 }}>Generate a detailed report of your work orders.</p>
          </div>
        </div>

        {/* Card body */}
        <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 28 }}>

          {/* Date Range */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            {[
              { label: "From", key: "start" as const },
              { label: "To", key: "end" as const },
            ].map(field => (
              <div key={field.key} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={labelStyle}>{field.label}</label>
                <input
                  type="date"
                  value={dateRange[field.key]}
                  onChange={(e) => setDateRange(prev => ({ ...prev, [field.key]: e.target.value }))}
                  style={{ width: "100%", padding: "8px 12px", fontSize: 13, borderRadius: 6 }}
                />
              </div>
            ))}
          </div>

          {/* Format Selection */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <label style={labelStyle}>Export Format</label>
            <div style={{ display: "flex", gap: 12 }}>
              {(['CSV', 'PDF'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFormat(f)}
                  style={{
                    flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    padding: 12, borderRadius: 8, cursor: "pointer", transition: "all 0.15s",
                    border: format === f ? `1px solid ${T.blue}` : `1px solid ${T.border}`,
                    background: format === f ? T.blueGlow : "transparent",
                    color: format === f ? T.blue : T.text,
                  }}
                >
                  <div style={{
                    width: 16, height: 16, borderRadius: "50%", border: `2px solid ${format === f ? T.blue : T.border}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: format === f ? T.blue : "transparent",
                  }}>
                    {format === f && <div style={{ width: 6, height: 6, background: "#fff", borderRadius: "50%" }} />}
                  </div>
                  <span style={{ fontWeight: 500, fontSize: 13 }}>{f === 'CSV' ? 'CSV (Excel)' : 'PDF Document'}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Include Options */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <label style={labelStyle}>Work Orders to include in this date range</label>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={checkRowStyle}>
                <input
                  type="checkbox"
                  checked={includeStatus.planned}
                  onChange={(e) => setIncludeStatus(prev => ({ ...prev, planned: e.target.checked }))}
                  style={{ width: 16, height: 16 }}
                />
                <span style={{ fontSize: 13, color: T.text }}>Planned / Created</span>
              </label>
              <label style={checkRowStyle}>
                <input
                  type="checkbox"
                  checked={includeStatus.due}
                  onChange={(e) => setIncludeStatus(prev => ({ ...prev, due: e.target.checked }))}
                  style={{ width: 16, height: 16 }}
                />
                <span style={{ fontSize: 13, color: T.text }}>Due</span>
              </label>
              <label style={checkRowStyle}>
                <input
                  type="checkbox"
                  checked={includeStatus.completed}
                  onChange={(e) => setIncludeStatus(prev => ({ ...prev, completed: e.target.checked }))}
                  style={{ width: 16, height: 16 }}
                />
                <span style={{ fontSize: 13, color: T.text }}>Completed</span>
              </label>
            </div>
          </div>

          {/* Procedure Format */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <label style={labelStyle}>Procedure Format</label>
            <select
              value={procedureFormat}
              onChange={(e) => setProcedureFormat(e.target.value as any)}
              style={{ padding: "8px 12px", fontSize: 13, borderRadius: 6 }}
            >
              <option value="Summary">Summary</option>
              <option value="Full">Full</option>
            </select>
          </div>

          {/* Additional Options */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <label style={labelStyle}>Additional Options</label>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={additionalOptions.maintenancePlan}
                  onChange={(e) => setAdditionalOptions(prev => ({ ...prev, maintenancePlan: e.target.checked }))}
                  style={{ width: 16, height: 16 }}
                />
                <span style={{ fontSize: 13, color: T.text }}>Include Maintenance Plan</span>
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={additionalOptions.onePerPage}
                  onChange={(e) => setAdditionalOptions(prev => ({ ...prev, onePerPage: e.target.checked }))}
                  style={{ width: 16, height: 16 }}
                />
                <span style={{ fontSize: 13, color: T.text }}>1 Work Order per page</span>
              </label>
            </div>
          </div>

          {/* Column Selector */}
          <div style={{ border: `1px solid ${T.border}`, borderRadius: 8, overflow: "hidden" }}>
            <button
              onClick={() => setShowColumns(!showColumns)}
              style={{
                width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "12px 16px", background: T.raised, border: "none", cursor: "pointer",
                color: T.text,
              }}
            >
              <span style={{ fontWeight: 500, fontSize: 13 }}>Columns to Include</span>
              {showColumns ? <ChevronDown size={18} color={T.muted} /> : <ChevronRight size={18} color={T.muted} />}
            </button>
            {showColumns && (
              <div style={{
                padding: 16, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12,
                background: T.surface, borderTop: `1px solid ${T.border}`,
              }}>
                {Object.entries(selectedColumns).map(([key, enabled]) => (
                  <label key={key} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                    <div
                      onClick={() => handleToggleColumn(key)}
                      style={{
                        width: 16, height: 16, border: `1px solid ${enabled ? T.blue : T.border}`,
                        borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center",
                        background: enabled ? T.blue : "transparent", flexShrink: 0, cursor: "pointer",
                      }}
                    >
                      {enabled && <Check size={10} color="#fff" />}
                    </div>
                    <input type="checkbox" className="hidden" checked={enabled} onChange={() => handleToggleColumn(key)} />
                    <span style={{ fontSize: 13, color: T.muted, textTransform: "capitalize" }}>{key.replace(/([A-Z])/g, ' $1')}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div style={{
          padding: "16px 24px", borderTop: `1px solid ${T.border}`, background: T.raised,
          display: "flex", alignItems: "center", gap: 12,
        }}>
          <button
            type="button"
            style={{ padding: "8px 20px", border: `1px solid ${T.border}`, borderRadius: 6, fontSize: 13, fontWeight: 500, color: T.text, background: "transparent", cursor: "pointer" }}
            onClick={() => alert('Scheduling exports coming soon!')}
          >
            Schedule
          </button>
          {isGenerating && progressText && (
            <span style={{ fontSize: 12, color: T.muted, overflow: "hidden", textOverflow: "ellipsis", maxWidth: "40%" }} title={progressText}>
              {progressText}
            </span>
          )}
          <div style={{ flex: 1 }} />
          <button
            onClick={handlePreview}
            disabled={isGenerating || format === 'CSV'}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "8px 20px", border: `1px solid ${T.border}`, borderRadius: 6,
              fontSize: 13, fontWeight: 500, color: T.text, background: "transparent", cursor: "pointer",
              opacity: isGenerating || format === 'CSV' ? 0.5 : 1,
            }}
          >
            {isGenerating && format === 'PDF' && <Loader2 size={15} className="animate-spin" />}
            Preview
          </button>
          <button
            onClick={handleExport}
            disabled={isGenerating || rowCount === 0}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "8px 20px", border: `1px solid ${T.blue}`, borderRadius: 6,
              fontSize: 13, fontWeight: 600, color: "#fff", background: T.blue, cursor: "pointer",
              opacity: isGenerating || rowCount === 0 ? 0.5 : 1,
            }}
          >
            {isGenerating && <Loader2 size={15} className="animate-spin" />}
            Export
          </button>
        </div>
      </div>

      {previewPdf && (
        <ExportPreviewModal
          pdfUrl={previewPdf.url}
          filename={`${getFilename()}.pdf`}
          onClose={() => {
            URL.revokeObjectURL(previewPdf.url);
            setPreviewPdf(null);
          }}
          onDownload={() => {
            downloadPDF(previewPdf.doc, `${getFilename()}.pdf`);
          }}
        />
      )}
    </div>
  );
};
