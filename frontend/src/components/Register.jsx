import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';


const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({}); 
  const [successMessage, setSuccessMessage] = useState(''); 
  const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

  const handleRegister = async (e) => {
  e.preventDefault();
  setErrors({}); 
  setSuccessMessage('');

  if (password !== confirmPassword) {
      setErrors({ confirmPassword: ["Пароли не совпадают"] });
      return;
  }

  try {
    const response = await axios.post(`${API_URL}/register/`, {
      username,
      email,
      password,
      password_confirm: confirmPassword,
    });
    
    if (response.status === 201) {
      setSuccessMessage("Аккаунт успешно создан! Сейчас вы будете перенаправлены на вход...");
      setTimeout(() => navigate('/login'), 1500);
    }
  } catch (err) {
    if (err.response && err.response.data) {
      setErrors(err.response.data);
    } else {
      setErrors({ non_field_errors: "Произошла сетевая ошибка. Попробуйте позже." });
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
          <h2 className="text-3xl font-bold text-slate-800 mt-6">Создать аккаунт</h2>
          <p className="text-slate-500 mt-2">Присоединяйтесь к аналитике</p>
        </div>
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-2xl text-sm font-medium animate-pulse">
            {successMessage}
          </div>
        )}

        {errors.non_field_errors && (
            <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm">
                {errors.non_field_errors}
            </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Имя пользователя</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
              placeholder="Ваше имя пользователя"
              required
            />
            {errors.username && (
              <p className="mt-1 ml-1 text-xs text-red-500 font-medium">
                {errors.username[0]}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
              placeholder="example@mail.com"
              required
            />
            {errors.email && (
              <p className="mt-1 ml-1 text-xs text-red-500 font-medium">{errors.email[0]}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Пароль</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
              placeholder="••••••••"
              required
            />
            {errors.password && (
              <p className="mt-1 ml-1 text-xs text-red-500 font-medium">{errors.password[0]}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Подтверждение пароля</label>
            <input 
              type="password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
              placeholder="••••••••"
              required
            />
            {errors.confirmPassword && (
              <p className="mt-2 ml-1 text-xs text-red-600 font-bold flex items-center">
                <span className="mr-1"></span> {errors.confirmPassword[0]}
              </p>
            )}
          </div>

          <div className="pt-2">
            <button className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all shadow-xl active:scale-[0.98]">
              Зарегистрироваться
            </button>
          </div>
        </form>

        <div className="mt-8 text-center text-sm">
          <p className="text-slate-500">
            Уже есть аккаунт?{' '}
            <Link to="/login" className="text-blue-600 font-bold hover:underline">Войти</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;