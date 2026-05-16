import { DashboardLayout } from './components/DashboardLayout';
import { ReportModel } from './models/Report';

const MOCK_DATA = [
  new ReportModel({ id: 1, name: "Demo Test 1", total_tests: 100, failed: 5, created_at: new Date() }),
  new ReportModel({ id: 2, name: "Demo Test 2", total_tests: 80, failed: 2, created_at: new Date() }),
];

export function DemoDashboard() {
  return (
    <DashboardLayout 
      reports={MOCK_DATA}
      loading={false}
      onDelete={() => alert("В демо-режиме удаление запрещено")}
      onUpload={() => alert("В демо-режиме загрузка запрещена")}
      isDemo={true} // Передаем флаг демо
    />
  );
}