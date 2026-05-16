import React, { useState } from 'react'; // Добавили useState для модалки
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Activity, ShieldCheck, AlertCircle, FileText, Trash2, LogOut } from 'lucide-react';
import { StatCard } from './StatCard';
import FileUploader from './FileUploader';
import { ReportModal } from './ReportModal'; 

export function DashboardLayout({ 
  reports, 
  loading, 
  onDelete, 
  onUpload, 
  onLogout, 
  isDemo = false 
}) {
  // Состояние модалки теперь живет здесь
  const [selectedReport, setSelectedReport] = useState(null);

  const totalReports = reports.length;
  const globalTotalTests = reports.reduce((acc, r) => acc + r.totalTests, 0);
  const globalTotalFailed = reports.reduce((acc, r) => acc + r.failed, 0);
  
  const successRate = globalTotalTests > 0 
    ? (((globalTotalTests - globalTotalFailed) / globalTotalTests) * 100).toFixed(1) 
    : 0;

  const latestReport = reports[0];
  const pieData = latestReport ? [
    { name: 'Успешно', value: latestReport.totalTests - latestReport.failed, color: '#10b981' },
    { name: 'Ошибки', value: latestReport.failed, color: '#ef4444' },
  ] : [];

  const lineData = [...reports].slice(0, 10).reverse().map(r => ({
    id: r.id, 
    errors: r.failed, 
    date: r.formattedDate 
  }));

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-10 text-slate-800">
      {/* ИСПОЛЬЗУЕМ loading */}
      {loading && (
        <div className="fixed inset-0 bg-white/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <Activity className="animate-spin text-blue-600" size={40} />
        </div>
      )}

      {isDemo && (
        <div className="bg-blue-600 text-white p-2 text-center text-sm font-bold rounded-lg mb-6 shadow-lg">
          РЕЖИМ ПРЕЗЕНТАЦИИ (ДЕМО)
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-black text-slate-900">My Analyzer</h1>
          </div>
          <div className="flex items-center gap-4">
            {!isDemo && onLogout && (
              <button onClick={onLogout} className="flex items-center gap-2 text-red-500 font-bold hover:bg-red-50 p-2 rounded-lg transition-all">
                <LogOut size={20} /> Выйти
              </button>
            )}
            {!isDemo && <FileUploader onUploadSuccess={onUpload} />}
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <StatCard title="Отчетов" value={totalReports} icon={<FileText />} color="bg-blue-50" />
          <StatCard title="Тестов" value={globalTotalTests} icon={<Activity />} color="bg-purple-50" />
          <StatCard title="Успешность" value={`${successRate}%`} icon={<ShieldCheck />} color="bg-green-50" />
          <StatCard title="Ошибки" value={globalTotalFailed} icon={<AlertCircle />} color="bg-red-50" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Графики */}
           <div className="lg:col-span-1 space-y-8">
              <div className="bg-white p-6 rounded-3xl border border-slate-200">
                <h2 className="text-xl font-bold mb-6">Последний файл</h2>
                {latestReport ? (
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                          {pieData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : <p className="text-slate-400">Нет данных</p>}
              </div>
           </div>

           {/* Список отчетов */}
           <div className="lg:col-span-2">
              <h2 className="text-xl font-bold mb-6">История запусков</h2>
              <div className="space-y-4">
                {reports.map(report => (
                  <div 
                    key={report.id} 
                    onClick={() => setSelectedReport(report)} // ИСПОЛЬЗУЕМ setSelectedReport
                    className="bg-white p-4 rounded-2xl border border-slate-100 flex justify-between items-center hover:border-blue-400 cursor-pointer transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <FileText className="text-slate-400" />
                      <div>
                        <h3 className="font-bold">{report.name}</h3>
                        <p className="text-xs text-slate-400">{report.formattedDate}</p>
                      </div>
                    </div>
                    {/* ИСПОЛЬЗУЕМ onDelete вместо deleteReport */}
                    <button 
                      onClick={(e) => { e.stopPropagation(); onDelete(report.id); }}
                      className="p-2 text-slate-300 hover:text-red-500"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
           </div>
        </div>
      </div>

      <ReportModal report={selectedReport} onClose={() => setSelectedReport(null)} />
    </div>
  );
}