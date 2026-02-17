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
}

export const generateWorkOrderPDF = async (workOrders: WorkOrder[], options: ExportOptions) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  let yPos = 20;

  // Header
  doc.setFontSize(18);
  doc.setTextColor(0, 0, 0);
  doc.text('CWS - Slovakia', margin, yPos);
  
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  yPos += 10;
  doc.text('Export Work Order List', margin, yPos);
  
  doc.setFontSize(10);
  yPos += 7;
  doc.text(`Date Range: ${options.dateRange.start} to ${options.dateRange.end}`, margin, yPos);
  doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth - margin - 50, yPos, { align: 'right' });

  yPos += 10;
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 10;

  // Filter and sort work orders
  const filteredWOs = workOrders.filter(wo => {
    const createdAt = wo.createdAt.split('T')[0];
    const completedAt = wo.completedAt?.split('T')[0];
    const dueDate = wo.dueDate.split('T')[0];

    let matchStatus = false;
    if (options.includeStatus.planned && createdAt >= options.dateRange.start && createdAt <= options.dateRange.end) matchStatus = true;
    if (options.includeStatus.due && dueDate >= options.dateRange.start && dueDate <= options.dateRange.end) matchStatus = true;
    if (options.includeStatus.completed && wo.status === 'Done' && completedAt && completedAt >= options.dateRange.start && completedAt <= options.dateRange.end) matchStatus = true;

    return matchStatus;
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  if (filteredWOs.length === 0) {
    doc.text('No work orders found for the selected criteria.', margin, yPos);
    return doc;
  }

  for (const wo of filteredWOs) {
    // Check for page break if not onePerPage
    if (!options.additionalOptions.onePerPage && yPos > 250) {
      doc.addPage();
      yPos = 20;
    } else if (options.additionalOptions.onePerPage && wo !== filteredWOs[0]) {
      doc.addPage();
      yPos = 20;
    }

    // Work Order Title
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.text(`${wo.workOrderNumber}: ${wo.title}`, margin, yPos);
    yPos += 8;

    // Metadata Table
    const tableData = [];
    if (options.selectedColumns.id) tableData.push(['ID', wo.workOrderNumber]);
    if (options.selectedColumns.status) tableData.push(['Status', wo.status]);
    if (options.selectedColumns.priority) tableData.push(['Priority', wo.priority]);
    if (options.selectedColumns.dueDate) tableData.push(['Due Date', new Date(wo.dueDate).toLocaleDateString()]);
    if (options.selectedColumns.assignedTo) tableData.push(['Assigned To', wo.assignedTo]);
    if (options.selectedColumns.asset) tableData.push(['Asset', wo.asset]);
    if (options.selectedColumns.location) tableData.push(['Location', wo.location]);
    if (options.selectedColumns.createdAt) tableData.push(['Created At', new Date(wo.createdAt).toLocaleDateString()]);
    if (options.selectedColumns.completedAt && wo.completedAt) tableData.push(['Completed At', new Date(wo.completedAt).toLocaleDateString()]);

    autoTable(doc, {
      startY: yPos,
      margin: { left: margin },
      tableWidth: (pageWidth - margin * 2) / 2,
      body: tableData,
      theme: 'grid',
      styles: { fontSize: 8, cellPadding: 1 },
      columnStyles: { 0: { fontStyle: 'bold', width: 30 } }
    });

    yPos = (doc as any).lastAutoTable.finalY + 10;

    // Maintenance Plan (if requested and exists)
    if (options.additionalOptions.maintenancePlan && wo.isRepeating && wo.schedule) {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('Maintenance Plan', margin, yPos);
      yPos += 5;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text(`Frequency: ${wo.schedule.frequency}`, margin, yPos);
      yPos += 5;
      doc.text(`Start Date: ${new Date(wo.schedule.startDate).toLocaleDateString()}`, margin, yPos);
      yPos += 10;
    }

    // Procedures & Legacy Sections
    const allSections = [
      ...(wo.procedureInstances || []).flatMap(pi => 
        pi.procedureSchemaSnapshot.map(s => ({
          ...s,
          procedureName: pi.procedureNameSnapshot,
          responses: pi.responses
        }))
      ),
      ...(wo.sections || []).map(s => ({
        ...s,
        procedureName: 'Legacy Form Data',
        responses: s.fields.reduce((acc, f) => ({ ...acc, [f.id]: f.value }), {})
      }))
    ];

    if (allSections.length > 0) {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Procedures & Sections', margin, yPos);
      yPos += 7;

      let lastProcName = '';

      for (const section of allSections) {
        if (options.procedureFormat === 'Summary') {
          if (section.procedureName !== lastProcName) {
            const totalFields = allSections.filter(s => s.procedureName === section.procedureName)
              .reduce((acc, s) => acc + s.fields.length, 0);
            const filledFields = allSections.filter(s => s.procedureName === section.procedureName)
              .reduce((acc, s) => acc + Object.keys(s.responses).length, 0);
            const completion = totalFields > 0 ? Math.round((filledFields / totalFields) * 100) : 100;

            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.text(`- ${section.procedureName}: ${completion}% Complete`, margin + 5, yPos);
            yPos += 6;
            lastProcName = (section as any).procedureName;
          }
        } else {
          // Full format
          if (section.procedureName !== lastProcName) {
            doc.setFontSize(11);
            doc.setFont('helvetica', 'bold');
            doc.text((section as any).procedureName, margin + 2, yPos);
            yPos += 6;
            lastProcName = (section as any).procedureName;
          }

          doc.setFontSize(10);
          doc.setFont('helvetica', 'italic');
          doc.text(section.title, margin + 5, yPos);
          yPos += 5;

          const sectionFields = section.fields.map(f => {
            const response = (section as any).responses[f.id];
            let valueStr = '-';
            
            if (response !== undefined && response !== null && response !== '') {
              if (f.type === 'yesno_na' || f.type === 'inspection') {
                valueStr = String(response).toUpperCase();
              } else if (f.type === 'meter') {
                valueStr = `${response} ${f.unit || ''}`;
              } else if (f.type === 'date') {
                valueStr = new Date(response).toLocaleDateString();
              } else if (f.type === 'photo' || f.type === 'file') {
                const count = Array.isArray(response) ? response.length : (f.attachments?.length || 0);
                valueStr = `${count} attachment(s)`;
              } else if (f.type === 'signature') {
                valueStr = `Signed by ${response}`;
              } else {
                valueStr = String(response);
              }
            } else if (f.attachments && f.attachments.length > 0) {
              valueStr = `${f.attachments.length} attachment(s)`;
            }
            
            return [f.label, valueStr];
          });

          autoTable(doc, {
            startY: yPos,
            margin: { left: margin + 8 },
            tableWidth: pageWidth - margin * 2 - 8,
            body: sectionFields,
            theme: 'plain',
            styles: { fontSize: 9, cellPadding: 1 },
            columnStyles: { 0: { width: 100 }, 1: { fontStyle: 'bold' } }
          });

          yPos = (doc as any).lastAutoTable.finalY + 5;
          
          if (yPos > 270) {
            doc.addPage();
            yPos = 20;
          }
        }
      }
    }
    
    yPos += 10;
    doc.setDrawColor(240, 240, 240);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 10;
  }

  return doc;
};

export const downloadPDF = (doc: jsPDF, filename: string) => {
  doc.save(filename);
};
