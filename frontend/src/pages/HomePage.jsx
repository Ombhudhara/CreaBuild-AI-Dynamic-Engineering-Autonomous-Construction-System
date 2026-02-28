import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Cpu, Box, Activity, Layers, ArrowRight, ShieldAlert, TrendingDown, Users } from 'lucide-react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement, ArcElement
} from 'chart.js';

ChartJS.register(
    CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend
);

export default function HomePage() {
    const navigate = useNavigate();

    // --- CHART OPTIONS & DATA ---
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { labels: { color: '#9ca3af', font: { family: 'mono', size: 10 } } }
        },
        scales: {
            x: { ticks: { color: '#6b7280', font: { size: 10 } }, grid: { color: 'rgba(255,255,255,0.05)' } },
            y: { ticks: { color: '#6b7280', font: { size: 10 } }, grid: { color: 'rgba(255,255,255,0.05)' } }
        }
    };

    const optimizationData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
            label: 'Structural Optimization Score',
            data: [65, 78, 82, 91, 95, 98],
            borderColor: '#06b6d4',
            backgroundColor: 'rgba(6,182,212,0.2)',
            tension: 0.4,
            fill: true
        }]
    };

    const costData = {
        labels: ['Foundation', 'Framing', 'Exterior', 'Interior', 'MEP'],
        datasets: [
            { label: 'Traditional Build Cost', data: [500, 800, 600, 700, 400], backgroundColor: '#374151' },
            { label: 'AI Optimized Cost', data: [350, 600, 480, 580, 290], backgroundColor: '#06b6d4' }
        ]
    };

    const activeUserData = {
        labels: ['Admin', 'Engineers', 'Viewers'],
        datasets: [{
            data: [15, 60, 25],
            backgroundColor: ['#ef4444', '#8b5cf6', '#06b6d4'],
            borderWidth: 0
        }]
    };

    return (
        <div className="min-h-screen bg-gray-950 font-sans text-white overflow-hidden pt-20">
            {/* GLOBAL BG */}
            <div className="fixed inset-0 z-0 bg-grid-pattern opacity-30 pointer-events-none"></div>

            {/* 1. HERO SECTION */}
            <section className="relative z-10 w-full min-h-[90vh] flex flex-col items-center justify-center p-6 text-center">
                <div className="absolute top-0 right-1/4 w-[40rem] h-[40rem] bg-cyan-900/20 rounded-full blur-[120px] pointer-events-none animate-pulse-slow"></div>
                <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                    <div className="inline-flex items-center gap-2 glassmorphism px-5 py-2 rounded-full mb-8 border-cyan-500/30 text-cyan-300 text-sm font-semibold tracking-wide shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
                        </span>
                        SYSTEM ONLINE // CREABUILD AI
                    </div>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-6 drop-shadow-2xl">
                        DYNAMIC <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">ENGINEERING</span>
                    </h1>
                    <h2 className="text-3xl md:text-5xl font-bold mb-8 text-gray-300">
                        & AUTONOMOUS CONSTRUCTION
                    </h2>
                    <p className="text-xl md:text-2xl text-gray-400 mb-12 font-medium max-w-3xl mx-auto tracking-wide">
                        <span className="text-white">Design.</span> Predict. Adapt. <span className="text-cyan-400 neon-cyan font-bold">Build Smarter.</span>
                    </p>

                    <div className="flex items-center justify-center gap-6">
                        <button onClick={() => navigate('/signup')} className="group relative inline-flex items-center justify-center px-10 py-5 font-bold text-white bg-cyan-600 rounded-full overflow-hidden transition-all shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:shadow-[0_0_40px_rgba(6,182,212,0.6)] hover:scale-105 border border-cyan-400">
                            <span className="absolute inset-0 w-full h-full bg-cyan-500 group-hover:scale-x-150 origin-left transition-transform duration-500 ease-out"></span>
                            <span className="relative z-10 text-xl tracking-wider flex items-center gap-3">GET STARTED <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" /></span>
                        </button>
                        <button onClick={() => navigate('/login')} className="px-10 py-5 font-bold tracking-widest uppercase rounded-full glassmorphism hover:bg-white/5 transition-colors border border-white/20 hover:border-white/50">
                            LOGIN
                        </button>
                    </div>
                </motion.div>
            </section>

            {/* 2. ABOUT SECTION */}
            <section className="relative z-10 py-24 px-6 max-w-7xl mx-auto">
                <div className="glassmorphism p-12 rounded-[3rem] border-blue-500/20 shadow-2xl relative overflow-hidden bg-gray-950/80">
                    <div className="absolute -top-32 -right-32 w-64 h-64 bg-blue-900/30 rounded-full blur-[80px]"></div>
                    <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-6">Why <span className="text-blue-400">CreaBuild</span>?</h3>
                    <p className="text-gray-400 text-lg leading-relaxed mb-6">
                        Traditional construction relies on static blueprints, disjointed teams, and retroactive problem-solving. It's plagued by budget overruns, dangerous structural failures, and massive material waste.
                    </p>
                    <p className="text-gray-300 text-xl font-medium leading-relaxed">
                        CreaBuild AI replaces guesswork with <strong className="text-white neon-cyan">mathematical certainty</strong>. We merge AI Generative Layouts with a Live Digital Twin, analyzing stress, temperature, and anomalies in real-time, autonomously adapting the blueprint before a single brick crumbles.
                    </p>
                </div>
            </section>

            {/* 3. HOW IT WORKS */}
            <section className="relative z-10 py-24 px-6 bg-gradient-to-b from-transparent via-gray-900/50 to-transparent">
                <h3 className="text-center text-4xl font-black uppercase tracking-widest mb-16 neon-cyan">Operation Workflow</h3>
                <div className="max-w-6xl mx-auto flex gap-6 overflow-x-auto custom-scrollbar pb-8 snap-x">
                    {[
                        { s: "STEP 1", t: "Specify Constraints", d: "Input budget, soil density, and material reqs.", i: <Box className="w-6 h-6" /> },
                        { s: "STEP 2", t: "AI Generation", d: "Algorithm creates multi-variate iterations.", i: <Cpu className="w-6 h-6" /> },
                        { s: "STEP 3", t: "Predictive Sims", d: "Stress testing against seismic/wind data.", i: <ShieldAlert className="w-6 h-6" /> },
                        { s: "STEP 4", t: "Live Tracking", d: "Sensors map to the 3D Digital Twin.", i: <Layers className="w-6 h-6" /> },
                        { s: "STEP 5", t: "Recalibration", d: "System autonomously repairs risks on the fly.", i: <Activity className="w-6 h-6" /> },
                    ].map((step, idx) => (
                        <div key={idx} className="min-w-[300px] snap-center glassmorphism p-8 rounded-3xl border-cyan-500/20 bg-gray-950/90 flex flex-col items-start gap-4 hover:scale-105 transition-transform">
                            <div className="p-3 bg-cyan-900/30 text-cyan-400 rounded-xl border border-cyan-500/30">{step.i}</div>
                            <h4 className="text-cyan-400 font-black tracking-widest text-sm">{step.s}</h4>
                            <h5 className="text-xl font-bold text-white">{step.t}</h5>
                            <p className="text-gray-400 leading-relaxed text-sm">{step.d}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* 4. ANALYTICS GRAPHS (Chart.js) */}
            <section className="relative z-10 py-24 px-6 max-w-7xl mx-auto">
                <h3 className="text-center text-4xl font-black uppercase tracking-widest mb-16 text-white drop-shadow-md">Enterprise Analytics Matrix</h3>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="col-span-1 lg:col-span-2 glassmorphism p-6 rounded-[2rem] border-white/10 h-[400px]">
                        <h4 className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-4">Structural Optimization Trajectory</h4>
                        <Line data={optimizationData} options={chartOptions} />
                    </div>

                    <div className="col-span-1 glassmorphism p-6 rounded-[2rem] border-white/10 h-[400px]">
                        <h4 className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-4">Live Roles Distribution</h4>
                        <div className="w-full h-full pb-8 flex items-center justify-center">
                            <Doughnut data={activeUserData} options={{ maintainAspectRatio: false }} />
                        </div>
                    </div>

                    <div className="col-span-1 lg:col-span-3 glassmorphism p-6 rounded-[2rem] border-white/10 h-[450px]">
                        <h4 className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-4">Cost Reduction Comparison</h4>
                        <Bar data={costData} options={{ ...chartOptions, scales: { y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' } } } }} />
                    </div>
                </div>
            </section>

            {/* 5. FEATURES */}
            <section className="relative z-10 py-24 px-6 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[
                        { title: "Generative Design", desc: "AI layout generation optimized for cost & strength.", icon: <Box className="w-8 h-8 text-white" /> },
                        { title: "Predictive Sim", desc: "Environmental & load stress simulations.", icon: <Activity className="w-8 h-8 text-white" /> },
                        { title: "Digital Twin", desc: "Real-time 3D monitoring of live sensor data.", icon: <Layers className="w-8 h-8 text-white" /> },
                        { title: "Adaptive AI", desc: "Autonomous mitigation to correct structure deviations.", icon: <Cpu className="w-8 h-8 text-white" /> }
                    ].map((f, i) => (
                        <motion.div
                            whileHover={{ opacity: 0.2, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                            key={i}
                            className="group glassmorphism p-8 rounded-3xl border-transparent hover:border-cyan-500/50 cursor-pointer"
                        >
                            <div className="p-4 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl w-fit mb-6 shadow-[0_0_15px_rgba(6,182,212,0.4)]">{f.icon}</div>
                            <h3 className="text-xl font-bold mb-3 text-white group-hover:text-cyan-300 transition-colors">{f.title}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* 6. FOOTER */}
            <footer className="relative z-10 glassmorphism border-t border-white/10 py-12 text-center mt-24 bg-gray-950/90">
                <div className="inline-flex items-center justify-center gap-2 mb-4">
                    <Cpu className="w-5 h-5 text-cyan-400" /> <span className="font-bold tracking-widest text-lg">CREABUILD AI</span>
                </div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-widest">© 2026 Developed for the Global Hackathon. All systems operational.</p>
            </footer>
        </div>
    );
}
