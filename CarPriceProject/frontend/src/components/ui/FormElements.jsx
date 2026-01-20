import React from 'react';

export const InputGroup = ({ label, icon: Icon, children, dark }) => (
    <div className="space-y-1">
        <label className={`text-[10px] font-bold uppercase tracking-wider pl-1 flex items-center gap-1.5 ${dark ? 'text-gray-400' : 'text-slate-500'}`}>
            {Icon && <Icon size={12} />} {label}
        </label>
        <div className={`rounded-lg flex items-center overflow-hidden border transition-all ${dark
            ? 'bg-white/5 border-white/10 text-white focus-within:border-white/30'
            : 'bg-slate-50 border-slate-200 text-slate-900 focus-within:border-slate-400 focus-within:bg-white shadow-sm'
            // Light Mode: Nền xám nhẹ, viền xám, khi focus thì nền trắng
            }`}>
            <div className={`pl-3 pr-2 ${dark ? 'text-gray-500' : 'text-slate-400'}`}>
                {Icon && <Icon size={16} />}
            </div>
            {React.cloneElement(children, {
                className: `w-full py-3 pr-4 bg-transparent outline-none text-sm ${dark ? 'placeholder-gray-500/50' : 'placeholder-slate-400'}`
            })}
        </div>
    </div>
);

export const SelectGroup = ({ label, icon, name, value, onChange, options, dark }) => (
    <InputGroup label={label} icon={icon} dark={dark}>
        <select name={name} value={value} onChange={onChange} className="cursor-pointer appearance-none bg-transparent w-full">
            {Array.isArray(options) ? options.map(o => <option key={o} value={o} className={dark ? 'bg-gray-900' : 'bg-white text-slate-900'}>{o}</option>)
                : Object.keys(options).map(o => <option key={o} value={o} className={dark ? 'bg-gray-900' : 'bg-white text-slate-900'}>{o}</option>)}
        </select>
    </InputGroup>
);