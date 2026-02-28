import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Cpu, Box, Activity, Layers, ArrowRight } from 'lucide-react';

const features = [
    {
        title: "Generative Design",
        description: "AI-driven structural layout generation optimized for cost and efficiency.",
        icon: <Box className="w-8 h-8 text-cyan-400" />
    },
    {
        title: "Predictive Simulation",
        description: "Advanced environmental & load stress simulations to ensure structural integrity.",
        icon: <Activity className="w-8 h-8 text-blue-400" />
    },
    {
        title: "Digital Twin",
        description: "Real-time 3D monitoring of live sensor data mapped directly to your model.",
        icon: <Layers className="w-8 h-8 text-cyan-300" />
    },
    {
        title: "Adaptive AI",
        description: "Autonomous mitigation strategies that adapt to anomalies instantaneously.",
        icon: <Cpu className="w-8 h-8 text-blue-300" />
    }
];

export default function LandingPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center p-6 bg-gray-950">
            {/* Animated Background */}
            <div className="absolute inset-0 z-0 opacity-40">
                <div className="absolute top-0 -left-1/4 w-[150%] h-[150%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-900/30 via-transparent to-transparent animate-pulse-slow"></div>
                <div className="absolute bottom-0 -right-1/4 w-[150%] h-[150%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent animate-pulse-slow" style={{ animationDelay: '1.5s' }}></div>
            </div>

            {/* Grid Pattern overlay */}
            <div className="absolute inset-0 z-0 bg-grid-pattern w-full h-full"></div>

            <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-center"
                >
                    <div className="inline-flex items-center gap-2 glassmorphism px-5 py-2 rounded-full mb-8 border-cyan-500/30 text-cyan-300 text-sm font-semibold tracking-wide shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
                        </span>
                        SYSTEM ONLINE // CREABUILD AI
                    </div>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-6 text-white drop-shadow-2xl">
                        DYNAMIC <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">ENGINEERING</span>
                    </h1>
                    <h2 className="text-3xl md:text-5xl font-bold mb-8 text-gray-300">
                        & AUTONOMOUS CONSTRUCTION
                    </h2>

                    <p className="text-xl md:text-2xl text-gray-400 mb-12 font-medium max-w-3xl mx-auto tracking-wide">
                        <span className="text-white">Design.</span> Predict. Adapt. <span className="text-cyan-400 neon-cyan">Build Smarter.</span>
                    </p>

                    <button
                        onClick={() => navigate('/config')}
                        className="group relative inline-flex items-center justify-center px-10 py-5 font-bold text-white bg-blue-600 rounded-full overflow-hidden transition-all hover:scale-105 shadow-[0_0_30px_rgba(37,99,235,0.4)] hover:shadow-[0_0_40px_rgba(6,182,212,0.6)]"
                    >
                        <span className="absolute inset-0 w-full h-full transition-all duration-500 ease-out bg-cyan-500 group-hover:scale-x-150 group-hover:bg-cyan-400 origin-left"></span>
                        <span className="relative z-10 text-xl tracking-wider flex items-center gap-3">
                            INITIALIZE PROJECT <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                        </span>
                    </button>
                </motion.div>

                {/* Feature Cards Grid */}
                <motion.div
                    className="mt-32 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: { opacity: 0 },
                        visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
                    }}
                >
                    {features.map((f, idx) => (
                        <motion.div
                            key={idx}
                            variants={{
                                hidden: { opacity: 0, y: 40 },
                                visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
                            }}
                            whileHover={{ y: -10, scale: 1.03 }}
                            className="glassmorphism p-8 rounded-3xl border-white/10 hover:border-cyan-500/50 transition-all duration-300 group shadow-2xl relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl group-hover:bg-cyan-500/20 transition-all"></div>

                            <div className="p-4 bg-white/5 rounded-2xl w-fit mb-6 border border-white/5 group-hover:border-cyan-500/30 transition-colors">
                                {f.icon}
                            </div>
                            <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-cyan-300 transition-colors">{f.title}</h3>
                            <p className="text-gray-400 text-base leading-relaxed">{f.description}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
