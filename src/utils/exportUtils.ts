import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

// Extend jsPDF type to include autoTable
declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export interface ExportData {
  title: string;
  headers: string[];
  data: any[][];
  filename: string;
}

export function exportToExcel(exportData: ExportData) {
  try {
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
    
    console.log(`Excel file exported: ${filename}.xlsx`);
    return true;
  } catch (error) {
    console.error("Error exporting to Excel:", error);
    throw new Error("Falha ao exportar para Excel");
  }
}

export function exportToPDF(exportData: ExportData) {
  try {
    const { title, headers, data, filename } = exportData;
    
    // Create new PDF document
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(16);
    doc.text(title, 20, 20);
    
    // Add current date
    doc.setFontSize(10);
    doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 20, 30);
    
    // Add table
    doc.autoTable({
      head: [headers],
      body: data,
      startY: 40,
      theme: 'grid',
      styles: {
        fontSize: 8,
        cellPadding: 2,
      },
      headStyles: {
        fillColor: [33, 150, 243], // Blue color
        textColor: [255, 255, 255],
        fontStyle: 'bold',
      },
      columnStyles: {
        0: { cellWidth: 'auto' },
      },
    });
    
    // Save the PDF
    doc.save(`${filename}.pdf`);
    
    console.log(`PDF file exported: ${filename}.pdf`);
    return true;
  } catch (error) {
    console.error("Error exporting to PDF:", error);
    throw new Error("Falha ao exportar para PDF");
  }
}

export function exportToCSV(exportData: ExportData) {
  try {
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
    
    console.log(`CSV file exported: ${filename}.csv`);
    return true;
  } catch (error) {
    console.error("Error exporting to CSV:", error);
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