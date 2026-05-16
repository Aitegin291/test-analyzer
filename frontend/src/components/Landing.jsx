import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="fixed w-full top-0 z-50 bg-white/80 border-slate-200">
      <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
      
        <div className="text-4xl font-black text-slate-900 tracking-tight z-50">
          My <span className="text-blue-600">Analyzer</span>
        </div>

        <nav className="hidden md:flex space-x-8 font-medium text-slate-600">
          <a href="#about" className="hover:text-blue-600 transition-colors">Что это такое</a>
          <a href="#features" className="hover:text-blue-600 transition-colors">Возможности</a>
          <a href="#how-it-works" className="hover:text-blue-600 transition-colors">Как это работает</a>
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          <Link to="/login" className="text-slate-600 font-semibold hover:text-slate-900">Войти</Link>
          <Link to="/register" className="bg-blue-600 text-white px-6 py-2.5 rounded-full font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
            Начать бесплатно
          </Link>
        </div>

        <button 
          onClick={toggleMenu}
          className="md:hidden z-50 flex flex-col justify-center items-center w-8 h-8 space-y-1.5 focus:outline-none"
        >
          <span className={`block w-7 h-1 bg-slate-900 rounded-full transition-transform duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2.5' : ''}`}></span>
          <span className={`block w-7 h-1 bg-slate-900 rounded-full transition-opacity duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`block w-7 h-1 bg-slate-900 rounded-full transition-transform duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2.5' : ''}`}></span>
        </button>

        <div className={`fixed top-0.5 left-0 w-full h-auto bg-white z-40 flex flex-col p-8 transition-transform duration-300 ease-in-out md:hidden ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex flex-col space-y-8 mt-20 text-center">
            <a href="#about" onClick={toggleMenu} className="text-xl font-medium text-slate-600 hover:text-blue-600">Что это такое</a>
            <a href="#features" onClick={toggleMenu} className="text-xl font-medium text-slate-600 hover:text-blue-600">Возможности</a>
            <a href="#how-it-works" onClick={toggleMenu} className="text-xl font-medium text-slate-600 hover:text-blue-600">Как это работает</a>
            
            <hr className="border-slate-100" />
            
            <div className="flex flex-col space-y-4">
              <Link to="/login" onClick={toggleMenu} className="text-lg text-slate-600 font-semibold">Войти</Link>
              <Link to="/register" onClick={toggleMenu} className="bg-blue-600 text-white px-6 py-4 rounded-full font-bold shadow-lg">
                Начать бесплатно
              </Link>
            </div>
          </div>
        </div>

      </div>
    </header>
  );
};

const Landing = () => {
  const navigate = useNavigate();

  const handleDemoStart = async () => {
    try {
      // Автоматический запрос на получение токена
      const response = await axios.post('http://127.0.0.1:8000/api/token/', {
        username: 'demo_user', // Тот самый логин
        password: 'demo12345'  // Тот самый пароль
      });

      // Сохраняем "ключи" в хранилище, как при обычном входе
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);

      localStorage.setItem('is_demo', 'true');

      // Перекидываем в личный кабинет
      navigate('/dashboard');
    } catch (error) {
      console.error("Ошибка демо-входа:", error);
      alert("Демо-аккаунт еще не настроен в базе данных.");
    }
  };
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* 1. HEADER */}
      <Header />

      <section className="pt-40 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 leading-tight">
            Ваши JSON-отчеты <br />
            <span className="text-blue-600">обретят смысл</span>
          </h1>
          <p className="text-xl text-slate-500 mb-12 max-w-2xl mx-auto leading-relaxed">
            Загружайте отчеты, отслеживайте динамику ошибок и повышайте качество вашего продукта.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/register" className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all shadow-xl">
              Загрузить первый отчет
            </Link>
            <button 
            onClick={handleDemoStart}
            className="bg-white text-slate-900 border border-slate-200 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all">
              Посмотреть демо
            </button>
          </div>
        </div>
      </section>

      <section id="about" className="py-24 bg-white overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 leading-tight">
              Что такое инструмент для <br className="hidden md:block" />
              автоматизированного анализа ошибок тестов?
            </h2>
            <div className="w-24 h-2 bg-blue-600 mx-auto rounded-full"></div>
          </div>

          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <p className="text-xl text-slate-700 leading-relaxed font-medium">
                Это программное решение, которое берет на себя самую рутинную часть работы инженера — 
                поиск причин сбоев в огромных массивах данных.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed">
                Вместо того чтобы вручную открывать десятки JSON-файлов, наш сервис автоматически 
                интерпретирует результаты ваших тестов. Он мгновенно подсвечивает критические 
                сбои API, 
                ошибки логики и проблемы с инфраструктурой, предоставляя наглядную статистику 
                в реальном времени.
              </p>
              <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-2xl">
                <p className="text-blue-800 italic">
                  "Современные команды используют наш инструмент, чтобы сократить время анализа 
                  инцидентов с часов до секунд, обеспечивая стабильность релизов даже при 
                  использовании кода, сгенерированного ИИ."
                </p>
              </div>
            </div>

            
            <div className="relative">
              <div className="absolute -inset-4 bg-blue-100 rounded-full blur-3xl opacity-30 animate-pulse"></div>
              <div className="relative bg-slate-900 rounded-3xl p-8 shadow-2xl border border-slate-800">
                <div className="font-mono text-sm space-y-2">
                    <div className="text-green-400">✓ Test 'Auth_Success' passed (120ms)</div>
                    <div className="text-red-400">✗ Test 'Order_Create' failed: API_TIMEOUT_504</div>
                    <div className="text-slate-500">... processing 458 more logs ...</div>
                    <div className="mt-4 pt-4 border-t border-slate-700 text-blue-400 font-bold">
                      Анализ завершен: 1 ошибка найдена
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURES BLOCK */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Feature 1 */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl transition-all group">
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h3 className="text-xl font-bold mb-4">Мгновенный анализ</h3>
              <p className="text-slate-500 leading-relaxed">Всё просто. Просто перетащите ваш JSON файл, и система моментально построит все графики.</p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl transition-all group">
              <div className="w-14 h-14 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-600 group-hover:text-white transition-all">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              </div>
              <h3 className="text-xl font-bold mb-4">История и динамика</h3>
              <p className="text-slate-500 leading-relaxed">Мы храним все ваши прошлые тесты. Отслеживайте, становится ли ваш код стабильнее со временем.</p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl transition-all group">
              <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-600 group-hover:text-white transition-all">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              </div>
              <h3 className="text-xl font-bold mb-4">Безопасность данных</h3>
              <p className="text-slate-500 leading-relaxed">Все данные зашифрованы и доступны только вам. Мы серьезно относимся к конфиденциальности отчетов.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-slate-900 mb-16">Как это работает?</h2>
          
          <div className="relative">
            {/* Линия пути (только для десктопа) */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-blue-200 -translate-y-1/2"></div>
            
            <div className="grid md:grid-cols-3 gap-12 relative">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-center">
                <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 font-bold">1</div>
                <h4 className="font-bold mb-2">Загрузка</h4>
                <p className="text-slate-500 text-sm">Просто перетащите ваш JSON-файл с результатами тестов в систему.</p>
              </div>
              
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-center">
                <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 font-bold">2</div>
                <h4 className="font-bold mb-2">Обработка</h4>
                <p className="text-slate-500 text-sm">Система автоматически парсит данные и находит критические ошибки.</p>
              </div>
              
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-center">
                <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 font-bold">3</div>
                <h4 className="font-bold mb-2">Результат</h4>
                <p className="text-slate-500 text-sm">Вы получаете детальный отчет и графики динамики тестирования.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Понравилась идея?
          </h3>
          <p className="text-slate-400 mb-8 max-w-md mx-auto">
            Начните анализировать свои логи прямо сейчас. Регистрация займет меньше минуты!
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => navigate('/register')}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all w-full sm:w-auto"
            >
              Зарегистрироваться скорее
            </button>
            
            <a 
              href="#top" 
              className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl transition-all w-full sm:w-auto flex items-center justify-center gap-2"
            >
              <span>Наверх</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </a>
          </div>
          
          <div className="mt-12 pt-8 border-t border-slate-800 text-slate-500 text-sm">
            © 2026 My Analyzer.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;