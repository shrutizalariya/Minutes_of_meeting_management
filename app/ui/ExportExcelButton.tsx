"use client";

import React, { useState } from "react";
import { Sheet, Loader2 } from "lucide-react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

interface ExportExcelButtonProps {
    tableId?: string; // Kept for backwards compatibility but we focus on data[] primarily now
    data?: any[];
    columns?: { header: string; key: string }[];
    fileName: string;
}

export default function ExportExcelButton({ tableId, data, columns, fileName }: ExportExcelButtonProps) {
    const [isExporting, setIsExporting] = useState(false);

    const handleExport = async () => {
        setIsExporting(true);
        try {
            const workbook = new ExcelJS.Workbook();
            workbook.creator = "MOM System";
            workbook.created = new Date();
            
            const worksheet = workbook.addWorksheet("Data", {
                views: [{ state: 'frozen', ySplit: 1 }] // Freeze header row
            });

            // If we have explicit data and columns, we prefer that for precise formatting.
            if (data && data.length > 0 && columns && columns.length > 0) {
                
                // 1. Setup Columns
                worksheet.columns = columns.map(col => ({
                    header: col.header,
                    key: col.key,
                    width: Math.max(col.header.length + 5, 20) // Default width
                }));

                // 2. Add Data
                data.forEach(item => {
                    const rowData: any = {};
                    columns.forEach(col => {
                        const keys = col.key.split('.');
                        let val = item;
                        for (const k of keys) {
                            val = val?.[k];
                        }
                        rowData[col.key] = val !== undefined && val !== null ? val : "";
                    });
                    worksheet.addRow(rowData);
                });

            } else if (tableId) {
                // Fallback to HTML table parsing (less styling control but functional)
                const table = document.getElementById(tableId) as HTMLTableElement;
                if (!table) {
                    alert("Table not found for export.");
                    setIsExporting(false);
                    return;
                }

                const rows = Array.from(table.rows);
                rows.forEach((row, rowIndex) => {
                    // Skip action columns if they exist (usually the last column in our designs)
                    const cells = Array.from(row.cells).slice(0, -1); 
                    
                    const rowData = cells.map(cell => cell.textContent?.replace(/\s+/g, ' ').trim() || '');
                    worksheet.addRow(rowData);

                    if (rowIndex === 0) {
                        // Estimate column widths from headers
                        worksheet.columns = rowData.map(header => ({
                            width: Math.max(header.length + 5, 20)
                        }));
                    }
                });
            } else {
                alert("No data or table ID provided for export.");
                setIsExporting(false);
                return;
            }

            // 3. Apply Premium Styling
            
            // Format Header Row
            const headerRow = worksheet.getRow(1);
            headerRow.height = 30;
            headerRow.eachCell((cell) => {
                cell.font = {
                    name: 'Segoe UI',
                    family: 4,
                    size: 11,
                    bold: true,
                    color: { argb: 'FFFFFFFF' }
                };
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FF1E293B' } // slate-800
                };
                cell.alignment = { vertical: 'middle', horizontal: 'center' };
                cell.border = {
                    top: { style: 'thin', color: { argb: 'FF334155' } },
                    left: { style: 'thin', color: { argb: 'FF334155' } },
                    bottom: { style: 'thin', color: { argb: 'FF334155' } },
                    right: { style: 'thin', color: { argb: 'FF334155' } }
                };
            });

            // Format Data Rows
            worksheet.eachRow((row, rowNumber) => {
                if (rowNumber === 1) return; // Skip header
                
                row.height = 25;
                
                // Alternate row colors for readability (zebra striping)
                const isEven = rowNumber % 2 === 0;
                
                row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                    cell.font = { name: 'Segoe UI', family: 4, size: 10, color: { argb: 'FF334155' } };
                    cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
                    
                    if (isEven) {
                        cell.fill = {
                            type: 'pattern',
                            pattern: 'solid',
                            fgColor: { argb: 'FFF8FAFC' } // slate-50
                        };
                    }

                    // Add subtle borders
                    cell.border = {
                        top: { style: 'hair', color: { argb: 'FFE2E8F0' } },
                        bottom: { style: 'hair', color: { argb: 'FFE2E8F0' } },
                        left: { style: 'hair', color: { argb: 'FFE2E8F0' } },
                        right: { style: 'hair', color: { argb: 'FFE2E8F0' } }
                    };

                    // Special formatting based on content heuristics
                    const cellValue = cell.value;
                    
                    // Center align percentages or short numbers
                    if (typeof cellValue === 'number') {
                        cell.alignment = { vertical: 'middle', horizontal: 'center' };
                    } 
                    // Date formatting heuristics
                    else if (typeof cellValue === 'string' && !isNaN(Date.parse(cellValue)) && cellValue.includes('-') && cellValue.length <= 24) {
                       // Keep dates left aligned but formatted
                    }
                });
            });

            // 4. Auto-fit columns based on content
            worksheet.columns.forEach((column) => {
                let maxLength = 0;
                column.eachCell?.({ includeEmpty: true }, function (cell) {
                    const columnLength = cell.value ? cell.value.toString().length : 10;
                    if (columnLength > maxLength) {
                        maxLength = columnLength;
                    }
                });
                // Add padding, cap at 50 to prevent massive columns
                column.width = Math.min(Math.max(maxLength + 2, 12), 50); 
            });

            // 5. Generate and Save File
            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
            const finalFileName = `${fileName}_${new Date().toISOString().split('T')[0]}.xlsx`;
            
            saveAs(blob, finalFileName);

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
            className={`
                inline-flex items-center gap-2 px-4 py-2.5 
                bg-white text-emerald-600 font-bold text-sm 
                border-2 border-emerald-100 rounded-xl
                shadow-sm hover:shadow-md hover:bg-emerald-50 hover:border-emerald-300
                hover:-translate-y-0.5 active:translate-y-0
                transition-all duration-200 ease-out
                disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0
            `}
            title="Export to formatted Excel"
        >
            {isExporting ? <Loader2 size={16} className="animate-spin" /> : <Sheet size={16} />}
            {isExporting ? 'Formatting...' : 'Export Excel'}
        </button>
    );
}
