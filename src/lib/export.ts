// src/lib/export.ts
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface Column {
  header: string;
  dataKey: string;
}

export function exportToExcel(
  data: any[],
  columns: Column[],
  filename: string,
  sheetName: string = "Sheet1"
) {
  // Map data to match columns
  const exportData = data.map((row) => {
    const newRow: any = {};
    columns.forEach((col) => {
      newRow[col.header] = row[col.dataKey];
    });
    return newRow;
  });

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  // Auto-size columns slightly
  const colWidths = columns.map((col) => ({ wch: Math.max(col.header.length + 5, 15) }));
  worksheet["!cols"] = colWidths;

  XLSX.writeFile(workbook, `${filename}.xlsx`);
}

export function exportToPDF(
  data: any[],
  columns: Column[],
  filename: string,
  title: string
) {
  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(16);
  doc.text(title, 14, 15);
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generated on: ${new Date().toLocaleDateString("id-ID", {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })}`, 14, 22);

  // Map data to array format for autotable
  const tableData = data.map((row) =>
    columns.map((col) => row[col.dataKey] ?? "")
  );

  autoTable(doc, {
    head: [columns.map((c) => c.header)],
    body: tableData,
    startY: 30,
    theme: "striped",
    headStyles: {
      fillColor: [16, 185, 129], // Emerald 500
      textColor: 255,
      fontStyle: "bold",
    },
    styles: {
      fontSize: 9,
      cellPadding: 4,
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252], // Slate 50
    },
  });

  doc.save(`${filename}.pdf`);
}
