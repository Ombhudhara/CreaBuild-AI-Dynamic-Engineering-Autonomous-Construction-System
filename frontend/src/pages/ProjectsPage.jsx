import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { Plus, Edit, Trash2, Users, Check, X } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

export default function ProjectsPage() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewers, setViewers] = useState([]);
    const [assignModalData, setAssignModalData] = useState({ isOpen: false, projectId: null, selectedViewers: [] });

    const { role, user } = useContext(AuthContext);
    const navigate = useNavigate();

    const currentRole = role ? role.toLowerCase() : 'viewer';

    useEffect(() => {
        fetchProjects();
        if (currentRole !== 'viewer') {
            fetchViewers();
        }
    }, [currentRole]);

    const fetchProjects = async () => {
        try {
            const res = await api.get('/projects');
            setProjects(res.data);
            setLoading(false);
        } catch (error) {
            toast.error('Failed to load projects');
            setLoading(false);
        }
    };

    const fetchViewers = async () => {
        try {
            const res = await api.get('/users/viewers');
            setViewers(res.data);
        } catch (error) {
            console.error("Could not load viewers", error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this project?')) return;
        try {
            await api.delete(`/projects/${id}`);
            toast.success('Project deleted successfully');
            setProjects(projects.filter(p => p._id !== id));
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete project');
        }
    };

    const openAssignModal = (project) => {
        const existingViewers = project.assignedViewers ? project.assignedViewers.map(v => v._id) : [];
        setAssignModalData({
            isOpen: true,
            projectId: project._id,
            selectedViewers: existingViewers
        });
    };

    const submitAssignment = async () => {
        try {
            await api.put(`/projects/${assignModalData.projectId}/assign`, { viewerIds: assignModalData.selectedViewers });
            toast.success('Assignment request processed');
            setAssignModalData({ isOpen: false, projectId: null, selectedViewers: [] });
            fetchProjects();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to assign viewers');
        }
    };

    const handleApprovePending = async (projectId) => {
        try {
            await api.put(`/projects/${projectId}/approve`);
            toast.success('Pending viewers approved');
            fetchProjects();
        } catch (error) {
            toast.error('Failed to approve viewers');
        }
    };

    const handleRejectPending = async (projectId) => {
        try {
            await api.put(`/projects/${projectId}/reject`);
            toast.success('Pending request rejected');
            fetchProjects();
        } catch (error) {
            toast.error('Failed to reject viewers');
        }
    };

    const handleCreateProject = () => {
        if (currentRole === 'engineer' && projects.length >= 5) {
            toast.error('Engineers can create a maximum of 5 projects');
            return;
        }
        navigate('/projects/create');
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

                <main className="flex-1 p-6 overflow-y-auto custom-scrollbar">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-3xl font-black tracking-tight uppercase">Projects</h2>
                            {currentRole !== 'viewer' && (
                                <button
                                    onClick={handleCreateProject}
                                    disabled={currentRole === 'engineer' && projects.length >= 5}
                                    className={`flex items-center gap-2 px-6 py-3 font-bold rounded-lg transition-colors ${currentRole === 'engineer' && projects.length >= 5 ? 'bg-gray-600 cursor-not-allowed' : 'bg-cyan-600 hover:bg-cyan-500'}`}
                                >
                                    <Plus className="w-5 h-5" />
                                    <span>Create Project</span>
                                </button>
                            )}
                        </div>

                        {loading ? (
                            <p>Loading projects...</p>
                        ) : projects.length === 0 ? (
                            <p>No projects found.</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {projects.map(project => (
                                    <div key={project._id} className="glassmorphism p-6 rounded-2xl border border-white/10 relative">
                                        <h3 className="text-xl font-bold mb-2 text-cyan-400">{project.name}</h3>
                                        <p className="text-gray-400 mb-4">{project.description}</p>

                                        <div className="text-sm font-medium text-gray-500 mb-4">
                                            <p>Creator: {project.createdBy?.name || 'Unknown'}</p>
                                            <p>Status: {project.status}</p>
                                        </div>

                                        {project.assignedViewers && project.assignedViewers.length > 0 && (
                                            <div className="mb-4">
                                                <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Assigned Viewers:</p>
                                                <div className="flex flex-wrap gap-1">
                                                    {project.assignedViewers.map(v => (
                                                        <span key={v._id} className="text-xs px-2 py-0.5 rounded bg-sky-900/30 text-sky-400 border border-sky-500/20">{v.name}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {project.pendingViewers && project.pendingViewers.length > 0 && (
                                            <div className="mb-4 p-2 rounded bg-orange-950/30 border border-orange-500/30">
                                                <p className="text-xs font-bold uppercase tracking-widest text-orange-400 mb-1 flex items-center gap-1">
                                                    <Check className="w-3 h-3" /> Pending Approval:
                                                </p>
                                                <div className="flex flex-wrap gap-1">
                                                    {project.pendingViewers.map(v => (
                                                        <span key={v._id} className="text-xs px-2 py-0.5 rounded bg-orange-900/30 text-orange-300">{v.name}</span>
                                                    ))}
                                                </div>
                                                {currentRole === 'admin' && (
                                                    <div className="mt-3 flex gap-2">
                                                        <button
                                                            onClick={() => handleApprovePending(project._id)}
                                                            className="flex-1 text-xs font-bold bg-orange-500 text-white px-3 py-1.5 rounded hover:bg-orange-400 transition-colors uppercase tracking-wider"
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            onClick={() => handleRejectPending(project._id)}
                                                            className="flex-1 text-xs font-bold bg-transparent border border-red-500 text-red-500 px-3 py-1.5 rounded hover:bg-red-500/10 transition-colors uppercase tracking-wider"
                                                        >
                                                            Reject
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/10">
                                            {/* Edit & Delete Logic */}
                                            {((currentRole === 'admin') || (currentRole === 'engineer' && project.createdBy?.name === user?.name)) && (
                                                <>
                                                    <button onClick={() => navigate(`/projects/edit/${project._id}`)} className="text-blue-400 hover:text-blue-300">
                                                        <Edit className="w-5 h-5" />
                                                    </button>
                                                    <button onClick={() => handleDelete(project._id)} className="text-red-400 hover:text-red-300">
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </>
                                            )}

                                            {/* Assign Logic */}
                                            {((currentRole === 'admin') || (currentRole === 'engineer' && project.createdBy?.name === user?.name)) && (
                                                <button onClick={() => openAssignModal(project)} className="text-sky-400 hover:text-sky-300 ml-auto flex items-center gap-1 text-sm font-bold uppercase tracking-widest" title="Assign Viewers">
                                                    <Users className="w-4 h-4" />
                                                    <span>Assign</span>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {/* Assignment Modal */}
            {assignModalData.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/80 backdrop-blur-sm">
                    <div className="glassmorphism w-full max-w-md bg-slate-900 border border-slate-700 p-6 rounded-2xl shadow-2xl relative">
                        <button
                            onClick={() => setAssignModalData({ ...assignModalData, isOpen: false })}
                            className="absolute top-4 right-4 text-slate-400 hover:text-white"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <h2 className="text-xl font-bold uppercase tracking-wider text-sky-400 mb-4 flex items-center gap-2">
                            <Users className="w-5 h-5" /> Select Viewers
                        </h2>

                        <div className="max-h-60 overflow-y-auto mb-6 pr-2 custom-scrollbar">
                            {viewers.length === 0 ? (
                                <p className="text-slate-400 text-sm italic">No viewers found in the system.</p>
                            ) : (
                                <div className="space-y-2">
                                    {viewers.map(viewer => {
                                        const isSelected = assignModalData.selectedViewers.includes(viewer._id);
                                        return (
                                            <label key={viewer._id} className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${isSelected ? 'border-sky-500 bg-sky-900/20' : 'border-slate-700 hover:bg-slate-800'}`}>
                                                <input
                                                    type="checkbox"
                                                    className="w-4 h-4 mr-3 accent-sky-500"
                                                    checked={isSelected}
                                                    onChange={(e) => {
                                                        const newSelected = e.target.checked
                                                            ? [...assignModalData.selectedViewers, viewer._id]
                                                            : assignModalData.selectedViewers.filter(id => id !== viewer._id);
                                                        setAssignModalData({ ...assignModalData, selectedViewers: newSelected });
                                                    }}
                                                />
                                                <div>
                                                    <p className="font-bold text-slate-200">{viewer.name}</p>
                                                    <p className="text-xs text-slate-500">{viewer.email}</p>
                                                </div>
                                            </label>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setAssignModalData({ ...assignModalData, isOpen: false })}
                                className="px-4 py-2 rounded-lg font-bold text-slate-400 hover:text-white"
                            >
                                CANCEL
                            </button>
                            <button
                                onClick={submitAssignment}
                                className="px-6 py-2 rounded-lg font-bold bg-sky-600 hover:bg-sky-500 text-white transition-colors uppercase tracking-wider"
                            >
                                {currentRole === 'admin' ? 'Apply Now' : 'Request Access'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
