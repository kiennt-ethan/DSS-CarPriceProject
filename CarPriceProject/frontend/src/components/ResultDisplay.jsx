import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Car, Lock, ShieldCheck, Calendar, Activity, Settings, RefreshCw, AlertCircle } from 'lucide-react';
import { ResultItem } from './ui/ResultElements';
import { EXCHANGE_RATES } from '../data/constants';

const ResultDisplay = ({
    isDarkMode, result, loading, error, currency, formData, handleReset, translations: t
}) => {
    const displayPrice = result ? (result * EXCHANGE_RATES[currency].rate) : 0;
    const priceString = displayPrice.toLocaleString(EXCHANGE_RATES[currency].locale, {
        style: 'currency', currency: currency, maximumFractionDigits: 0
    });

    return (
        <motion.div
            initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 50, opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="w-full lg:w-7/12 flex items-center justify-center min-h-[500px]"
        >
            <AnimatePresence mode='wait'>
                {/* --- TRẠNG THÁI CHỜ (IDLE) --- */}
                {!result && !loading && !error && (
                    <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
                        <div className={`w-40 h-40 rounded-full border-2 flex items-center justify-center mx-auto mb-6 ${isDarkMode ? 'border-white/10 bg-white/5' : 'border-slate-300 bg-white/50 shadow-inner'
                            }`}>
                            <Car size={64} className={isDarkMode ? 'text-gray-600' : 'text-slate-400'} strokeWidth={1} />
                        </div>
                        <h3 className={`text-3xl font-light ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{t.ready}</h3>
                        <p className={`${isDarkMode ? 'text-gray-500' : 'text-slate-500'} mt-2`}>{t.readyDesc}</p>
                    </motion.div>
                )}

                {/* --- TRẠNG THÁI LOADING --- */}
                {loading && (
                    <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
                        <div className="relative w-32 h-32 mx-auto mb-8">
                            <div className={`absolute inset-0 rounded-full border-4 ${isDarkMode ? 'border-white/10' : 'border-slate-200'}`}></div>
                            <div className={`absolute inset-0 rounded-full border-4 border-t-transparent animate-spin ${isDarkMode ? 'border-white' : 'border-slate-800'}`}></div>
                        </div>
                        <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{t.analyzing}</h3>
                        <p className={`${isDarkMode ? 'text-gray-500' : 'text-slate-500'} mt-2 text-sm font-mono`}>{t.analyzingDesc}</p>
                    </motion.div>
                )}

                {/* --- KẾT QUẢ --- */}
                {result && (
                    <motion.div
                        key="result"
                        initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                        // CẢI TIẾN CARD KẾT QUẢ Ở ĐÂY
                        className={`w-full max-w-lg p-2 rounded-[2.5rem] shadow-2xl relative overflow-hidden transition-all duration-500 ${isDarkMode
                                ? 'bg-gradient-to-br from-gray-800 to-black border border-white/10'
                                : 'bg-gradient-to-br from-white to-slate-100 border border-white shadow-[0_25px_60px_rgba(0,0,0,0.15)]' // Gradient trắng sang xám nhạt
                            }`}
                    >
                        <div className={`rounded-[2.2rem] p-10 text-center relative overflow-hidden h-full flex flex-col justify-center ${isDarkMode ? 'bg-[#0a0a0a]' : 'bg-white/60 backdrop-blur-md'
                            }`}>

                            <p className={`text-xs font-bold uppercase tracking-[0.2em] mb-4 ${isDarkMode ? 'text-gray-500' : 'text-slate-500'}`}>{t.estimatedValue}</p>

                            <div className={`text-6xl font-black mb-2 tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                {priceString}
                            </div>

                            <div className="flex justify-center mb-8">
                                <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'bg-green-500/10 text-green-500' : 'bg-green-100 text-green-700'
                                    }`}>
                                    <ShieldCheck size={14} /> {t.accuracy}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {/* ResultItem tự động chỉnh màu dựa trên prop dark */}
                                <ResultItem dark={isDarkMode} label={t.year} value={formData.year} icon={Calendar} />
                                <ResultItem dark={isDarkMode} label={t.mileage} value={formData.mileage.toLocaleString()} icon={Activity} />
                                <ResultItem dark={isDarkMode} label={t.engineSize} value={`${formData.engineSize}L`} icon={Settings} />
                                <ResultItem dark={isDarkMode} label={t.transmission} value={formData.transmission} icon={RefreshCw} />
                            </div>

                            <button onClick={handleReset} className={`mt-8 w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${isDarkMode
                                    ? 'bg-white/10 hover:bg-white/20 text-white'
                                    : 'bg-slate-900 text-white hover:bg-slate-800 shadow-lg' // Nút đen trên nền trắng rất sang
                                }`}>
                                <RefreshCw size={16} /> {t.reset}
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* --- ERROR --- */}
                {error && (
                    <motion.div key="error" className="bg-red-500/10 p-6 rounded-2xl border border-red-500/20 text-center backdrop-blur-sm">
                        <AlertCircle size={40} className="text-red-500 mx-auto mb-3" />
                        <h3 className="text-red-500 font-bold">{t.error}</h3>
                        <p className="text-red-400/70 text-sm mt-1">{error}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default ResultDisplay;