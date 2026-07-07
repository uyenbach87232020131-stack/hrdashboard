import React from 'react';
import { FileText, Table, Image as ImageIcon, Download } from 'lucide-react';
import * as XLSX from 'xlsx';
import { useFilter } from '../../context/FilterContext';
import { calculateKPIs } from '../../utils/dataProcessing';

export default function ExportPanel() {
  const { filteredEmployees } = useFilter();

  const exportExcel = () => {
    const kpis = calculateKPIs(filteredEmployees);
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet([kpis]);
    XLSX.utils.book_append_sheet(wb, ws, "KPIs");
    const dataSheet = XLSX.utils.json_to_sheet(filteredEmployees.map(e => e.rawData));
    XLSX.utils.book_append_sheet(wb, dataSheet, "Data");
    XLSX.writeFile(wb, "HR_Report.xlsx");
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6">
      <button onClick={() => window.print()} className="p-6 bg-white/70 dark:bg-slate-800/70 rounded-2xl shadow hover:shadow-lg transition-all flex flex-col items-center justify-center gap-4 border border-slate-200 dark:border-slate-700">
        <FileText size={48} className="text-red-500" />
        <h3 className="font-bold">PDF Report</h3>
      </button>
      
      <button onClick={exportExcel} className="p-6 bg-white/70 dark:bg-slate-800/70 rounded-2xl shadow hover:shadow-lg transition-all flex flex-col items-center justify-center gap-4 border border-slate-200 dark:border-slate-700">
        <Table size={48} className="text-emerald-500" />
        <h3 className="font-bold">Excel Data</h3>
      </button>
    </div>
  );
}