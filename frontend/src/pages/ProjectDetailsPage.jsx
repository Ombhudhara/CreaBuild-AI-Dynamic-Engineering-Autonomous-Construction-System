import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import { ChevronLeft } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

export default function ProjectDetailsPage() {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(true);
    const { role, user } = useContext(AuthContext);
    const navigate = useNavigate();

    const currentRole = role ? role.toLowerCase() : 'viewer';

    useEffect(() => {
        const fetchProject = async () => {
            try {
                // For simplicity, we fetch all projects and find the one. 
                // Alternatively, an endpoint GET /projects/:id could be created.
                const res = await api.get('/projects');
                const p = res.data.find(proj => proj._id === id);
                if (p) {
                    setProject(p);
                    setName(p.name);
                    setDescription(p.description);
                } else {
                    toast.error('Project not found');
                    navigate('/projects');
                }
                setLoading(false);
            } catch (error) {
                toast.error('Failed to load project details');
                setLoading(false);
            }
        };
        fetchProject();
    }, [id, navigate]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/projects/${id}`, { name, description });
            toast.success('Project updated successfully');
            navigate('/projects');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update project');
        }
    };

    if (loading) return <div className="p-8 text-white mt-20 text-center">Loading...</div>;
    if (!project) return null;

    const isOwner = currentRole === 'engineer' && project.createdBy?.name === user?.name;
    const canEdit = currentRole === 'admin' || isOwner;

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
                    <div className="w-full max-w-3xl bg-gray-900 border border-white/10 p-8 rounded-3xl relative shadow-[0_0_50px_rgba(6,182,212,0.1)]">
                        <button onClick={() => navigate('/projects')} className="mb-6 flex items-center gap-2 text-cyan-400 font-bold uppercase tracking-widest text-sm hover:text-cyan-300">
                            <ChevronLeft className="w-4 h-4" /> Back to Projects
                        </button>

                        <h1 className="text-3xl font-black uppercase tracking-tight mb-8">Project <span className="text-cyan-400">Details</span></h1>

                        {!canEdit && (
                            <div className="mb-8 p-4 bg-purple-950/50 border border-purple-500/50 rounded-xl">
                                <p className="text-purple-400 font-bold">Read-Only Mode</p>
                                <p className="text-gray-300 text-sm mt-1">You do not have permission to edit this project. Displaying information in read-only format.</p>
                            </div>
                        )}

                        <form onSubmit={handleUpdate} className="space-y-6">
                            <div>
                                <label className="block text-gray-400 font-bold uppercase tracking-widest text-sm mb-2">Project Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    disabled={!canEdit}
                                    className={`w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500 transition-colors ${!canEdit ? 'opacity-50 cursor-not-allowed' : ''}`}
                                />
                            </div>
                            <div>
                                <label className="block text-gray-400 font-bold uppercase tracking-widest text-sm mb-2">Description</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    disabled={!canEdit}
                                    rows="4"
                                    className={`w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500 transition-colors resize-none ${!canEdit ? 'opacity-50 cursor-not-allowed' : ''}`}
                                />
                            </div>

                            <div className="pt-4 border-t border-white/10">
                                <p className="text-gray-400 mb-2">Created By: <span className="text-white font-bold">{project.createdBy?.name || 'Missing'}</span></p>
                                <p className="text-gray-400">Current Status: <span className="text-white font-bold">{project.status}</span></p>
                            </div>

                            {canEdit && (
                                <button
                                    type="submit"
                                    className="w-full py-4 rounded-xl font-bold tracking-widest uppercase flex justify-center items-center gap-2 transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] bg-cyan-600 hover:bg-cyan-500 hover:scale-[1.02]"
                                >
                                    Save Changes
                                </button>
                            )}
                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
}
