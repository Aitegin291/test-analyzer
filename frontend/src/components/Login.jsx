import { Link, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/token/', {
        username: username, 
        password: password
      });
      
      console.log("Токен получен!", response.data.access);
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);

      localStorage.removeItem('is_demo');
        
      navigate('/dashboard');
    } catch (error) {
        if (error.response?.status === 401) {
          setError('Неверный логин или пароль');
        } else {
          setError('Ошибка сервера');
      }
    } 
  };


  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-white rounded-4xl shadow-xl shadow-slate-200/60 p-10 border border-slate-100">
        <div className="text-center mb-10">
          <Link to="/" className="text-4xl font-black text-slate-900 tracking-tight">
            My <span className="text-blue-600">Analyzer</span>
          </Link>
          <h2 className="text-3xl font-bold text-slate-800 mt-6">С возвращением!</h2>
          <p className="text-slate-500 mt-2">Введите свои данные для входа</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Логин (имя пользователя)</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
              placeholder="Введите ваш логин"
              required
            />
          </div>
          <div>
            
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
              placeholder="••••••••"
              required
            />
          </div>

          <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-[0.98]">
            Войти в систему
          </button>

          {error && (
            <div className="text-red-500 mt-2">
              {error}
            </div>
          )}
        </form>

        <div className="mt-8 text-center">
          <p className="text-slate-500">
            Нет аккаунта?{' '}
            <Link to="/register" className="text-blue-600 font-bold hover:underline">Создать аккаунт</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;