// src/components/ValuationForm.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Car, Settings, Calendar, Activity, Fuel, DollarSign, Zap, Search, Lock } from 'lucide-react';
import { InputGroup, SelectGroup } from './ui/FormElements';
import { MANUFACTURERS, MODELS, YEARS, TRANSMISSIONS, FUEL_TYPES } from '../data/constants';

const ValuationForm = ({
    isDarkMode,
    formData,
    handleChange,
    handleSubmit,
    loading,
    isLocked,
    translations: t
}) => {
    return (
        <motion.div
            initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className={`w-full lg:w-5/12 p-8 rounded-3xl border shadow-2xl relative overflow-hidden group ${isDarkMode
                ? 'bg-gray-900/60 border-white/10 backdrop-blur-xl'
                : 'bg-white/80 border-gray-200 backdrop-blur-xl'
                }`}
        >
            {isLocked && (
                <div className="absolute inset-0 z-20 bg-black/10 backdrop-blur-[2px] flex items-center justify-center flex-col cursor-not-allowed">
                    <Lock size={48} className="text-white drop-shadow-lg mb-2" />
                    <p className="text-white font-bold bg-red-600 px-4 py-1 rounded-full text-xs shadow-lg">{t.locked}</p>
                </div>
            )}

            <div className="mb-6 border-b border-gray-500/20 pb-4">
                <h2 className={`text-xl font-bold uppercase tracking-widest ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{t.nav.valuation}</h2>
                <p className="text-xs text-gray-400 mt-1">{t.subtitle}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <SelectGroup
                        dark={isDarkMode} label={t.manufacturer} icon={Car}
                        name="manufacturer" value={formData.manufacturer} onChange={handleChange} options={MANUFACTURERS}
                    />
                    <SelectGroup
                        dark={isDarkMode} label={t.model} icon={Settings}
                        name="model" value={formData.model} onChange={handleChange} options={MODELS[formData.manufacturer] || []}
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <SelectGroup
                        dark={isDarkMode} label={t.year} icon={Calendar}
                        name="year" value={formData.year} onChange={handleChange} options={YEARS}
                    />
                    <InputGroup dark={isDarkMode} label={t.mileage} icon={Activity}>
                        <input type="number" name="mileage" value={formData.mileage} onChange={handleChange} className="w-full bg-transparent outline-none" min="0" step="100" />
                    </InputGroup>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <SelectGroup
                        dark={isDarkMode} label={t.transmission} icon={Settings}
                        name="transmission" value={formData.transmission} onChange={handleChange} options={TRANSMISSIONS}
                    />
                    <SelectGroup
                        dark={isDarkMode} label={t.fuelType} icon={Fuel}
                        name="fuelType" value={formData.fuelType} onChange={handleChange} options={FUEL_TYPES}
                    />
                </div>
                <div className="grid grid-cols-3 gap-3">
                    <InputGroup dark={isDarkMode} label={t.tax} icon={DollarSign}>
                        <input type="number" name="tax" value={formData.tax} onChange={handleChange} className="w-full bg-transparent outline-none" />
                    </InputGroup>
                    <InputGroup dark={isDarkMode} label={t.mpg} icon={Zap}>
                        <input type="number" name="mpg" value={formData.mpg} onChange={handleChange} className="w-full bg-transparent outline-none" />
                    </InputGroup>
                    <InputGroup dark={isDarkMode} label={t.engineSize} icon={Settings}>
                        <input type="number" step="0.1" name="engineSize" value={formData.engineSize} onChange={handleChange} className="w-full bg-transparent outline-none" />
                    </InputGroup>
                </div>

                <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className={`w-full py-4 mt-4 rounded-xl font-bold text-sm tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all ${isDarkMode
                        ? 'bg-white text-black hover:bg-gray-200'
                        : 'bg-black text-white hover:bg-gray-800'
                        }`}
                    type="submit" disabled={loading || isLocked}
                >
                    {loading ? <span className="animate-spin w-5 h-5 border-2 border-current border-t-transparent rounded-full" /> : <><Search size={18} /> {t.analyzeBtn}</>}
                </motion.button>
            </form>
        </motion.div>
    );
};

export default ValuationForm;