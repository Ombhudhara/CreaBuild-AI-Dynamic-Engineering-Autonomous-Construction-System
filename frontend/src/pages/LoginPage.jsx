import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/auth';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Cpu, Lock, Mail, ArrowRight } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSub = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            toast.success('Authentication Successful.');
            navigate('/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Invalid credentials.');
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center bg-gray-950 p-6">
            <div className="absolute inset-0 z-0 bg-grid-pattern opacity-40"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md glassmorphism p-8 rounded-3xl relative z-10"
            >
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-cyan-900/30 border border-cyan-500/50 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.3)] mb-4 neon-pulse-border">
                        <Cpu className="w-8 h-8 text-cyan-400" />
                    </div>
                    <h2 className="text-3xl font-black text-white uppercase tracking-wider">Access System</h2>
                    <p className="text-gray-400 text-sm font-medium mt-2 text-center">
                        Demo Credentials:<br />
                        admin@creabuild.ai / admin<br />
                        engineer@creabuild.ai / engineer<br />
                        viewer@creabuild.ai / viewer
                    </p>
                </div>

                <form onSubmit={handleSub} className="space-y-6">
                    <div className="space-y-2 group">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            <Mail className="w-4 h-4 text-cyan-500" /> Identity verification ID (Email)
                        </label>
                        <input
                            required
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-gray-900/50 border border-white/10 p-3 rounded-xl focus:outline-none focus:border-cyan-500 text-white font-mono transition-colors"
                        />
                    </div>

                    <div className="space-y-2 group">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            <Lock className="w-4 h-4 text-cyan-500" /> Security Passkey (Password)
                        </label>
                        <input
                            required
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-gray-900/50 border border-white/10 p-3 rounded-xl focus:outline-none focus:border-cyan-500 text-white font-mono transition-colors"
                        />
                    </div>

                    <button type="submit" className="w-full py-4 bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-bold tracking-widest uppercase rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all flex items-center justify-center gap-2 hover:scale-[1.02]">
                        AUTHORIZE ACCESS <ArrowRight className="w-5 h-5" />
                    </button>
                </form>

                <p className="text-center text-gray-500 text-sm mt-6 font-medium">
                    No clearance? <Link to="/signup" className="text-cyan-400 hover:text-cyan-300 ml-1">Request Access</Link>
                </p>
            </motion.div>
        </div>
    );
}
