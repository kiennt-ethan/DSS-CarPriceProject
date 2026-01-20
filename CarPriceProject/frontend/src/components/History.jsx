import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Download, Database, Calendar } from 'lucide-react';
import * as XLSX from 'xlsx';
import { EXCHANGE_RATES } from '../data/constants';

const History = ({ isDarkMode, currency }) => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    // 1. FETCH DỮ LIỆU
    useEffect(() => {
        fetch('http://127.0.0.1:8000/history')
            .then(res => res.json())
            .then(data => {
                setHistory(data);
                setLoading(false);
            })
            .catch(err => setLoading(false));
    }, []);

    // --- HELPER: FORMAT TIỀN TỆ ---
    const formatMoney = (usdValue) => {
        const rate = EXCHANGE_RATES[currency].rate;
        const val = usdValue * rate;
        return val.toLocaleString(EXCHANGE_RATES[currency].locale, {
            style: 'currency', currency: currency, maximumFractionDigits: 0
        });
    };

    // --- 2. XỬ LÝ XUẤT EXCEL ---
    const handleExport = () => {
        if (history.length === 0) return;

        // Chuẩn bị dữ liệu sạch để xuất
        const exportData = history.map(item => {
            const rate = EXCHANGE_RATES[currency].rate;
            const convertedPrice = Math.round(item.predicted_price * rate);

            return {
                ID: item.id,
                Date: item.timestamp,
                Manufacturer: item.manufacturer,
                Model: item.model,
                Year: item.year,
                Transmission: item.transmission,
                Mileage: item.mileage,
                Fuel: item.fuelType,
                Engine_Size: item.engineSize,
                // Giá trị quan trọng nhất
                [`Predicted_Price_(${currency})`]: convertedPrice
            };
        });

        // Tạo file Excel
        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Valuation_History");

        // Tên file có ngày giờ
        const fileName = `AutoPrestige_History_${new Date().toISOString().slice(0, 10)}.xlsx`;
        XLSX.writeFile(wb, fileName);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-7xl mx-auto pb-12"
        >
            <div className={`rounded-3xl border overflow-hidden ${isDarkMode ? 'bg-gray-900/60 border-white/10 backdrop-blur-xl' : 'bg-white/80 border-white/60 shadow-xl'
                }`}>
                {/* Header */}
                <div className={`p-6 border-b flex justify-between items-center ${isDarkMode ? 'border-white/5' : 'border-gray-200'}`}>
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-100 text-indigo-600'}`}>
                            <Database size={20} />
                        </div>
                        <div>
                            <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                                Lịch sử định giá
                            </h2>
                            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                                Tổng cộng: {history.length} bản ghi
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={handleExport}
                        disabled={history.length === 0}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg ${history.length === 0
                                ? 'bg-gray-500 opacity-50 cursor-not-allowed text-white'
                                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-500/30'
                            }`}
                    >
                        <Download size={16} /> Xuất báo cáo ({currency})
                    </button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto max-h-[600px]">
                    <table className="w-full text-sm">
                        <thead className={`text-xs uppercase font-bold sticky top-0 z-10 ${isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-slate-50 text-slate-500'}`}>
                            <tr>
                                <th className="px-6 py-4 text-left">ID</th>
                                <th className="px-6 py-4 text-left">Thời gian</th>
                                <th className="px-6 py-4 text-left">Dòng xe</th>
                                <th className="px-6 py-4 text-left">Thông số</th>
                                <th className="px-6 py-4 text-right">Định giá ({currency})</th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y ${isDarkMode ? 'divide-gray-800' : 'divide-slate-100'}`}>
                            {history.map((item) => (
                                <tr key={item.id} className={`transition-colors ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-indigo-50/50'}`}>
                                    <td className={`px-6 py-4 font-mono ${isDarkMode ? 'text-gray-500' : 'text-slate-400'}`}>#{item.id}</td>

                                    <td className={`px-6 py-4 ${isDarkMode ? 'text-gray-300' : 'text-slate-700'}`}>
                                        <div className="flex items-center gap-2">
                                            <Calendar size={14} className="opacity-50" />
                                            {item.timestamp}
                                        </div>
                                    </td>

                                    <td className={`px-6 py-4 font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                        {item.manufacturer} {item.model}
                                        <span className={`ml-2 text-xs font-normal px-2 py-0.5 rounded-full ${isDarkMode ? 'bg-white/10 text-gray-300' : 'bg-slate-200 text-slate-600'}`}>
                                            {item.year}
                                        </span>
                                    </td>

                                    <td className={`px-6 py-4 ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>
                                        {item.mileage.toLocaleString()} miles • {item.transmission}
                                    </td>

                                    <td className="px-6 py-4 text-right font-bold text-green-500 text-base">
                                        {formatMoney(item.predicted_price)}
                                    </td>
                                </tr>
                            ))}

                            {history.length === 0 && !loading && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                        <div className="flex flex-col items-center gap-3">
                                            <Database size={40} className="opacity-20" />
                                            <p>Chưa có dữ liệu lịch sử.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );
};

export default History;