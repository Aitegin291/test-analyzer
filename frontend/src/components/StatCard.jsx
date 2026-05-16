import React from 'react';

// Визуальное программирование: выделяем независимый элемент интерфейса
export function StatCard({ title, value, icon, color }) {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-5 hover:shadow-lg transition-all cursor-default">
      <div className={`p-4 rounded-2xl ${color} shrink-0`}>{icon}</div>
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{title}</p>
        <h3 className="text-2xl font-black text-slate-800 leading-none">{value}</h3>
      </div>
    </div>
  );
}