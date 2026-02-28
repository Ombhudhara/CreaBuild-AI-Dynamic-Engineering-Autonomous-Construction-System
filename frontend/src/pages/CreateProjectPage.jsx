import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import { CheckCircle2, ChevronLeft } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

export default function CreateProjectPage() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [isBlocked, setIsBlocked] = useState(false);
    const { role } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const checkLimit = async () => {
            if (role?.toLowerCase() === 'engineer') {
                try {
                    const res = await api.get('/projects');
                    if (res.data.length >= 5) {
                        setIsBlocked(true);
                        toast.error('Engineer limit: You have already created 5 projects.');
                    }
                } catch (error) {
                    console.error("Error checking limits", error);
                }
            }
        };
        checkLimit();
    }, [role]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isBlocked) {
            toast.error('Engineer limit: Maximum 5 projects allowed.');
            return;
        }

        if (!name) {
            toast.error('Project Name is required');
            return;
        }

        setLoading(true);
        try {
            await api.post('/projects', { name, description });
            toast.success('Project created successfully');
            navigate('/projects');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create project');
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen bg-gray-950 overflow-hidden text-white font-sans antialiased relative">
            {/* Absolute Background Effects */}
            <div className="absolute inset-0 z-0 bg-grid-pattern opacity-30 pointer-events-none"></div>

            {/* Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 z-10">
                <Header status="active" />

                <main className="flex-1 p-6 overflow-y-auto custom-scrollbar flex items-center justify-center">
                    <div className="w-full max-w-2xl bg-gray-900 border border-white/10 p-8 rounded-3xl relative shadow-[0_0_50px_rgba(6,182,212,0.1)]">

                        <button onClick={() => navigate('/projects')} className="mb-6 flex items-center gap-2 text-cyan-400 font-bold uppercase tracking-widest text-sm hover:text-cyan-300">
                            <ChevronLeft className="w-4 h-4" /> Back to Projects
                        </button>

                        <h1 className="text-3xl font-black uppercase tracking-tight mb-8">Create New <span className="text-cyan-400">Project</span></h1>

                        {isBlocked && (
                            <div className="mb-8 p-4 bg-red-950/50 border border-red-500/50 rounded-xl">
                                <p className="text-red-400 font-bold">⚠️ Warning: Project Limit Reached</p>
                                <p className="text-gray-300 text-sm mt-1">As an Engineer, you are limited to creating a maximum of 5 projects. Please delete an existing project or contact an Administrator.</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-gray-400 font-bold uppercase tracking-widest text-sm mb-2">Project Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    disabled={isBlocked || loading}
                                    className={`w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500 transition-colors ${isBlocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    placeholder="e.g. Apex Highrise A1"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-400 font-bold uppercase tracking-widest text-sm mb-2">Description</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    disabled={isBlocked || loading}
                                    rows="4"
                                    className={`w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500 transition-colors resize-none ${isBlocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    placeholder="Project scope and details..."
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isBlocked || loading}
                                className={`w-full py-4 rounded-xl font-bold tracking-widest uppercase flex justify-center items-center gap-2 transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)]
                            ${isBlocked ? 'bg-gray-600 cursor-not-allowed' : 'bg-cyan-600 hover:bg-cyan-500 hover:scale-[1.02]'}`}
                            >
                                {loading ? 'Processing...' : (
                                    <><CheckCircle2 className="w-5 h-5" /> Initialize Project</>
                                )}
                            </button>
                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
}
