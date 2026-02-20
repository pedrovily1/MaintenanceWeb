import React from 'react';
import { X, Download, Printer } from 'lucide-react';

interface ExportPreviewModalProps {
  pdfUrl: string;
  onClose: () => void;
  onDownload: () => void;
  filename: string;
}

export const ExportPreviewModal: React.FC<ExportPreviewModalProps> = ({ pdfUrl, onClose, onDownload, filename }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 lg:p-8">
      <div className="bg-white w-full max-w-5xl h-full flex flex-col rounded-xl shadow-2xl overflow-hidden border border-[var(--border)]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[var(--border)] flex items-center justify-between bg-white shrink-0">
          <div>
            <h3 className="text-lg font-bold text-gray-900">PDF Report Preview</h3>
            <p className="text-sm text-gray-500 truncate max-w-[300px] lg:max-w-md">{filename}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onDownload}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-bold hover:bg-blue-600 transition-colors shadow-sm"
            >
              <Download size={18} />
              Download PDF
            </button>
            <button
              onClick={() => {
                const iframe = document.getElementById('pdf-preview-iframe') as HTMLIFrameElement;
                iframe?.contentWindow?.print();
              }}
              className="flex items-center gap-2 px-4 py-2 border border-[var(--border)] text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors"
            >
              <Printer size={18} />
              Print
            </button>
            <div className="w-px h-8 bg-zinc-200 mx-2" />
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 bg-zinc-100 relative overflow-hidden">
          <iframe
            id="pdf-preview-iframe"
            src={`${pdfUrl}#toolbar=0`}
            className="w-full h-full border-none"
            title="PDF Preview"
          />
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[var(--border)] bg-gray-50 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-[var(--border)] text-gray-700 rounded-lg text-sm font-bold hover:bg-white transition-colors"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};