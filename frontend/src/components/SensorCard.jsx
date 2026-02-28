import React from 'react';
import { motion } from 'framer-motion';

export default function SensorCard({ title, value, unit, icon: Icon, colorClass, trend, status }) {
    // status: 'normal', 'warning', 'critical'

    const statusColors = {
        normal: 'border-cyan-500/20 text-cyan-400',
        warning: 'border-yellow-500/50 text-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.2)]',
        critical: 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)] text-red-500',
    };

    const currentStatusColor = statusColors[status] || statusColors.normal;

    return (
        <motion.div
            className={`glassmorphism rounded-2xl p-4 flex flex-col justify-between border ${currentStatusColor} transition-all duration-300 relative overflow-hidden bg-gray-950/80`}
        >
            <div className={`absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl opacity-20 pointer-events-none ${status === 'critical' ? 'bg-red-500' : 'bg-cyan-500'}`}></div>

            <div className="flex justify-between items-start mb-2 relative z-10">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-white/5">
                        <Icon className={`w-4 h-4 ${colorClass}`} />
                    </div>
                    <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest">{title}</h3>
                </div>
                {trend && (
                    <span className={`text-xs font-bold ${trend > 0 ? (status === 'critical' ? 'text-red-400' : 'text-cyan-400') : 'text-green-400'}`}>
                        {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
                    </span>
                )}
            </div>

            <div className="flex items-baseline gap-1 relative z-10">
                <span className={`text-2xl font-black tracking-tighter ${status === 'critical' ? 'text-red-400' : 'text-white'}`}>
                    {value}
                </span>
                <span className="text-gray-500 text-sm font-semibold">{unit}</span>
            </div>
        </motion.div>
    );
}
