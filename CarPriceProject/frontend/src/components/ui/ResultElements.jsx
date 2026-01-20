// src/components/ui/ResultElements.jsx
import React from 'react';

export const ResultItem = ({ label, value, icon: Icon, dark }) => (
    <div className={`p-4 rounded-xl flex items-center gap-3 border ${dark ? 'bg-white/5 border-white/5' : 'bg-white border-gray-100'}`}>
        <div className={`p-2 rounded-lg ${dark ? 'bg-white/10 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
            <Icon size={16} />
        </div>
        <div className="overflow-hidden">
            <p className="text-[10px] uppercase font-bold tracking-wider opacity-50">{label}</p>
            <p className={`font-bold text-sm truncate ${dark ? 'text-white' : 'text-black'}`}>{value}</p>
        </div>
    </div>
);