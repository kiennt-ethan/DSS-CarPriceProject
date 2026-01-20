import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    TrendingUp, Users, Car, DollarSign, ArrowUpRight, ArrowDownRight,
    Activity, Calendar, Clock, CheckCircle2, AlertCircle
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Cell
} from 'recharts';

const Dashboard = ({ isDarkMode }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // FETCH DỮ LIỆU THẬT
    useEffect(() => {
        let isMounted = true;
        fetch('http://127.0.0.1:8000/dashboard-stats')
            .then(res => {
                if (!res.ok) throw new Error("Lỗi kết nối API");
                return res.json();
            })
            .then(result => {
                if (isMounted) {
                    setData(result);
                    setLoading(false);
                }
            })
            .catch(err => {
                if (isMounted) {
                    console.error(err);
                    setError("Không thể tải dữ liệu thị trường.");
                    setLoading(false);
                }
            });

        return () => { isMounted = false; };
    }, []);

    // --- CẤU HÌNH GIAO DIỆN ---
    const chartTextColor = isDarkMode ? "#9CA3AF" : "#64748B";
    const gridColor = isDarkMode ? "#374151" : "#E2E8F0";
    const tooltipBg = isDarkMode ? "#1F2937" : "#FFFFFF";
    const tooltipBorder = isDarkMode ? "1px solid #374151" : "1px solid #E2E8F0";

    const getIcon = (name) => {
        if (name === 'Car') return Car;
        if (name === 'DollarSign') return DollarSign;
        if (name === 'Users') return Users;
        return Activity;
    };

    // --- RENDER STATES ---
    if (loading) return (
        <div className="flex flex-col items-center justify-center h-96 text-gray-500">
            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p>Đang phân tích dữ liệu thị trường...</p>
        </div>
    );

    if (error) return (
        <div className="flex flex-col items-center justify-center h-96 text-red-500">
            <AlertCircle size={48} className="mb-2 opacity-50" />
            <p>{error}</p>
        </div>
    );

    if (!data || !data.stats || data.stats.length === 0) return (
        <div className="flex flex-col items-center justify-center h-96 text-gray-400">
            <Car size={64} className="mb-4 opacity-20" />
            <p className="text-lg">Chưa có dữ liệu phân tích.</p>
            <p className="text-sm mt-2">Hãy thực hiện định giá vài chiếc xe để kích hoạt Dashboard.</p>
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="w-full max-w-7xl mx-auto space-y-8 pb-12"
        >
            {/* 1. Header */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                <div>
                    <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                        Tổng quan thị trường
                    </h2>
                    <p className={`mt-1 ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                        Phân tích dữ liệu thời gian thực từ <span className="font-bold text-indigo-500">{data.stats[0]?.value || 0}</span> bản ghi định giá.
                    </p>
                </div>
                <div className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 ${isDarkMode ? 'bg-white/10 text-white' : 'bg-white text-slate-700 shadow-sm border border-slate-200'
                    }`}>
                    <Calendar size={16} />
                    {new Date().toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })}
                </div>
            </div>

            {/* 2. Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.stats.map((stat, idx) => {
                    const Icon = getIcon(stat.icon);
                    return (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
                            className={`p-6 rounded-3xl border transition-all duration-300 group ${isDarkMode
                                ? 'bg-gray-900/60 border-white/10 backdrop-blur-md hover:bg-gray-800/80'
                                : 'bg-white/80 border-white/60 backdrop-blur-xl shadow-lg shadow-indigo-100/50 hover:bg-white'
                                }`}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-2xl transition-colors ${isDarkMode ? `bg-${stat.color}-500/10 group-hover:bg-${stat.color}-500/20`
                                        : `bg-${stat.color}-50 group-hover:bg-${stat.color}-100`
                                    }`}>
                                    <Icon size={24} className={`text-${stat.color}-500`} />
                                </div>
                                <span className={`flex items-center text-xs font-bold px-3 py-1 rounded-full ${isDarkMode ? 'bg-green-500/10 text-green-400' : 'bg-green-100 text-green-700'
                                    }`}>
                                    <ArrowUpRight size={12} className="mr-1" /> {stat.change}
                                </span>
                            </div>
                            <h3 className={`text-4xl font-black mb-1 tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                {stat.value}
                            </h3>
                            <p className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-gray-500' : 'text-slate-400'}`}>
                                {stat.label}
                            </p>
                        </motion.div>
                    );
                })}
            </div>

            {/* 3. Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Price Trend Chart */}
                <div className={`lg:col-span-2 p-6 rounded-3xl border ${isDarkMode ? 'bg-gray-900/60 border-white/10' : 'bg-white/80 border-white/60 shadow-xl shadow-slate-200/50'
                    }`}>
                    <div className="flex justify-between items-center mb-8">
                        <h3 className={`text-lg font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                            <TrendingUp size={20} className="text-blue-500" /> Xu hướng giá trung bình
                        </h3>
                    </div>

                    <div className="h-80 w-full">
                        {data.chart_data && data.chart_data.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data.chart_data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} opacity={0.4} />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: chartTextColor, fontSize: 12 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: chartTextColor, fontSize: 12 }} tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: tooltipBg, borderRadius: '12px', border: tooltipBorder, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                        labelStyle={{ color: chartTextColor }}
                                        itemStyle={{ color: isDarkMode ? '#fff' : '#1e293b', fontWeight: 'bold' }}
                                        formatter={(value) => [`$${value.toLocaleString()}`, 'Định giá']}
                                    />
                                    <Area type="monotone" dataKey="price" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorPrice)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-500 text-sm">Chưa đủ dữ liệu để vẽ biểu đồ</div>
                        )}
                    </div>
                </div>

                {/* Brand Distribution */}
                <div className={`p-6 rounded-3xl border ${isDarkMode ? 'bg-gray-900/60 border-white/10' : 'bg-white/80 border-white/60 shadow-xl shadow-slate-200/50'
                    }`}>
                    <h3 className={`text-lg font-bold mb-8 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                        <Activity size={20} className="text-purple-500" /> Top Hãng xe
                    </h3>
                    <div className="h-80 w-full">
                        {data.brand_data && data.brand_data.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data.brand_data} layout="vertical" margin={{ left: -20 }}>
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: chartTextColor, fontSize: 13, fontWeight: 500 }} width={90} />
                                    <Tooltip
                                        cursor={{ fill: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
                                        contentStyle={{ backgroundColor: tooltipBg, borderRadius: '8px', border: tooltipBorder }}
                                    />
                                    <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={24} animationDuration={1000}>
                                        {data.brand_data.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-500 text-sm">Chưa đủ dữ liệu</div>
                        )}
                    </div>
                </div>
            </div>

            {/* 4. Recent Activity */}
            <div className={`p-6 rounded-3xl border overflow-hidden ${isDarkMode ? 'bg-gray-900/60 border-white/10' : 'bg-white/80 border-white/60 shadow-xl shadow-slate-200/50'
                }`}>
                <h3 className={`text-lg font-bold mb-6 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                    <Clock size={20} className="text-orange-500" /> Vừa định giá gần đây
                </h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className={`text-xs uppercase font-bold tracking-wider ${isDarkMode ? 'text-gray-500' : 'text-slate-400'}`}>
                            <tr>
                                <th className="pb-4 text-left">Dòng xe</th>
                                <th className="pb-4 text-center">Thời gian</th>
                                <th className="pb-4 text-right">Định giá AI</th>
                                <th className="pb-4 text-right">Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y ${isDarkMode ? 'divide-gray-800' : 'divide-slate-100'}`}>
                            {data.recent && data.recent.map((item, i) => (
                                <tr key={i} className={`group transition-colors ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-slate-50'
                                    }`}>
                                    <td className={`py-4 font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                                        {item.manufacturer} <span className="font-normal">{item.model}</span>
                                    </td>
                                    <td className={`py-4 text-center ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                                        {item.timestamp ? item.timestamp.split(' ')[1] : 'Just now'}
                                    </td>
                                    <td className="py-4 text-right font-bold text-indigo-500 text-base">
                                        ${item.predicted_price.toLocaleString()}
                                    </td>
                                    <td className="py-4 text-right">
                                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${isDarkMode ? 'bg-green-500/10 text-green-400' : 'bg-green-100 text-green-700'
                                            }`}>
                                            <CheckCircle2 size={12} /> Success
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );
};

export default Dashboard;