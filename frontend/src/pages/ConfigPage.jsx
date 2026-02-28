import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Zap, LayoutGrid, DollarSign, Activity, Box } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Header from '../components/Header';

export default function ConfigPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        budget: '',
        landSize: '',
        materialType: 'Concrete',
        customMaterial: '',
        loadRequirements: 'Medium'
    });

    const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.budget || !formData.landSize) {
            toast.error('Please complete all required fields.');
            return;
        }

        if (formData.materialType === 'Other' && !formData.customMaterial.trim()) {
            toast.error('Please specify the custom material.');
            return;
        }

        // Save constraints to show on the dashboard later
        localStorage.setItem('configData', JSON.stringify({
            budget: formData.budget,
            landSize: formData.landSize,
            materialType: formData.materialType === 'Other' ? formData.customMaterial : formData.materialType,
            loadRequirements: formData.loadRequirements
        }));

        setLoading(true);
        toast('Initializing Generative Models...', { icon: '⚙️' });
        navigate('/analysis');
    };

    return (
        <div className="min-h-screen bg-gray-950 flex flex-col items-center relative overflow-hidden">
            <div className="w-full z-20 sticky top-0">
                <Header status="active" />
            </div>

            {/* Background Grid & Glow */}
            <div className="absolute inset-0 z-0 bg-grid-pattern w-full h-full pointer-events-none"></div>
            <div className="absolute top-1/4 left-1/4 w-[40rem] h-[40rem] bg-cyan-900/20 rounded-full blur-[120px] pointer-events-none animate-pulse-slow"></div>
            <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-indigo-900/20 rounded-full blur-[100px] pointer-events-none animate-pulse-slow"></div>

            <AnimatePresence>
                <div className="flex-1 w-full flex items-center justify-center p-6 mt-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: -20 }}
                        transition={{ duration: 0.6, type: "spring" }}
                        className="w-full max-w-2xl glassmorphism rounded-[2rem] p-10 z-10 border border-white/10 relative overflow-hidden shadow-2xl"
                    >
                        {/* Overlay Loading State */}
                        <AnimatePresence>
                            {loading && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 bg-gray-950/90 backdrop-blur-md z-50 flex flex-col items-center justify-center text-cyan-400 font-bold text-xl rounded-[2rem]"
                                >
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-cyan-500 blur-2xl opacity-20 rounded-full"></div>
                                        <Loader2 className="w-16 h-16 mb-6 animate-spin text-cyan-400 relative z-10" />
                                    </div>
                                    <span className="animate-pulse tracking-widest uppercase">AI Generating Structural Layouts...</span>
                                    <div className="w-48 h-1 bg-gray-800 mt-6 rounded-full overflow-hidden">
                                        <div className="h-full bg-cyan-400 animate-[pulse_1s_ease-in-out_infinite] w-full" style={{ transformOrigin: 'left', animation: 'scaleX 2s infinite' }}></div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="mb-10 text-center relative">
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-32 h-32 bg-cyan-500/20 blur-3xl rounded-full"></div>
                            <h2 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-100 to-gray-400 drop-shadow-lg tracking-tight">
                                A.I. PROJECT CONFIG
                            </h2>
                            <p className="text-indigo-200 mt-3 text-sm font-medium tracking-wide">
                                <span className="uppercase block font-bold mb-1">Define Construction Constraints</span>
                                To allow the Generative Engine to formulate the best blueprints, please specify your exact budget, available land size, preferred base material, and expected load requirements below.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3 group">
                                    <label className="flex items-center gap-2 text-sm text-gray-300 font-bold uppercase tracking-wider">
                                        <DollarSign className="w-4 h-4 text-cyan-400" /> Estimated Budget
                                    </label>
                                    <input
                                        required
                                        type="number"
                                        name="budget"
                                        value={formData.budget}
                                        onChange={handleChange}
                                        placeholder="e.g. 5000000 (USD)"
                                        className="w-full bg-gray-950/50 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all placeholder:text-gray-600 font-mono text-lg shadow-inner"
                                    />
                                    <p className="text-xs text-gray-500 font-medium">Total allowed budget for physical materials.</p>
                                </div>

                                <div className="space-y-3 group">
                                    <label className="flex items-center gap-2 text-sm text-gray-300 font-bold uppercase tracking-wider">
                                        <LayoutGrid className="w-4 h-4 text-cyan-400" /> Land Area (sq ft)
                                    </label>
                                    <input
                                        required
                                        type="number"
                                        name="landSize"
                                        value={formData.landSize}
                                        onChange={handleChange}
                                        placeholder="e.g. 150000 (Total Plot Size)"
                                        className="w-full bg-gray-950/50 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all placeholder:text-gray-600 font-mono text-lg shadow-inner"
                                    />
                                    <p className="text-xs text-gray-500 font-medium">Limits the bounds of the generated footprint.</p>
                                </div>

                                <div className="space-y-3 group">
                                    <label className="flex items-center gap-2 text-sm text-gray-300 font-bold uppercase tracking-wider">
                                        <Box className="w-4 h-4 text-cyan-400" /> Material Type
                                    </label>
                                    <div className="relative">
                                        <select
                                            name="materialType"
                                            value={formData.materialType}
                                            onChange={handleChange}
                                            className="w-full bg-gray-950/50 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all appearance-none font-medium shadow-inner"
                                        >
                                            <option value="Concrete" className="bg-gray-900">Reinforced Concrete</option>
                                            <option value="Steel" className="bg-gray-900">Structural Steel</option>
                                            <option value="Hybrid" className="bg-gray-900">Hybrid (Concrete + Steel)</option>
                                            <option value="Timber" className="bg-gray-900">Mass Timber (Eco)</option>
                                            <option value="Other" className="bg-gray-900">Other (Specify)</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">▼</div>
                                    </div>

                                    {formData.materialType === 'Other' && (
                                        <input
                                            required
                                            type="text"
                                            name="customMaterial"
                                            value={formData.customMaterial}
                                            onChange={handleChange}
                                            placeholder="Enter material type..."
                                            className="w-full bg-gray-950/50 border border-cyan-500/50 rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all placeholder:text-gray-600 shadow-inner mt-2"
                                        />
                                    )}
                                </div>

                                <div className="space-y-3 group">
                                    <label className="flex items-center gap-2 text-sm text-gray-300 font-bold uppercase tracking-wider">
                                        <Activity className="w-4 h-4 text-cyan-400" /> Load Req.
                                    </label>
                                    <div className="relative">
                                        <select
                                            name="loadRequirements"
                                            value={formData.loadRequirements}
                                            onChange={handleChange}
                                            className="w-full bg-gray-950/50 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all appearance-none font-medium shadow-inner"
                                        >
                                            <option value="Low" className="bg-gray-900">Low (Residential)</option>
                                            <option value="Medium" className="bg-gray-900">Medium (Commercial/Retail)</option>
                                            <option value="High" className="bg-gray-900">High (Industrial/Heavy)</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">▼</div>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="mt-8 w-full py-5 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white font-extrabold text-xl tracking-widest uppercase transition-all transform hover:-translate-y-1 neon-pulse-border relative overflow-hidden group border border-cyan-400/50"
                            >
                                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                                <span className="relative z-10 flex flex-row items-center justify-center gap-3 drop-shadow-md">
                                    <Zap fill="currentColor" className="w-6 h-6" /> RUN GENERATIVE ENGINEERING
                                </span>
                            </button>
                        </form>
                    </motion.div>
                </div>
            </AnimatePresence>
        </div>
    );
}
