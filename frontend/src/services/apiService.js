import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: API_URL,
});

export const apiService = {
  // Метод для установки токена
  setToken: (token) => {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  },

  getReports: async () => {
    const response = await api.get('/reports/'); 
    return response.data;
  },

  // Метод для удаления
  deleteReport: async (id) => {
    const response = await api.delete(`/reports/${id}/`);
    return response.data;
  },

  // метод загрузки файла
  uploadReport: async (formData) => {
    const response = await api.post('/reports/upload/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }
};