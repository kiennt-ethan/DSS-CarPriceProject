// src/components/Navbar.jsx
import React from 'react';
import { Car, Globe, Moon, Sun } from 'lucide-react';
import { EXCHANGE_RATES, TABS } from '../data/constants';

const Navbar = ({
    isDarkMode, setIsDarkMode,
    lang, setLang,
    currency, setCurrency,
    activeTab, setActiveTab,
    translations: t
}) => {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-between items-center bg-transparent backdrop-blur-md border-b border-white/10">
            {/* Brand Logo */}
            <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shadow-xl ${isDarkMode ? 'bg-white text-black' : 'bg-black text-white'}`}>
                    <Car size={24} strokeWidth={2.5} />
                </div>
                <div>
                    <h1 className={`text-xl font-bold tracking-widest ${isDarkMode ? 'text-white' : 'text-black'}`}>AUTO<span className="font-light">PRESTIGE</span></h1>
                </div>
            </div>

            {/* Tabs */}
            <div className="hidden md:flex gap-1 bg-black/20 p-1 rounded-full backdrop-blur-md border border-white/10">
                {TABS.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeTab === tab.id
                            ? (isDarkMode ? 'bg-white text-black shadow-lg' : 'bg-black text-white shadow-lg')
                            : 'text-gray-400 hover:text-white hover:bg-white/10'
                            }`}
                    >
                        <tab.icon size={16} /> {t.nav[tab.labelKey]}
                    </button>
                ))}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
                {/* Currency Switcher */}
                <div className="flex bg-black/20 rounded-lg p-1 border border-white/10 backdrop-blur-sm">
                    {Object.keys(EXCHANGE_RATES).map(c => (
                        <button key={c} onClick={() => setCurrency(c)} className={`px-2 py-1 rounded text-xs font-bold transition-all ${currency === c ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}>
                            {c}
                        </button>
                    ))}
                </div>

                {/* Language */}
                <button onClick={() => setLang(lang === 'vi' ? 'en' : 'vi')} className="p-2 rounded-full bg-black/20 hover:bg-black/40 text-gray-400 hover:text-white transition-all border border-white/10">
                    <Globe size={18} />
                </button>

                {/* Dark Mode */}
                <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 rounded-full bg-black/20 hover:bg-black/40 text-gray-400 hover:text-white transition-all border border-white/10">
                    {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                </button>
            </div>
        </nav>
    );
};

export default Navbar;