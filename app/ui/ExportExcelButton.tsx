"use client";

import React, { useState } from "react";
import { Sheet, Loader2 } from "lucide-react";
import * as XLSX from "xlsx";

interface ExportExcelButtonProps {
    tableId?: string;
    data?: any[];
    columns?: { header: string; key: string }[];
    fileName: string;
}

export default function ExportExcelButton({ tableId, data, columns, fileName }: ExportExcelButtonProps) {
    const [isExporting, setIsExporting] = useState(false);

    const handleExport = () => {
        setIsExporting(true);
        try {
            let worksheet: XLSX.WorkSheet;

            if (data && data.length > 0) {
                // If columns are provided, map the data to the columns
                const exportData = data.map(item => {
                    if (columns) {
                        const row: any = {};
                        columns.forEach(col => {
                            // Support nested keys like 'meetingtype.MeetingTypeName'
                            const keys = col.key.split('.');
                            let val = item;
                            for (const k of keys) {
                                val = val?.[k];
                            }
                            row[col.header] = val;
                        });
                        return row;
                    }
                    return item;
                });
                worksheet = XLSX.utils.json_to_sheet(exportData);
            } else if (tableId) {
                const table = document.getElementById(tableId);
                if (!table) {
                    alert("Table not found for export.");
                    setIsExporting(false);
                    return;
                }

                // Create a clone of the table for cleaning
                const tableClone = table.cloneNode(true) as HTMLTableElement;
                const headers = tableClone.querySelectorAll("th");
                if (headers.length > 0) {
                    headers[0].remove();
                    headers[headers.length - 1].remove();
                }
                const rows = tableClone.querySelectorAll("tbody tr");
                rows.forEach(row => {
                    const cells = row.querySelectorAll("td");
                    if (cells.length > 0) {
                        cells[0].remove();
                        cells[cells.length - 1].remove();
                    }
                });
                const allCells = tableClone.querySelectorAll("th, td");
                allCells.forEach(cell => {
                    cell.textContent = cell.textContent?.replace(/\s+/g, ' ').trim() || '';
                });

                worksheet = XLSX.utils.table_to_sheet(tableClone);
            } else {
                alert("No data or table ID provided for export.");
                setIsExporting(false);
                return;
            }

            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
            XLSX.writeFile(workbook, `${fileName}_${new Date().toISOString().split('T')[0]}.xlsx`);

        } catch (error) {
            console.error("Excel generation failed:", error);
            alert("Failed to generate Excel file. Please try again.");
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <button
            onClick={handleExport}
            disabled={isExporting}
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                background: '#fff',
                color: '#16a34a', // green-600
                border: '1.5px solid #bbf7d0', // green-200
                borderRadius: '9px',
                padding: '0.6rem 1.2rem',
                fontSize: '0.8rem',
                fontWeight: 700,
                fontFamily: "'Sora', sans-serif",
                cursor: 'pointer',
                transition: 'all 0.15s',
                boxShadow: '0 2px 4px rgba(22, 163, 74, 0.05)',
            }}
            onMouseOver={(e) => {
                if (!isExporting) {
                    e.currentTarget.style.background = '#f0fdf4'; // green-50
                    e.currentTarget.style.borderColor = '#86efac'; // green-300
                }
            }}
            onMouseOut={(e) => {
                if (!isExporting) {
                    e.currentTarget.style.background = '#fff';
                    e.currentTarget.style.borderColor = '#bbf7d0';
                }
            }}
            title="Export to Excel"
        >
            {isExporting ? <Loader2 size={14} className="animate-spin" /> : <Sheet size={14} />}
            {isExporting ? 'Generating...' : 'Export Excel'}
        </button>
    );
}
