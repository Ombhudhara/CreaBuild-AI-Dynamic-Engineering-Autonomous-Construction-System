import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from 'recharts';
import { CheckCircle2, MoveRight, Medal, ShieldAlert, Cpu } from 'lucide-react';
import { toast } from 'react-hot-toast';

const data = [
    { subject: 'Structural Strength', A: 75, B: 85, AI: 98, fullMark: 100 },
    { subject: 'Cost Efficiency', A: 90, B: 65, AI: 95, fullMark: 100 },
    { subject: 'Build Speed', A: 85, B: 70, AI: 90, fullMark: 100 },
    { subject: 'Sustainability', A: 60, B: 90, AI: 85, fullMark: 100 },
    { subject: 'Safety Factor', A: 70, B: 80, AI: 99, fullMark: 100 },
];

const designs = [
    { id: 'A', name: 'Standard Layout A', color: '#6b7280', ai: false, metric: 'Balanced approach.' },
    { id: 'B', name: 'Reinforced Structure B', color: '#8b5cf6', ai: false, metric: 'High strength, high cost.' },
    { id: 'AI', name: 'CreaBuild AI Apex', color: '#06b6d4', ai: true, metric: 'Optimal performance matrix.' },
];

export default function AnalysisPage() {
    const navigate = useNavigate();
    const [activeDesign, setActiveDesign] = useState('AI');

    const handleDeploy = () => {
        toast.success('AI Optimized Design Selected. Deploying to Digital Twin...', { duration: 3000 });
        setTimeout(() => navigate('/dashboard'), 1500);
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
    };

    return (
        <div className="min-h-screen bg-gray-950 p-6 flex flex-col items-center">
            {/* Background styling */}
            <div className="fixed inset-0 pointer-events-none bg-grid-pattern opacity-50"></div>
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-2/3 h-1/2 bg-cyan-900/10 blur-[150px] rounded-full"></div>
                <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-purple-900/10 blur-[120px] rounded-full"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-7xl pt-8 pb-12 text-center relative z-10"
            >
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/30 text-cyan-400 text-xs font-bold tracking-widest uppercase mb-4 shadow-[0_0_10px_rgba(6,182,212,0.2)] bg-cyan-950/30">
                    <Cpu className="w-4 h-4" /> ANALYSIS COMPLETE
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-white mb-4 drop-shadow-lg tracking-tight">
                    AI Design Matrix Ranking
                </h1>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto font-medium">3 permutations generated based on input constraints. CreaBuild AI recommends the optimal convergence of structural integrity and cost.</p>
            </motion.div>

            <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">

                {/* Radar Chart (Center on Desktop) */}
                <motion.div className="lg:col-span-3 xl:col-span-1 xl:order-2 h-[450px] glassmorphism rounded-3xl p-6 relative border-cyan-500/20 shadow-2xl flex flex-col items-center justify-center bg-gray-950/60"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.5, type: 'spring' }}
                >
                    <div className="absolute top-4 left-4 text-xs font-bold text-gray-500 tracking-widest uppercase flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4 text-cyan-500/50" /> Performance Web
                    </div>

                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
                            <PolarGrid stroke="#374151" strokeDasharray="3 3" />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 11, fontWeight: 600 }} />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />

                            <Radar name="Layout A" dataKey="A" stroke="#6b7280" fill="#6b7280" fillOpacity={0.1} />
                            <Radar name="Structure B" dataKey="B" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.15} />

                            {/* GAMING STYLE AI GLOW RADAR */}
                            <Radar
                                name="AI Apex"
                                dataKey="AI"
                                stroke="#06b6d4"
                                strokeWidth={3}
                                fill="url(#neonCyanGradient)"
                                fillOpacity={0.4}
                                className="recharts-radar-polygon ai-optimized"
                            />
                            <defs>
                                <linearGradient id="neonCyanGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                        </RadarChart>
                    </ResponsiveContainer>
                </motion.div>

                {/* Design Cards (Left & Right) */}
                <motion.div
                    className="lg:col-span-3 xl:col-span-2 xl:order-1 grid grid-cols-1 md:grid-cols-3 gap-6"
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                >
                    {designs.map((design) => (
                        <motion.div
                            key={design.id}
                            variants={itemVariants}
                            onClick={() => setActiveDesign(design.id)}
                            className={`cursor-pointer glassmorphism p-6 rounded-3xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between h-[300px] xl:h-auto ${activeDesign === design.id
                                ? design.ai
                                    ? 'border-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.3)] bg-gray-900/80 scale-105 z-20'
                                    : 'border-white/40 shadow-xl bg-gray-900/60 scale-105 z-20'
                                : 'border-white/5 bg-gray-950/40 hover:bg-gray-900/40 scale-95 opacity-70 hover:opacity-100'
                                }`}
                        >
                            {design.ai && (
                                <div className="absolute top-0 right-0 right-0 bg-gradient-to-l from-cyan-600 to-blue-600 text-white text-[10px] font-bold px-4 py-1.5 rounded-bl-xl tracking-widest uppercase flex items-center gap-1 neon-cyan">
                                    <Medal className="w-3 h-3" /> AI OPTIMIZED
                                </div>
                            )}

                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className={`w-4 h-4 rounded-full ${activeDesign === design.id ? (design.ai ? 'bg-cyan-400 animate-pulse shadow-[0_0_10px_#06b6d4]' : 'bg-white') : 'bg-gray-600'}`}></div>
                                    <h3 className={`text-xl font-bold ${activeDesign === design.id && design.ai ? 'text-cyan-400 font-extrabold' : 'text-gray-100'}`}>
                                        {design.name}
                                    </h3>
                                </div>

                                <p className="text-gray-400 text-sm mb-6 pb-6 border-b border-white/10 uppercase tracking-widest font-semibold">
                                    {design.metric}
                                </p>

                                <div className="space-y-3">
                                    {data.map((stat, i) => (
                                        <div key={i} className="flex justify-between items-center text-xs font-medium">
                                            <span className="text-gray-500 uppercase">{stat.subject}</span>
                                            <span className={`font-mono font-bold ${activeDesign === design.id && design.ai ? 'text-cyan-300' : 'text-gray-300'}`}>
                                                {stat[design.id]} / 100
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {activeDesign === design.id && (
                                <div className="absolute bottom-4 right-4 animate-bounce">
                                    <CheckCircle2 className={`w-8 h-8 ${design.ai ? 'text-cyan-400' : 'text-white/50'}`} />
                                </div>
                            )}
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="mt-12 w-full max-w-7xl flex flex-col md:flex-row items-center justify-between glassmorphism p-6 rounded-3xl border-cyan-500/30 bg-gray-900/50 shadow-[0_0_30px_rgba(6,182,212,0.1)] relative z-10"
            >
                <div className="mb-4 md:mb-0 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-cyan-950 flex items-center justify-center border border-cyan-500/50 neon-pulse-border">
                        <Cpu className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div>
                        <h4 className="text-white font-bold tracking-widest uppercase">Select Design to Execute</h4>
                        <p className="text-cyan-400/80 text-sm font-medium">Digital Twin environment ready.</p>
                    </div>
                </div>

                <button
                    onClick={handleDeploy}
                    className="group relative inline-flex items-center justify-center px-8 py-4 font-black text-gray-950 bg-cyan-400 rounded-xl overflow-hidden transition-all hover:scale-[1.02] active:scale-95 shadow-[0_0_20px_rgba(6,182,212,0.6)] w-full md:w-auto hover:bg-cyan-300"
                >
                    <span className="relative z-10 text-lg uppercase tracking-widest flex items-center gap-2">
                        DEPLOY DIGITAL TWIN <MoveRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                    </span>
                </button>
            </motion.div>
        </div>
    );
}
