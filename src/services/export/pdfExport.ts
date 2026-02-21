// export.ts
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { WorkOrder, ProcedureInstance } from '@/types/workOrder';

export interface ExportOptions {
  dateRange: { start: string; end: string };
  includeStatus: {
    planned: boolean;
    due: boolean;
    completed: boolean;
  };
  procedureFormat: 'Summary' | 'Full';
  additionalOptions: {
    maintenancePlan: boolean;
    onePerPage: boolean;
  };
  selectedColumns: Record<string, boolean>;
  // Optional progress callback used by UI to display long-running image embedding status
  onProgress?: (message: string) => void;
}

type AnyAttachment = {
  name?: string;
  type?: string; // mime
  url?: string; // data url or blob url
  dataUrl?: string;
};

const ORG_NAME = 'SSF - Slovakia';
const FOOTER_ORG = 'CWS - Slovakia';

const fmtDate = (iso?: string) => (iso ? new Date(iso).toLocaleDateString() : '-');

const fmtDuration = (hours?: number) => {
  if (!hours || Number.isNaN(hours)) return '0m 0s';
  const totalSeconds = Math.max(0, Math.round(hours * 3600));
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  if (h > 0) return `${h}h ${m}m ${s}s`;
  return `${m}m ${s}s`;
};

const toISODate = (isoLike?: string) => {
  if (!isoLike) return '';
  // already YYYY-MM-DD?
  if (/^\d{4}-\d{2}-\d{2}$/.test(isoLike)) return isoLike;
  // ISO string?
  const d = new Date(isoLike);
  if (Number.isNaN(d.getTime())) return '';
  return d.toISOString().slice(0, 10);
};

const safeText = (v: any) => (v === undefined || v === null ? '' : String(v));

const isImageAttachment = (att: AnyAttachment) => {
  const url = att?.url || att?.dataUrl || '';
  const t = att?.type || '';
  return (
    (typeof t === 'string' && t.startsWith('image/')) ||
    (typeof url === 'string' &&
      (url.startsWith('data:image') ||
        url.startsWith('blob:') ||
        /\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i.test(url)))
  );
};

const attachmentSrc = (att: AnyAttachment) => (att?.url || att?.dataUrl || '') as string;

const normalizeAttachmentsFromResponse = (resp: any, field?: any): AnyAttachment[] => {
  // Field may already carry attachments (legacy)
  const fieldAtt = Array.isArray(field?.attachments) ? field.attachments : [];

  // Response may be:
  // - array of attachments
  // - object containing attachments
  // - a single attachment-like object
  // - a simple string (URL)
  if (Array.isArray(resp)) return resp as AnyAttachment[];
  if (resp && typeof resp === 'object') {
    if (Array.isArray(resp.attachments)) return resp.attachments as AnyAttachment[];
    if (typeof resp.url === 'string' || typeof resp.dataUrl === 'string') return [resp as AnyAttachment];
  }

  if (typeof resp === 'string' && resp.length > 0) {
    // If it's a URL-like string
    if (resp.startsWith('data:image') || resp.startsWith('http') || resp.startsWith('blob:')) {
      return [{ url: resp } as AnyAttachment];
    }
  }

  return fieldAtt as AnyAttachment[];
};

const loadImageSize = (src: string): Promise<{ w: number; h: number } | null> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ w: img.naturalWidth || img.width, h: img.naturalHeight || img.height });
    img.onerror = () => resolve(null);
    img.src = src;
  });
};

export const generateWorkOrderPDF = async (workOrders: WorkOrder[], options: ExportOptions) => {
  const doc = new jsPDF({ unit: 'pt', format: 'letter' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  const margin = 36; // 0.5"
  const headerTopY = 24;
  const titleBlockH = 46;
  const columnHeaderH = 20;
  const bottomMargin = 36;

  // Column widths tuned for Letter portrait
  const colW = {
    info: 170,
    loc: 150,
    due: 120,
    time: 110,
    proc: pageWidth - margin * 2 - (170 + 150 + 120 + 110),
  };

  const reportTitle = `Work Orders List for ${options.dateRange.start} - ${options.dateRange.end}`;
  const generatedLine = `Generated: ${new Date().toLocaleString()}`;

  let yPos = 0;

  const drawPortalHeader = (withTitleBlock: boolean) => {
    // Letterhead: centered, bold teal title with hairline divider
    doc.setTextColor(20, 184, 166); // teal-500 (#14B8A6)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Online Maintenance Web Portal', pageWidth / 2, headerTopY, { align: 'center' });

    // Hairline divider
    doc.setDrawColor(200);
    doc.setLineWidth(0.6);
    doc.line(margin, headerTopY + 10, pageWidth - margin, headerTopY + 10);

    // Optional title block on the first page only
    if (withTitleBlock) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(0);
      doc.text(reportTitle, margin, headerTopY + 28);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(90);
      doc.text(generatedLine, margin, headerTopY + 42);
      doc.setTextColor(0);
    }
  };

  const drawColumnHeaderRow = (startY: number) => {
    autoTable(doc, {
      startY,
      margin: { left: margin, right: margin },
      head: [[
        'WORK ORDER INFO',
        'LOCATION & ASSET',
        'DUE & STATUS',
        'TIME & COST',
        'PROCEDURE ANSWERS',
      ]],
      body: [],
      theme: 'plain',
      styles: {
        font: 'helvetica',
        fontSize: 8.5,
        cellPadding: 4,
        textColor: 0,
        lineWidth: 0.6,
        lineColor: 220,
        valign: 'middle',
      },
      headStyles: {
        fontStyle: 'bold',
        fillColor: false as any,
      },
      tableLineWidth: 0.6,
      tableLineColor: 220,
      columnStyles: {
        0: { cellWidth: colW.info },
        1: { cellWidth: colW.loc },
        2: { cellWidth: colW.due },
        3: { cellWidth: colW.time },
        4: { cellWidth: colW.proc },
      },
    });

    return (doc as any).lastAutoTable.finalY as number;
  };

  const drawFooter = (pageNum: number, totalPages: number) => {
    const y = pageHeight - 18;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text(`Generated for ${FOOTER_ORG}`, margin, y);
    doc.text(`Page ${pageNum} of ${totalPages}`, pageWidth - margin, y, { align: 'right' });
    doc.setTextColor(0);
  };

  const startFirstPage = () => {
    drawPortalHeader(true);
    const headerBottom = headerTopY + titleBlockH;
    // Start content just below the title block (no 5-column header row)
    yPos = headerBottom + 8;
  };

  const startContinuationPage = () => {
    doc.addPage();
    drawPortalHeader(false);
    const headerBottom = headerTopY + 18; // smaller header on continuation pages
    // Continue without the removed 5-column header row
    yPos = headerBottom + 8;
  };

  const ensureSpace = (neededHeight: number) => {
    if (yPos + neededHeight > pageHeight - bottomMargin) startContinuationPage();
  };

  const buildWorkOrderInfoCol = (wo: WorkOrder) => {
    const lines: string[] = [];
    lines.push(`ID: #${safeText((wo as any).workOrderNumber ?? (wo as any).id ?? '-')}`);
    lines.push(safeText(wo.title || '-'));

    const workType = safeText((wo as any).workType || (wo as any).type);
    if (workType) lines.push(`Type: ${workType}`);

    if (wo.priority) lines.push(safeText(wo.priority));
    const cats = Array.isArray((wo as any).categories) ? (wo as any).categories.join(', ') : safeText((wo as any).category);
    if (cats) lines.push(cats);

    if ((wo as any).assignedTo) lines.push(safeText((wo as any).assignedTo));
    if ((wo as any).requestedBy) lines.push(`Requested: ${safeText((wo as any).requestedBy)}`);

    return lines.join('\n');
  };

  const buildLocationAssetCol = (wo: WorkOrder) => {
    const lines: string[] = [];
    lines.push(safeText((wo as any).site || (wo as any).organization || ORG_NAME));
    const parent = safeText((wo as any).parent || (wo as any).parentName || 'Slovakia');
    lines.push(`Parent:\n${parent}`);
    if (wo.asset) lines.push(`Asset:\n${safeText(wo.asset)}`);
    if (wo.location) lines.push(`Location:\n${safeText(wo.location)}`);
    return lines.join('\n');
  };

  const buildDueStatusCol = (wo: WorkOrder) => {
    const lines: string[] = [];
    if ((wo as any).dueDate) lines.push(fmtDate((wo as any).dueDate));
    if (wo.status) lines.push(safeText(wo.status));

    const completedBy = safeText((wo as any).completedBy || (wo as any).assignedTo);
    const completedAt = (wo as any).completedAt ? fmtDate((wo as any).completedAt) : '';
    if (wo.status === 'Done' && completedBy && completedAt) {
      lines.push(`Completed by ${completedBy} on ${completedAt}`);
    }
    return lines.join('\n');
  };

  const buildTimeCostCol = (wo: WorkOrder) => {
    const lines: string[] = [];
    lines.push(`Total Time\n${fmtDuration((wo as any).totalTimeHours)}`);
    lines.push(`Cost\n${(wo as any).totalCost != null ? `$${Number((wo as any).totalCost).toFixed(2)}` : '-'}`);
    return lines.join('\n');
  };

  const buildProcedureAnswersCol = (wo: WorkOrder) => {
    const instances: ProcedureInstance[] = (wo as any).procedureInstances || [];
    const lines: string[] = [];

    if (options.procedureFormat === 'Summary') {
      if (!instances.length) return '';
      for (const pi of instances) {
        const name = safeText((pi as any).procedureNameSnapshot || 'Procedure');
        // light completion signal
        const totalFields =
            ((pi as any).procedureSchemaSnapshot || []).reduce((acc: number, s: any) => acc + (s.fields?.length || 0), 0);
        const filledFields = Object.keys((pi as any).responses || {}).length;
        const pct = totalFields > 0 ? Math.round((filledFields / totalFields) * 100) : 100;
        lines.push(`- ${name}: ${pct}%`);
      }
      return lines.join('\n');
    }

    // Full mode
    for (const pi of instances) {
      const procName = safeText((pi as any).procedureNameSnapshot || 'Procedure');
      lines.push(procName);

      const schema = (pi as any).procedureSchemaSnapshot || [];
      const responses = (pi as any).responses || {};
      const filledBy = safeText((wo as any).assignedTo);
      const filledOn = (pi as any).updatedAt ? fmtDate((pi as any).updatedAt) : '';

      for (const section of schema) {
        if (section?.title) lines.push(safeText(section.title));

        for (const f of section?.fields || []) {
          const resp = responses[f.id];
          let valueStr = '-';

          if (resp !== undefined && resp !== null && resp !== '') {
            if (f.type === 'yesno_na' || f.type === 'inspection') valueStr = String(resp);
            else if (f.type === 'meter') valueStr = `${resp}${f.unit ? ` ${f.unit}` : ''}`;
            else if (f.type === 'date') valueStr = fmtDate(String(resp));
            else if (f.type === 'signature') {
              // could be string name or object
              const signer = typeof resp === 'string' ? resp : safeText(resp?.name || resp?.signedBy);
              valueStr = signer ? `Signed by ${signer}${filledOn ? ` on ${filledOn}` : ''}` : 'Signed';
            } else if (f.type === 'photo' || f.type === 'file') {
              const atts = normalizeAttachmentsFromResponse(resp, f);
              valueStr = `${atts.length} attachment(s)`;
            } else valueStr = String(resp);
          }

          lines.push(`${safeText(f.label || 'Field')}: ${valueStr}`);

          if (filledBy && filledOn && resp !== undefined && resp !== null && resp !== '') {
            lines.push(`Filled by ${filledBy} on ${filledOn}`);
          }
        }
      }

      lines.push(''); // spacing between procedures
    }

    // Legacy sections fallback (if present)
    const legacySections = (wo as any).sections;
    if (Array.isArray(legacySections) && legacySections.length) {
      lines.push('Legacy Form Data');
      for (const s of legacySections) {
        if (s?.title) lines.push(safeText(s.title));
        for (const f of s?.fields || []) {
          const v = f?.value;
          lines.push(`${safeText(f.label || 'Field')}: ${v == null || v === '' ? '-' : String(v)}`);
        }
      }
    }

    return lines.join('\n').trim();
  };

  const renderImagesBlock = async (label: string, attachments: AnyAttachment[] = [], maxPerField = 3) => {
    const images = attachments.filter(isImageAttachment);
    const others = attachments.filter((a) => !isImageAttachment(a));

    if (images.length === 0 && others.length === 0) return;

    // Label
    ensureSpace(18);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(0);
    doc.text(label, margin, yPos);
    yPos += 10;

    // Thumbnails grid
    const cols = 3;
    const gap = 6;
    const usable = pageWidth - margin * 2 - (cols - 1) * gap;
    const thumbW = usable / cols;

    let col = 0;
    let rowH = 0;

    const limit = Math.min(images.length, maxPerField);
    for (let i = 0; i < limit; i++) {
      const src = attachmentSrc(images[i]);
      if (!src) continue;

      const size = await loadImageSize(src);
      const aspect = size && size.w ? size.h / size.w : 0.75;

      const w = thumbW;
      const h = Math.max(thumbW * aspect, 72);

      if (col === 0) ensureSpace(h + 18);

      const x = margin + col * (thumbW + gap);
      const type = images[i].type || '';
      let fmt = 'JPEG';
      if (type.includes('png') || src.startsWith('data:image/png')) fmt = 'PNG';
      else if (type.includes('webp') || src.startsWith('data:image/webp')) fmt = 'WEBP';

      try {
        doc.addImage(src, fmt as any, x, yPos, w, h);
      } catch {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(80);
        doc.text(`${images[i].name || 'image'} (not embedded)`, x, yPos + 10);
        doc.setTextColor(0);
      }

      rowH = Math.max(rowH, h);
      col++;

      if (options.onProgress) options.onProgress(`Embedding photos (${i + 1}/${limit})…`);
      // yield to UI
      await new Promise(requestAnimationFrame);

      if (col >= cols) {
        col = 0;
        yPos += rowH + 10;
        rowH = 0;
      }
    }

    if (col > 0) yPos += rowH + 10;

    if (images.length > limit) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(80);
      doc.text(`+${images.length - limit} more images not embedded`, margin, yPos);
      doc.setTextColor(0);
      yPos += 12;
    }

    if (others.length > 0) {
      const names = others.slice(0, 3).map((o) => o.name || 'file').join(', ');
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(80);
      doc.text(`${others.length} non-image file(s): ${names}${others.length > 3 ? '…' : ''}`, margin, yPos);
      doc.setTextColor(0);
      yPos += 12;
    }
  };

  // Filter/sort
  const filteredWOs = workOrders
      .filter((wo) => {
        const createdAt = toISODate((wo as any).createdAt);
        const completedAt = toISODate((wo as any).completedAt);
        const dueDate = toISODate((wo as any).dueDate);

        let matchStatus = false;

        if (options.includeStatus.planned && createdAt && createdAt >= options.dateRange.start && createdAt <= options.dateRange.end) {
          matchStatus = true;
        }
        if (options.includeStatus.due && dueDate && dueDate >= options.dateRange.start && dueDate <= options.dateRange.end) {
          matchStatus = true;
        }
        if (
            options.includeStatus.completed &&
            (wo as any).status === 'Done' &&
            completedAt &&
            completedAt >= options.dateRange.start &&
            completedAt <= options.dateRange.end
        ) {
          matchStatus = true;
        }

        return matchStatus;
      })
      .sort((a, b) => new Date((b as any).createdAt).getTime() - new Date((a as any).createdAt).getTime());

  // Empty state
  startFirstPage();
  if (filteredWOs.length === 0) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(0);
    doc.text('No work orders found for the selected criteria.', margin, yPos);

    const total = doc.getNumberOfPages();
    for (let i = 1; i <= total; i++) {
      doc.setPage(i);
      drawFooter(i, total);
    }
    return doc;
  }

  // Render each WO as a simplified vertical block, then embed photos directly beneath (when present)
  const writeLines = (text: string, options?: { bold?: boolean; size?: number }) => {
    const size = options?.size ?? 9;
    const bold = options?.bold ?? false;
    doc.setFont('helvetica', bold ? 'bold' : 'normal');
    doc.setFontSize(size);
    const lines = doc.splitTextToSize(text, pageWidth - margin * 2);
    for (const line of lines) {
      ensureSpace(12);
      doc.text(line, margin, yPos);
      yPos += 12;
    }
  };

  const renderWorkOrderBlock = (wo: WorkOrder) => {
    // Heading line
    const idPart = safeText((wo as any).workOrderNumber ?? (wo as any).id ?? '-');
    const heading = `#${idPart} — ${safeText(wo.title || '-')}`;
    ensureSpace(18);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(0);
    doc.text(heading, margin, yPos);
    yPos += 14;

    // Metadata lines (vertical list)
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    const meta: string[] = [];
    if ((wo as any).asset) meta.push(`Asset: ${safeText((wo as any).asset)}`);
    if ((wo as any).location) meta.push(`Location: ${safeText((wo as any).location)}`);
    if ((wo as any).assignedTo) meta.push(`Assigned To: ${safeText((wo as any).assignedTo)}`);
    if ((wo as any).dueDate) meta.push(`Due: ${fmtDate((wo as any).dueDate)}`);
    if ((wo as any).status) meta.push(`Status: ${safeText((wo as any).status)}`);
    if ((wo as any).priority) meta.push(`Priority: ${safeText((wo as any).priority)}`);
    meta.push(`Total Time: ${fmtDuration((wo as any).totalTimeHours)}`);
    meta.push(`Cost: ${(wo as any).totalCost != null ? `$${Number((wo as any).totalCost).toFixed(2)}` : '-'}`);
    writeLines(meta.join('  •  '));

    // Procedure answers
    const procText = buildProcedureAnswersCol(wo);
    if (procText) {
      ensureSpace(12);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text('Procedure Answers', margin, yPos);
      yPos += 12;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      writeLines(procText);
      yPos += 12;
    }

    // Optional maintenance plan
    if (options.additionalOptions.maintenancePlan && (wo as any).isRepeating && (wo as any).schedule) {
      ensureSpace(12);
      const sch = (wo as any).schedule;
      const mp = `Maintenance Plan\nFrequency: ${safeText(sch.frequency || sch.rrule || '-')}\nStart: ${fmtDate(sch.startDate)}${sch.endDate ? `\nEnd: ${fmtDate(sch.endDate)}` : ''}`;
      writeLines(mp);
      yPos += 12;
    }
  };

  for (const [idx, wo] of filteredWOs.entries()) {
    if (options.additionalOptions.onePerPage && idx > 0) {
      startContinuationPage();
    }

    renderWorkOrderBlock(wo);

    // Embed images referenced by procedure fields (photos/files/signatures), then WO-level attachments
    const pis: ProcedureInstance[] = (wo as any).procedureInstances || [];
    for (const pi of pis) {
      const schema = (pi as any).procedureSchemaSnapshot || [];
      const responses = (pi as any).responses || {};
      for (const section of schema) {
        for (const f of section?.fields || []) {
          const resp = responses[f.id];
          const atts = normalizeAttachmentsFromResponse(resp, f);

          // Signature objects may store image in dataUrl/url
          if (f.type === 'signature') {
            const sigObj = resp && typeof resp === 'object' ? resp : null;
            const sigAtts = sigObj ? normalizeAttachmentsFromResponse(sigObj, f) : atts;
            const imgAtts = sigAtts.filter(isImageAttachment);
            if (imgAtts.length) {
              await renderImagesBlock(`${safeText(f.label || 'Signature')}`, imgAtts, 1);
            }
            continue;
          }

          if ((f.type === 'photo' || f.type === 'file') && atts.some(isImageAttachment)) {
            await renderImagesBlock(`${safeText(f.label || 'Photos')}`, atts, 3);
          }
        }
      }
    }

    // Legacy sections (if any)
    const legacySections = (wo as any).sections || [];
    for (const section of legacySections) {
      for (const f of section?.fields || []) {
        const atts = normalizeAttachmentsFromResponse(f.value, f);
        if ((f.type === 'photo' || f.type === 'file') && atts.some(isImageAttachment)) {
          await renderImagesBlock(`${safeText(f.label || 'Photos')}`, atts, 3);
        }
      }
    }

    // Work-order level attachments (if present)
    const woAtts: AnyAttachment[] = Array.isArray((wo as any).attachments) ? (wo as any).attachments : [];
    if (woAtts.length && woAtts.some(isImageAttachment)) {
      await renderImagesBlock('Work Order Photos', woAtts, 6);
    }

    // Divider line between work orders
    ensureSpace(36);
    doc.setDrawColor(220);
    doc.setLineWidth(1.2);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 24;
  }

  // Footer with accurate total pages
  const total = doc.getNumberOfPages();
  for (let i = 1; i <= total; i++) {
    doc.setPage(i);
    drawFooter(i, total);
  }

  return doc;
};

export const downloadPDF = (doc: jsPDF, filename: string) => {
  doc.save(filename);
};
