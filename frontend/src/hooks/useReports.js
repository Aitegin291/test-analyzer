import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/apiService';
import { ReportModel } from '../models/Report';

export function useReports(navigate) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);

  

  const loadReports = useCallback(async () => {
    const token = localStorage.getItem('access_token');
    if (!token) return navigate('/login');

    setLoading(true);
    try {
      apiService.setToken(token);
      const data = await apiService.getReports();
      console.log("Данные из БД получены:", data);
      // Превращаем каждый объект из JSON в экземпляр класса Report (ООП!)
      console.log("API DATA:", data);
      setReports(data.map(item => new ReportModel(item)));
    } catch (error) {
        console.error("Критическая ошибка загрузки:", error);
        if (error.response?.status === 401) navigate('/login');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  const deleteReport = async (id) => {
    setReports(prev => prev.filter(r => r.id !== id));
    try {
      await apiService.deleteReport(id);
    } catch (error) {
        console.error("Ошибка при удалении отчета:", error);
        loadReports();
    }
  };

  return { reports, loadReports, deleteReport, loading };
}