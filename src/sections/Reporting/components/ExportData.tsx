import React, { useState } from 'react';
import { useWorkOrderStore } from '@/store/useWorkOrderStore';
import { FileText, ChevronDown, ChevronRight, Check, Loader2, AlertCircle } from 'lucide-react';
import { generateWorkOrderPDF, downloadPDF, ExportOptions } from '@/services/export/pdfExport';
import { ExportPreviewModal } from '@/components/Export/ExportPreviewModal';

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

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {rowCount > 50 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="text-amber-600 shrink-0" size={20} />
          <div>
            <p className="text-sm font-medium text-amber-800">Large export: {rowCount} work orders selected</p>
            <p className="text-xs text-amber-700">Exporting many items may take a moment to generate.</p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="text-red-600 shrink-0" size={20} />
          <p className="text-sm font-medium text-red-800">{error}</p>
        </div>
      )}

      <div className="bg-white border border-[var(--border)] rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[var(--border)] bg-gray-50 flex items-center gap-3">
          <div className="bg-blue-100 p-2 rounded">
            <FileText className="text-blue-600" size={24} />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Export Work Order List</h3>
            <p className="text-sm text-gray-500">Generate a detailed report of your work orders.</p>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Date Range */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">From</label>
              <div className="relative">
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                  className="w-full border border-[var(--border)] rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">To</label>
              <div className="relative">
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                  className="w-full border border-[var(--border)] rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Format Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Export Format</label>
            <div className="flex gap-4">
              <button
                onClick={() => setFormat('CSV')}
                className={`flex-1 flex items-center justify-center gap-2 p-3 border rounded-lg transition-all ${format === 'CSV' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-[var(--border)] hover:bg-gray-50'}`}
              >
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${format === 'CSV' ? 'border-blue-500 bg-blue-500' : 'border-[var(--border)]'}`}>
                  {format === 'CSV' && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                </div>
                <span className="font-medium">CSV (Excel)</span>
              </button>
              <button
                onClick={() => setFormat('PDF')}
                className={`flex-1 flex items-center justify-center gap-2 p-3 border rounded-lg transition-all ${format === 'PDF' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-[var(--border)] hover:bg-gray-50'}`}
              >
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${format === 'PDF' ? 'border-blue-500 bg-blue-500' : 'border-[var(--border)]'}`}>
                  {format === 'PDF' && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                </div>
                <span className="font-medium">PDF Document</span>
              </button>
            </div>
          </div>

          {/* Include Options */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Work Orders to include in this date range</label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3 border border-[var(--border)] rounded hover:bg-gray-50 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={includeStatus.planned}
                  onChange={(e) => setIncludeStatus(prev => ({ ...prev, planned: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 rounded border-[var(--border)]"
                />
                <span className="text-sm text-gray-700">Planned / Created</span>
              </label>
              <label className="flex items-center gap-3 p-3 border border-[var(--border)] rounded hover:bg-gray-50 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={includeStatus.due}
                  onChange={(e) => setIncludeStatus(prev => ({ ...prev, due: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 rounded border-[var(--border)]"
                />
                <span className="text-sm text-gray-700">Due</span>
              </label>
              <label className="flex items-center gap-3 p-3 border border-[var(--border)] rounded hover:bg-gray-50 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={includeStatus.completed}
                  onChange={(e) => setIncludeStatus(prev => ({ ...prev, completed: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 rounded border-[var(--border)]"
                />
                <span className="text-sm text-gray-700">Completed</span>
              </label>
            </div>
          </div>

          {/* Procedure Format */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Procedure Format</label>
            <select
              value={procedureFormat}
              onChange={(e) => setProcedureFormat(e.target.value as any)}
              className="w-full border border-[var(--border)] rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              <option value="Summary">Summary</option>
              <option value="Full">Full</option>
            </select>
          </div>

          {/* Additional Options */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Additional Options</label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={additionalOptions.maintenancePlan}
                  onChange={(e) => setAdditionalOptions(prev => ({ ...prev, maintenancePlan: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 rounded border-[var(--border)]"
                />
                <span className="text-sm text-gray-700">Include Maintenance Plan</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={additionalOptions.onePerPage}
                  onChange={(e) => setAdditionalOptions(prev => ({ ...prev, onePerPage: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 rounded border-[var(--border)]"
                />
                <span className="text-sm text-gray-700">1 Work Order per page</span>
              </label>
            </div>
          </div>

          {/* Column Selector */}
          <div className="border border-[var(--border)] rounded-lg overflow-hidden">
            <button
              onClick={() => setShowColumns(!showColumns)}
              className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <span className="font-medium text-sm">Columns to Include</span>
              {showColumns ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
            </button>
            {showColumns && (
              <div className="p-4 grid grid-cols-2 md:grid-cols-3 gap-3 bg-white border-t border-[var(--border)]">
                {Object.entries(selectedColumns).map(([key, enabled]) => (
                  <label key={key} className="flex items-center gap-2 cursor-pointer group">
                    <div className={`w-4 h-4 border rounded flex items-center justify-center transition-colors ${enabled ? 'bg-blue-500 border-blue-500' : 'border-[var(--border)] group-hover:border-blue-400'}`}>
                      {enabled && <Check size={12} className="text-white" />}
                    </div>
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={enabled}
                      onChange={() => handleToggleColumn(key)}
                    />
                    <span className="text-sm text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-[var(--border)] bg-gray-50 flex justify-end gap-3">
          <button
            type="button"
            className="px-6 py-2 border border-[var(--border)] rounded-lg text-sm font-medium hover:bg-gray-100"
            onClick={() => alert('Scheduling exports coming soon!')}
          >
            Schedule
          </button>
          {isGenerating && progressText && (
            <div className="text-xs text-gray-500 mr-2 truncate max-w-[40%]" title={progressText}>
              {progressText}
            </div>
          )}
          <div className="flex-1" />
          <button
            onClick={handlePreview}
            disabled={isGenerating || format === 'CSV'}
            className="flex items-center gap-2 px-6 py-2 border border-[var(--border)] rounded-lg text-sm font-medium hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating && format === 'PDF' && <Loader2 size={16} className="animate-spin" />}
            Preview
          </button>
          <button
            onClick={handleExport}
            disabled={isGenerating || rowCount === 0}
            className="flex items-center gap-2 px-6 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent-hover shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isGenerating && <Loader2 size={16} className="animate-spin" />}
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
