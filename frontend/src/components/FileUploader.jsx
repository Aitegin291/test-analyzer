import React, { useState } from 'react';
import axios from 'axios';
import { Upload, Loader2, AlertCircle } from 'lucide-react';

function FileUploader({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // Состояние для текста ошибки

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setError(null); // Сбрасываем старую ошибку

    if (selectedFile) {
      // Проверяем тип файла
      if (selectedFile.type !== "application/json" && !selectedFile.name.endsWith('.json')) {
        setError("Пожалуйста, выберите файл формата JSON");
        setFile(null);
        e.target.value = null; // Очищаем инпут
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    try {
      await axios.post('http://127.0.0.1:8000/api/reports/upload/', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setFile(null);
      onUploadSuccess();
    } catch (err) {
      console.error("Детали ошибки:", err);
      setError("Ошибка при анализе файла на сервере");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <input 
          type="file" 
          accept=".json" // Мягкое ограничение в проводнике
          onChange={handleFileChange}
          className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white px-6 py-2 rounded-full font-bold transition-all"
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : <Upload size={18} />}
          {loading ? "Анализ..." : "Загрузить"}
        </button>
      </div>

      {/* Вывод ошибки под кнопкой */}
      {error && (
        <div className="flex items-center gap-2 text-red-500 text-sm mt-1 animate-bounce">
          <AlertCircle size={14} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

export default FileUploader;