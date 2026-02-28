import React from 'react';
import { Cpu, Bell } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Header({ status = 'active' }) {
    // status: 'active' | 'warning'

    const isWarning = status === 'warning';

    return (
        <header className="h-20 w-full glassmorphism border-b border-white/10 px-6 sm:px-12 flex items-center justify-between bg-gray-950/80 sticky top-0 z-30">
            <div className="flex items-center gap-4">
                <h1 className="text-2xl font-black text-white tracking-widest uppercase truncate drop-shadow-md">
                    Project <span className="text-cyan-400 font-light">Apex-A1</span>
                </h1>
                <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
                    <span className="text-gray-400 text-xs font-bold tracking-widest uppercase">ID:</span>
                    <span className="text-white font-mono text-sm">CB-00984</span>
                </div>
            </div>

            <div className="flex items-center gap-6">
                {/* Pulsing AI Active Badge */}
                <motion.div
                    animate={isWarning ? { scale: [1, 1.05, 1] } : {}}
                    transition={{ repeat: Infinity, duration: 0.5 }}
                    className={`group flex items-center gap-3 px-4 py-2 rounded-full border transition-all ${isWarning
                            ? 'bg-red-900/40 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.6)] neon-red-border'
                            : 'bg-cyan-900/30 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.3)] neon-pulse-border'
                        }`}
                >
                    <Cpu className={`w-5 h-5 ${isWarning ? 'text-red-400 animate-pulse' : 'text-cyan-400'}`} />
                    <span className={`text-sm font-bold tracking-widest uppercase ${isWarning ? 'text-red-400 neon-red' : 'text-cyan-300 neon-cyan'
                        }`}>
                        {isWarning ? 'AI ANOMALY DETECTED' : 'AI ACTIVE'}
                    </span>
                    {!isWarning && (
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                        </span>
                    )}
                </motion.div>

                <button className="relative p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                    <Bell className="w-5 h-5 text-gray-300" />
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-gray-950 animate-pulse"></span>
                </button>
            </div>
        </header>
    );
}
