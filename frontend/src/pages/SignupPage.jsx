import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Cpu, ShieldPlus } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';

export default function SignupPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Viewer');
    const navigate = useNavigate();
    const { register } = React.useContext(AuthContext);

    const handleReq = async (e) => {
        e.preventDefault();
        try {
            await register(name, email, password, role);
            toast.success('Clearance granted. Welcome to CreaBuild AI.');
            navigate('/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed.');
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
                    <div className="w-16 h-16 rounded-2xl bg-indigo-900/30 border border-indigo-500/50 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.3)] mb-4 neon-pulse-border">
                        <ShieldPlus className="w-8 h-8 text-indigo-400" />
                    </div>
                    <h2 className="text-3xl font-black text-white uppercase tracking-wider">Request Clearance</h2>
                </div>

                <form onSubmit={handleReq} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Full Designation</label>
                        <input required value={name} onChange={e => setName(e.target.value)} type="text" className="w-full bg-gray-900/50 border border-white/10 p-2.5 rounded-xl focus:outline-none focus:border-indigo-500 text-white font-mono" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Verification ID (Email)</label>
                        <input required value={email} onChange={e => setEmail(e.target.value)} type="email" className="w-full bg-gray-900/50 border border-white/10 p-2.5 rounded-xl focus:outline-none focus:border-indigo-500 text-white font-mono" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Security Passkey</label>
                        <input required minLength={6} value={password} onChange={e => setPassword(e.target.value)} type="password" className="w-full bg-gray-900/50 border border-white/10 p-2.5 rounded-xl focus:outline-none focus:border-indigo-500 text-white font-mono" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Requested Role</label>
                        <select value={role} onChange={e => setRole(e.target.value)} className="w-full bg-gray-900/50 border border-white/10 p-2.5 rounded-xl focus:outline-none focus:border-indigo-500 text-white font-mono appearance-none">
                            <option value="Engineer">Engineer</option>
                            <option value="Viewer">Viewer</option>
                        </select>
                    </div>

                    <button type="submit" className="w-full mt-6 py-4 bg-indigo-500 hover:bg-indigo-400 text-white font-bold tracking-widest uppercase rounded-xl hover:scale-[1.02] shadow-[0_0_15px_rgba(99,102,241,0.4)] transition-all">
                        SUBMIT
                    </button>
                </form>

                <p className="text-center text-gray-500 text-sm mt-6 font-medium">
                    Already registered? <Link to="/login" className="text-indigo-400 hover:text-indigo-300 ml-1">login</Link>
                </p>
            </motion.div>
        </div>
    );
}
