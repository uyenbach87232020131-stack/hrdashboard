import React, { useCallback, useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import { useData } from '../../context/DataContext';
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function DropZone() {
  const { setData } = useData();
  const [dragState, setDragState] = useState<'idle' | 'dragover' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    if (!file.name.match(/\.(xlsx|xls)$/i)) {
      setDragState('error');
      setErrorMsg('Please upload a valid Excel file (.xlsx or .xls)');
      return;
    }

    setDragState('loading');
    
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = evt.target?.result;
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: '' }) as Record<string, unknown>[];
        
        if (jsonData.length === 0) {
          throw new Error('The uploaded Excel file is empty.');
        }

        const headers = Object.keys(jsonData[0] || {});
        setData(jsonData, file.name, headers);
        setDragState('success');
      } catch (err: unknown) {
        setDragState('error');
        setErrorMsg(err instanceof Error ? err.message : 'Failed to parse Excel file.');
      }
    };
    
    reader.onerror = () => {
      setDragState('error');
      setErrorMsg('Failed to read file.');
    };
    
    reader.readAsArrayBuffer(file);
  };

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (dragState !== 'loading') setDragState('dragover');
  }, [dragState]);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (dragState !== 'loading') setDragState('idle');
  }, [dragState]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  }, []);

  const onClick = () => {
    if (dragState !== 'loading') {
      fileInputRef.current?.click();
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="max-w-2xl mx-auto w-full">
      <div 
        onClick={onClick}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`relative overflow-hidden rounded-3xl border-2 border-dashed p-16 text-center transition-all duration-300 cursor-pointer flex flex-col items-center justify-center min-h-[320px]
          ${dragState === 'idle' ? 'border-slate-300 dark:border-slate-600 bg-white/50 dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800' : ''}
          ${dragState === 'dragover' ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30 scale-[1.02]' : ''}
          ${dragState === 'success' ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/20' : ''}
          ${dragState === 'error' ? 'border-red-500 bg-red-50/50 dark:bg-red-900/20' : ''}
          ${dragState === 'loading' ? 'border-slate-300 dark:border-slate-600 bg-white/50 dark:bg-slate-800/50 cursor-wait' : ''}
        `}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept=".xlsx,.xls" 
          onChange={onFileChange}
        />

        {dragState === 'idle' || dragState === 'dragover' ? (
          <>
            <div className={`p-4 rounded-full mb-4 transition-colors ${dragState === 'dragover' ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}>
              <Upload className="w-12 h-12" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">
              Drag & drop your Excel file here
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6">
              or click to browse from your computer
            </p>
            <div className="flex gap-2 text-xs font-medium text-slate-400 dark:text-slate-500">
              <span className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                <FileSpreadsheet className="w-3 h-3" /> .xlsx
              </span>
              <span className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                <FileSpreadsheet className="w-3 h-3" /> .xls
              </span>
            </div>
          </>
        ) : dragState === 'loading' ? (
          <>
            <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
            <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">
              Processing Data...
            </h3>
            <p className="text-slate-500 dark:text-slate-400">
              Analyzing rows and detecting columns
            </p>
          </>
        ) : dragState === 'success' ? (
          <>
            <div className="p-4 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 mb-4">
              <CheckCircle className="w-12 h-12" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">
              Upload Successful!
            </h3>
            <p className="text-slate-500 dark:text-slate-400">
              Your dashboard is ready.
            </p>
          </>
        ) : (
          <>
            <div className="p-4 rounded-full bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 mb-4">
              <AlertCircle className="w-12 h-12" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">
              Upload Failed
            </h3>
            <p className="text-red-500 dark:text-red-400 mb-4 text-center max-w-sm">
              {errorMsg}
            </p>
            <button 
              className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-sm font-medium hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setDragState('idle');
              }}
            >
              Try Again
            </button>
          </>
        )}
      </div>
    </div>
  );
}
