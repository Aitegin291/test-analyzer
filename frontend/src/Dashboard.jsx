import React, { useState } from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  LineChart, Line, XAxis, YAxis, CartesianGrid 
} from 'recharts';
import { Activity, ShieldCheck, AlertCircle, FileText, Trash2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FileUploader from './components/FileUploader';
import { useReports } from './hooks/useReports';
import { StatCard } from './components/StatCard';
import { ReportModal } from './components/ReportModal';

function Dashboard() {
  // Используем наш хук
  const navigate = useNavigate();
  const { reports, loadReports, deleteReport, loading } = useReports(navigate);
  const [selectedReport, setSelectedReport] = useState(null);

  const isDemo = localStorage.getItem('is_demo') === 'true';

  // Глобальные расчеты на основе ООП-моделей (reports уже содержит объекты класса ReportModel)
  const totalReports = reports.length;
  const globalTotalTests = reports.reduce((acc, r) => acc + r.totalTests, 0);
  const globalTotalFailed = reports.reduce((acc, r) => acc + r.failed, 0);
  
  // successRate теперь берется либо общий, либо из метода класса
  const successRate = globalTotalTests > 0 
    ? (((globalTotalTests - globalTotalFailed) / globalTotalTests) * 100).toFixed(1) 
    : 0;

  // Данные для графиков
  const latestReport = reports[0];
  const pieData = latestReport ? [
    { name: 'Успешно', value: latestReport.totalTests - latestReport.failed, color: '#10b981' },
    { name: 'Ошибки', value: latestReport.failed, color: '#ef4444' },
  ] : [];

  const lineData = [...reports].slice(0, 10).reverse().map(r => ({
    id: r.id, 
    errors: r.failed,
    date: r.formattedDate // Используем метод из нашего ООП-класса
  }));

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-10 text-slate-800">
      {loading && (
        <div className="fixed inset-0 bg-white/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <Activity className="animate-spin text-blue-600" size={40} />
            <p className="font-bold text-slate-600">Загрузка данных...</p>
          </div>
        </div>
      )}

      {isDemo && (
        <div className="bg-amber-100 text-amber-700 p-2 text-center text-sm font-medium border-b border-amber-200 mb-4 rounded-lg">
          Вы находитесь в демо-режиме.
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">
              My <span className="text-blue-600">Analyzer</span>
            </h1>
            <p className="text-slate-500 mt-1 font-medium">Система мониторинга качества ПО</p>
          </div>
          <FileUploader onUploadSuccess={loadReports} />
        </header>

        {/* Сетка карточек — используем все переменные */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard title="Отчетов" value={totalReports} icon={<FileText className="text-blue-500" />} color="bg-blue-50" />
          <StatCard title="Тестов" value={globalTotalTests} icon={<Activity className="text-purple-500" />} color="bg-purple-50" />
          <StatCard title="Успешность" value={`${successRate}%`} icon={<ShieldCheck className="text-green-500" />} color="bg-green-50" />
          <StatCard title="Ошибки" value={globalTotalFailed} icon={<AlertCircle className="text-red-500" />} color="bg-red-50" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Графики (используем pieData и lineData) */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
              <h2 className="text-xl font-bold mb-6">Последний файл</h2>
              {latestReport ? (
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={pieData} innerRadius={70} outerRadius={90} paddingAngle={8} dataKey="value">
                        {pieData.map((data, index) => (
                          <Cell key={`cell-${index}`} fill={data.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : <p className="text-center text-slate-400">Нет данных</p>}
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
              <h2 className="text-xl font-bold mb-6">Динамика ошибок</h2>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={lineData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="date" fontSize={10} />
                    <YAxis fontSize={10} />
                    <Tooltip />
                    <Line type="monotone" dataKey="errors" stroke="#ef4444" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Список (История запусков) */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold mb-6">История запусков</h2>
            <div className="grid gap-4">
              {reports.map(report => (
                <div 
                  key={report.id} 
                  onClick={() => setSelectedReport(report)}
                  className="bg-white p-5 rounded-2xl border border-slate-100 flex justify-between items-center hover:border-blue-400 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <FileText className="text-slate-400" size={24} />
                    <div>
                      <h3 className="font-bold text-slate-700">{report.name}</h3>
                      <p className="text-xs text-slate-400">{report.formattedDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <span className="block font-black">{report.totalTests}</span>
                      <span className="text-[10px] text-slate-400 uppercase">Tests</span>
                    </div>
                    {/* Кнопка удаления (используем deleteReport из хука) */}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteReport(report.id);
                      }}
                      className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
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

export default Dashboard;