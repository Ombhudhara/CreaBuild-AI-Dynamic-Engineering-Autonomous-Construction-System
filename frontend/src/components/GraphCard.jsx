import React from 'react';

export default function GraphCard({ title, children }) {
    return (
        <div className="glassmorphism rounded-3xl p-6 border border-white/10 bg-gray-950/60 transition-colors duration-500 hover:border-cyan-500/50 flex flex-col items-center justify-center">
            <h3 className="font-bold tracking-widest text-gray-300 uppercase mb-6 text-sm w-full text-left">{title}</h3>
            <div className="w-full h-[300px] flex items-center justify-center relative">
                {children}
            </div>
        </div>
    );
}
