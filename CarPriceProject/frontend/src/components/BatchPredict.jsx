import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Upload, FileSpreadsheet, Download, CheckCircle, AlertCircle,
    Database, TrendingUp, DollarSign
} from 'lucide-react';
import * as XLSX from 'xlsx';
// Import tỷ giá để tính toán tiền tệ
import { EXCHANGE_RATES } from '../data/constants';

const BatchPredict = ({ isDarkMode, translations: t, currency }) => {
    const [file, setFile] = useState(null);
    const [data, setData] = useState([]);
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    // --- 1. TẢI FILE MẪU ---
    const downloadTemplate = () => {
        const templateData = [
            {
                manufacturer: "Ford", model: "Fiesta", year: 2019, transmission: "Manual",
                mileage: 40000, fuelType: "Petrol", tax: 145, mpg: 55.4, engineSize: 1.0
            },
            {
                manufacturer: "BMW", model: "X5", year: 2021, transmission: "Semi-Auto",
                mileage: 15000, fuelType: "Diesel", tax: 150, mpg: 45.0, engineSize: 3.0
            }
        ];
        const ws = XLSX.utils.json_to_sheet(templateData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Template");
        XLSX.writeFile(wb, "AutoPrestige_Template.xlsx");
    };

    // --- 2. XUẤT KẾT QUẢ RA EXCEL ---
    const exportResult = () => {
        if (data.length === 0) return;

        // Chuẩn bị dữ liệu xuất (Tính toán lại giá theo tiền tệ hiện tại)
        const exportData = data.map(item => {
            const priceUSD = item.predicted_price || item.AI_Price_Prediction || 0;
            const rate = EXCHANGE_RATES[currency].rate;
            const convertedPrice = Math.round(priceUSD * rate);

            return {
                ...item,
                [`Price_(${currency})`]: convertedPrice // Thêm cột giá theo tiền tệ
            };
        });

        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Valuation_Result");
        XLSX.writeFile(wb, `Valuation_Result_${new Date().toISOString().slice(0, 10)}.xlsx`);
    };

    // --- XỬ LÝ KÉO THẢ & UPLOAD ---
    const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
    const handleDragLeave = () => { setIsDragging(false); };
    const handleDrop = (e) => {
        e.preventDefault(); setIsDragging(false);
        validateAndSetFile(e.dataTransfer.files[0]);
    };
    const handleFileChange = (e) => validateAndSetFile(e.target.files[0]);

    const validateAndSetFile = (uploadedFile) => {
        setError(null);
        if (!uploadedFile) return;
        const validTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv', 'application/vnd.ms-excel'];
        if (!validTypes.includes(uploadedFile.type) && !uploadedFile.name.endsWith('.csv') && !uploadedFile.name.endsWith('.xlsx')) {
            setError("Định dạng không hợp lệ. Hãy dùng .csv hoặc .xlsx");
            return;
        }
        setFile(uploadedFile);
        setData([]); setSummary(null);
    };

    // --- GỌI API ---
    const handleUpload = async () => {
        if (!file) return;
        setLoading(true); setError(null);
        const formData = new FormData();
        formData.append('file', file);

        try {
            await new Promise(r => setTimeout(r, 800));
            const response = await fetch('http://127.0.0.1:8000/predict-batch', { method: 'POST', body: formData });
            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.detail || 'Lỗi server.');
            }
            const result = await response.json();
            const resultData = result.data;
            setData(resultData);

            // Tính thống kê (USD gốc)
            // Chú ý: Backend trả về 'predicted_price' (do ta đã sửa ở bước trước)
            // hoặc 'AI_Price_Prediction' (nếu dùng code cũ). Ta check cả 2.
            const totalValUSD = resultData.reduce((sum, item) => sum + (item.predicted_price || item.AI_Price_Prediction || 0), 0);
            setSummary({ totalCars: resultData.length, totalValueUSD: totalValUSD });

        } catch (err) {
            console.error(err); setError(err.message || "Lỗi kết nối.");
        } finally {
            setLoading(false);
        }
    };

    // --- HELPER: FORMAT TIỀN TỆ ---
    const formatMoney = (usdValue) => {
        const rate = EXCHANGE_RATES[currency].rate;
        const val = usdValue * rate;
        return val.toLocaleString(EXCHANGE_RATES[currency].locale, {
            style: 'currency', currency: currency, maximumFractionDigits: 0
        });
    };

    // Styles
    const cardClass = isDarkMode ? 'bg-gray-900/60 border-white/10 backdrop-blur-xl' : 'bg-white/90 border-white/60 shadow-xl';
    const textPrimary = isDarkMode ? 'text-white' : 'text-slate-900';
    const textSecondary = isDarkMode ? 'text-gray-400' : 'text-slate-500';

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-6xl mx-auto pb-12 space-y-8">

            {/* 1. STEPPER & TEMPLATE */}
            <div className={`p-8 rounded-3xl border ${cardClass}`}>
                <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white"><Database size={20} /></div>
                        <div>
                            <h2 className={`text-2xl font-bold ${textPrimary}`}>{t.batchTitle}</h2>
                            <p className={textSecondary}>Xử lý hàng ngàn xe chỉ trong vài giây.</p>
                        </div>
                    </div>
                    <button onClick={downloadTemplate} className="text-sm font-bold text-indigo-500 flex items-center gap-1 hover:text-indigo-400 transition-colors bg-indigo-500/10 px-4 py-2 rounded-lg">
                        <Download size={16} /> Tải file mẫu .xlsx
                    </button>
                </div>

                {/* Step Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { step: 1, title: 'Tải File Mẫu', desc: 'Tải xuống file mẫu chuẩn (.xlsx) chứa các cột thông tin.' },
                        { step: 2, title: 'Điền Dữ Liệu', desc: 'Nhập thông tin xe. Quan trọng: model, year, mileage.' },
                        { step: 3, title: 'Upload & AI', desc: 'Tải lên hệ thống. AI CatBoost sẽ tự động định giá.' }
                    ].map((s, i) => (
                        <div key={i} className={`p-6 rounded-2xl border relative overflow-hidden ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                            <div className="absolute -right-4 -top-4 text-9xl font-black opacity-5 select-none">{s.step}</div>
                            <div className="flex items-center gap-3 mb-3">
                                <span className="bg-indigo-500 text-white w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm">{s.step}</span>
                                <h3 className={`font-bold ${textPrimary}`}>{s.title}</h3>
                            </div>
                            <p className={`text-sm ${textSecondary}`}>{s.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* 2. UPLOAD AREA */}
            <div
                onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
                className={`relative p-10 rounded-3xl border-2 border-dashed transition-all duration-300 text-center flex flex-col items-center justify-center min-h-[250px] ${isDragging ? 'border-indigo-500 bg-indigo-500/10' : (isDarkMode ? 'border-gray-700 bg-gray-900/40' : 'border-slate-300 bg-white/60')
                    }`}
            >
                <input ref={fileInputRef} type="file" onChange={handleFileChange} className="hidden" accept=".csv, .xlsx" />

                <AnimatePresence mode="wait">
                    {!file ? (
                        <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center">
                            <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${isDarkMode ? 'bg-gray-800' : 'bg-slate-100'}`}>
                                <Upload size={32} className="text-indigo-500" />
                            </div>
                            <h3 className={`text-xl font-bold mb-2 ${textPrimary}`}>Kéo thả file vào đây</h3>
                            <button onClick={() => fileInputRef.current.click()} className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/30">Chọn File</button>
                            <p className="mt-6 text-xs text-gray-500">Hỗ trợ: .CSV, .XLSX (Tối đa 5MB)</p>
                        </motion.div>
                    ) : (
                        <motion.div key="selected" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center gap-4">
                            <div className="flex items-center gap-2 text-xl font-bold text-green-500"><FileSpreadsheet /> {file.name}</div>
                            <div className="flex gap-2">
                                <button onClick={() => setFile(null)} className={`px-4 py-2 border rounded-lg ${isDarkMode ? 'border-gray-600 text-gray-300' : 'border-gray-300 text-gray-600'}`}>Hủy</button>
                                <button onClick={handleUpload} disabled={loading} className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold flex items-center gap-2">
                                    {loading ? <span className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full"></span> : <><CheckCircle size={18} /> Xử lý ngay</>}
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {error && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute bottom-4 bg-red-500/10 text-red-500 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"><AlertCircle size={16} /> {error}</motion.div>}
            </div>

            {/* 3. KẾT QUẢ & THỐNG KÊ */}
            {summary && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className={`p-6 rounded-2xl border ${cardClass} flex items-center gap-4`}>
                        <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl"><Database size={24} /></div>
                        <div>
                            <p className={`text-xs uppercase font-bold ${textSecondary}`}>Đã xử lý</p>
                            <p className={`text-2xl font-black ${textPrimary}`}>{summary.totalCars} xe</p>
                        </div>
                    </div>
                    <div className={`p-6 rounded-2xl border ${cardClass} flex items-center gap-4`}>
                        <div className="p-3 bg-green-500/10 text-green-500 rounded-xl"><DollarSign size={24} /></div>
                        <div>
                            <p className={`text-xs uppercase font-bold ${textSecondary}`}>Tổng giá trị</p>
                            <p className={`text-2xl font-black ${textPrimary}`}>{formatMoney(summary.totalValueUSD)}</p>
                        </div>
                    </div>
                    <div className={`p-6 rounded-2xl border ${cardClass} flex items-center gap-4`}>
                        <div className="p-3 bg-purple-500/10 text-purple-500 rounded-xl"><TrendingUp size={24} /></div>
                        <div>
                            <p className={`text-xs uppercase font-bold ${textSecondary}`}>Giá trung bình</p>
                            <p className={`text-2xl font-black ${textPrimary}`}>{formatMoney(summary.totalValueUSD / summary.totalCars)}</p>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* 4. BẢNG DỮ LIỆU */}
            {data.length > 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`rounded-3xl border overflow-hidden ${isDarkMode ? 'bg-gray-900/60 border-white/10' : 'bg-white/90 border-white/60 shadow-xl'}`}>
                    <div className="p-4 border-b border-gray-500/10 flex justify-between items-center bg-gray-500/5">
                        <span className={`text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-slate-600'}`}>Kết quả chi tiết</span>
                        <button onClick={exportResult} className="text-sm font-bold text-green-600 hover:text-green-500 bg-green-100 px-3 py-1 rounded-lg flex items-center gap-1 transition-colors">
                            <Download size={14} /> Xuất Excel ({currency})
                        </button>
                    </div>
                    <div className="overflow-x-auto max-h-[500px]">
                        <table className="w-full text-sm">
                            <thead className={`sticky top-0 z-10 ${isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-slate-500 shadow-sm'}`}>
                                <tr>
                                    {Object.keys(data[0]).map((key) => (
                                        <th key={key} className="px-6 py-4 text-left font-bold uppercase text-xs tracking-wider whitespace-nowrap">
                                            {key === 'predicted_price' || key === 'AI_Price_Prediction'
                                                ? `Định giá (${currency})`
                                                : key.replace('_', ' ')}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className={`divide-y ${isDarkMode ? 'divide-gray-800 text-gray-300' : 'divide-slate-200 text-slate-700'}`}>
                                {data.map((row, idx) => (
                                    <tr key={idx} className={`transition-colors ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-indigo-50/50'}`}>
                                        {Object.entries(row).map(([key, val], i) => (
                                            <td key={i} className={`px-6 py-3 whitespace-nowrap ${key === 'predicted_price' || key === 'AI_Price_Prediction' ? 'font-bold text-green-500 text-base' : ''}`}>
                                                {key === 'predicted_price' || key === 'AI_Price_Prediction'
                                                    ? formatMoney(val)
                                                    : (typeof val === 'number' && key !== 'year' ? val.toLocaleString() : val)}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
};

export default BatchPredict;