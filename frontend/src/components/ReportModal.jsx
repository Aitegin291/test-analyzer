import React from 'react';
import { X, CheckCircle2, XCircle, Clock, FileText } from 'lucide-react';

export function ReportModal({ report, onClose }) {
  if (!report) return null;

  // 1. Используем camelCase из нашей модели ReportModel
  // В классе мы определили: this.rawLogs = data.raw_logs || { tests: [] };
  const tests = report.rawLogs?.tests || [];

  return (
    <div className="fixed inset-0 bg-slate-900/60 z-100 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Шапка модалки */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-slate-50/50">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{report.name}</h2>
            <div className="flex items-center gap-4 mt-2 text-sm text-slate-500 font-medium">
              <span className="flex items-center gap-1">
                <Clock size={14} />
                {/* 2. Используем геттер formattedDate из класса! */}
                {report.formattedDate}
              </span>
              <span className="flex items-center gap-1">
                <FileText size={14} />
                ID: {report.id}
              </span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400"
          >
            <X size={24} />
          </button>
        </div>

        {/* Содержимое (список тестов) */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Результаты тестов</h3>
          
          {tests.length > 0 ? (
            tests.map((test, index) => (
              <div 
                key={index} 
                className={`p-4 rounded-2xl border flex items-center justify-between ${
                  test.status === 'passed' 
                    ? 'bg-green-50 border-green-100' 
                    : 'bg-red-50 border-red-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  {test.status === 'passed' ? (
                    <CheckCircle2 className="text-green-500" size={20} />
                  ) : (
                    <XCircle className="text-red-500" size={20} />
                  )}
                  <div>
                    <p className="font-bold text-slate-700">{test.name}</p>
                    {test.message && (
                      <p className="text-xs text-red-600 mt-1 font-mono">{test.message}</p>
                    )}
                  </div>
                </div>
                <span className="text-[10px] font-black uppercase px-2 py-1 rounded-md bg-white shadow-sm">
                  {test.duration ? `${test.duration}s` : '0s'}
                </span>
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-slate-400">
              Логи тестов не найдены в этом отчете.
            </div>
          )}
        </div>

        {/* Футер */}
        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
}