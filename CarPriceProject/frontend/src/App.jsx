// src/App.jsx
import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';

// --- IMPORT COMPONENTS ---
import BackgroundVideo from './components/BackgroundVideo';
import Navbar from './components/Navbar';
import ValuationForm from './components/ValuationForm';
import ResultDisplay from './components/ResultDisplay';
import Dashboard from './components/Dashboard';
import History from './components/History';
import BatchPredict from './components/BatchPredict';
import AIChat from './components/AIChat';

// --- IMPORT DATA ---
import { TRANSLATIONS, MODELS } from './data/constants';

const App = () => {
  // 1. STATE QUẢN LÝ APP
  const [lang, setLang] = useState('vi');
  const t = TRANSLATIONS[lang];
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState('valuation'); // Tab mặc định

  // 2. STATE QUẢN LÝ FORM ĐỊNH GIÁ (Cho tab Valuation)
  const [formData, setFormData] = useState({
    manufacturer: 'Ford',
    model: 'Fiesta',
    year: 2019,
    transmission: 'Manual',
    mileage: 40000,
    fuelType: 'Petrol',
    tax: 145,
    mpg: 55.4,
    engineSize: 1.0
  });

  const [result, setResult] = useState(null);
  const [currency, setCurrency] = useState('USD');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isLocked, setIsLocked] = useState(false);

  // 3. EFFECTS
  // Tự động thêm class 'dark' vào html để Tailwind xử lý dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // 4. HANDLERS
  const handleChange = (e) => {
    if (isLocked) return;
    const { name, value } = e.target;
    // Nếu đổi hãng xe -> Reset dòng xe về mặc định của hãng đó
    if (name === 'manufacturer') {
      setFormData(prev => ({
        ...prev,
        manufacturer: value,
        model: MODELS[value] ? MODELS[value][0] : ''
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLocked) return;

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      // Delay giả lập nhẹ để UI mượt hơn
      await new Promise(resolve => setTimeout(resolve, 800));

      // Gọi API Backend (Dùng 127.0.0.1 để tránh lỗi phân giải DNS trên một số máy Windows)
      const response = await fetch('http://127.0.0.1:8000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('API Error');

      const data = await response.json();
      setResult(data.price);
      setIsLocked(true); // Khóa form sau khi có kết quả
    } catch (err) {
      console.error(err);
      setError("Không thể kết nối Backend. Vui lòng kiểm tra server Python (uvicorn).");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setIsLocked(false);
    setResult(null);
  };

  // 5. RENDER UI
  return (
    <div className={`min-h-screen font-sans transition-colors duration-500 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>

      {/* Video nền */}
      <BackgroundVideo isDarkMode={isDarkMode} />

      {/* Thanh điều hướng */}
      <Navbar
        isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode}
        lang={lang} setLang={setLang}
        currency={currency} setCurrency={setCurrency}
        activeTab={activeTab} setActiveTab={setActiveTab}
        translations={t}
      />

      {/* Khu vực nội dung chính */}
      <main className="relative z-10 w-full max-w-7xl pt-24 pb-12 flex flex-col lg:flex-row gap-8 px-4 h-auto min-h-[calc(100vh-20px)] items-start justify-center mx-auto">
        <AnimatePresence mode="wait">

          {/* === TAB 1: ĐỊNH GIÁ (VALUATION) === */}
          {activeTab === 'valuation' && (
            <>
              <ValuationForm
                isDarkMode={isDarkMode}
                formData={formData}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                loading={loading}
                isLocked={isLocked}
                translations={t}
              />
              <ResultDisplay
                isDarkMode={isDarkMode}
                result={result}
                loading={loading}
                error={error}
                currency={currency}
                formData={formData}
                handleReset={handleReset}
                translations={t}
              />
            </>
          )}

          {/* === TAB 2: ĐỊNH GIÁ LÔ (BATCH) === */}
          {activeTab === 'batch' && (
            <BatchPredict
              isDarkMode={isDarkMode}
              translations={t}
              currency={currency}
            />
          )}

          {/* === TAB 3: AI CHATBOT (CHAT) === */}
          {activeTab === 'chat' && (
            <AIChat
              isDarkMode={isDarkMode}
              translations={t}
            />
          )}

          {/* === TAB 4: PHÂN TÍCH (DASHBOARD) === */}
          {activeTab === 'analysis' && (
            <Dashboard isDarkMode={isDarkMode} />
          )}

          {/* === TAB 5: LỊCH SỬ (HISTORY) === */}
          {activeTab === 'history' && (
            <History isDarkMode={isDarkMode} currency={currency} />
          )}

        </AnimatePresence>
      </main>
    </div>
  );
};

export default App;