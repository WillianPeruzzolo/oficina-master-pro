import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export interface ExportData {
  title: string;
  headers: string[];
  data: any[][];
  filename: string;
  logoUrl?: string;
  workshopName?: string;
}

export function exportToExcel(exportData: ExportData) {
  try {
    console.log('[ExportUtils] Iniciando exportação Excel:', exportData.filename);
    const { title, headers, data, filename } = exportData;
    
    // Create a new workbook
    const workbook = XLSX.utils.book_new();
    
    // Combine headers and data
    const worksheetData = [headers, ...data];
    
    // Create worksheet
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, title);
    
    // Generate file and download
    XLSX.writeFile(workbook, `${filename}.xlsx`);
    
    console.log(`[ExportUtils] Excel exportado com sucesso: ${filename}.xlsx`);
    return true;
  } catch (error) {
    console.error("[ExportUtils] Erro na exportação Excel:", error);
    throw new Error("Falha ao exportar para Excel");
  }
}

export function exportToPDF(exportData: ExportData) {
  try {
    console.log('[ExportUtils] Iniciando exportação PDF:', exportData.filename);
    const { title, headers, data, filename, logoUrl, workshopName } = exportData;
    
    // Create new PDF document
    const doc = new jsPDF();
    let currentY = 20;
    
    // Add logo if available
    if (logoUrl) {
      try {
        // For now, just add workshop name in header
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(workshopName || 'Workshop', 20, currentY);
        currentY += 10;
      } catch (error) {
        console.warn('[ExportUtils] Erro ao processar logo:', error);
      }
    }
    
    // Add title with modern styling
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(44, 62, 80); // Dark blue-gray
    doc.text(title, 20, currentY);
    currentY += 15;
    
    // Add horizontal line
    doc.setDrawColor(189, 195, 199);
    doc.setLineWidth(0.5);
    doc.line(20, currentY, 190, currentY);
    currentY += 10;
    
    // Add current date with modern styling
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(127, 140, 141);
    doc.text(`Relatório gerado em: ${new Date().toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })}`, 20, currentY);
    currentY += 15;
    
    // Modern table styling
    autoTable(doc, {
      head: [headers],
      body: data,
      startY: currentY,
      theme: 'striped',
      styles: {
        fontSize: 9,
        cellPadding: 4,
        font: 'helvetica',
      },
      headStyles: {
        fillColor: [52, 73, 94],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 10,
      },
      alternateRowStyles: {
        fillColor: [248, 249, 250],
      },
      columnStyles: {
        0: { cellWidth: 'auto' },
      },
      margin: { top: 20, left: 20, right: 20 },
    });
    
    // Add footer
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(127, 140, 141);
      doc.text(
        `Página ${i} de ${pageCount} - ${workshopName || 'Workshop Pro'}`,
        20,
        doc.internal.pageSize.height - 10
      );
    }
    
    // Save the PDF
    doc.save(`${filename}.pdf`);
    
    console.log(`[ExportUtils] PDF exportado com sucesso: ${filename}.pdf`);
    return true;
  } catch (error) {
    console.error("[ExportUtils] Erro na exportação PDF:", error);
    throw new Error("Falha ao exportar para PDF");
  }
}

export function exportToCSV(exportData: ExportData) {
  try {
    console.log('[ExportUtils] Iniciando exportação CSV:', exportData.filename);
    const { headers, data, filename } = exportData;
    
    // Combine headers and data
    const csvData = [headers, ...data];
    
    // Convert to CSV format
    const csvContent = csvData
      .map(row => 
        row.map(cell => 
          typeof cell === 'string' && cell.includes(',') 
            ? `"${cell}"` 
            : cell
        ).join(',')
      )
      .join('\n');
    
    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log(`[ExportUtils] CSV exportado com sucesso: ${filename}.csv`);
    return true;
  } catch (error) {
    console.error("[ExportUtils] Erro na exportação CSV:", error);
    throw new Error("Falha ao exportar para CSV");
  }
}

// Helper functions for specific data formatting
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('pt-BR');
}

export function formatDateTime(date: string): string {
  return new Date(date).toLocaleString('pt-BR');
}