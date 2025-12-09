/**
 * Export utilities for CSV and Excel downloads
 */

export interface ExportColumn {
  key: string;
  label: string;
  format?: (value: any) => string;
}

/**
 * Convert array of objects to CSV string
 */
export function convertToCSV(data: any[], columns: ExportColumn[]): string {
  if (data.length === 0) return "";

  // Create header row
  const headers = columns.map(col => `"${col.label}"`).join(",");
  
  // Create data rows
  const rows = data.map(item => {
    return columns.map(col => {
      let value = item[col.key];
      
      // Apply custom formatter if provided
      if (col.format && value !== null && value !== undefined) {
        value = col.format(value);
      }
      
      // Handle null/undefined
      if (value === null || value === undefined) {
        return '""';
      }
      
      // Convert to string and escape quotes
      const stringValue = String(value).replace(/"/g, '""');
      return `"${stringValue}"`;
    }).join(",");
  });

  return [headers, ...rows].join("\n");
}

/**
 * Download CSV file
 */
export function downloadCSV(filename: string, csvContent: string): void {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

/**
 * Export data to CSV file
 */
export function exportToCSV(
  data: any[],
  columns: ExportColumn[],
  filename: string
): void {
  const csv = convertToCSV(data, columns);
  downloadCSV(filename, csv);
}

/**
 * Format date for export
 */
export function formatDateForExport(date: Date | string | null): string {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString();
}

/**
 * Format datetime for export
 */
export function formatDateTimeForExport(date: Date | string | null): string {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleString();
}

/**
 * Format boolean for export
 */
export function formatBooleanForExport(value: boolean | null): string {
  if (value === null || value === undefined) return "";
  return value ? "Yes" : "No";
}

/**
 * Sanitize filename
 */
export function sanitizeFilename(filename: string): string {
  return filename.replace(/[^a-z0-9_-]/gi, "_").toLowerCase();
}

/**
 * Generate filename with timestamp
 */
export function generateFilename(prefix: string, extension: string = "csv"): string {
  const timestamp = new Date().toISOString().split("T")[0];
  return `${sanitizeFilename(prefix)}_${timestamp}.${extension}`;
}




