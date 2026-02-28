import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { Plus, Edit, Trash2, Users } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

export default function ProjectsPage() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const { role, user } = useContext(AuthContext);
    const navigate = useNavigate();

    const currentRole = role ? role.toLowerCase() : 'viewer';

    useEffect(() => {
        fetchProjects();
    }, []);

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

    const handleAssign = (id) => {
        // Simple prompt based assignment for demonstration
        const viewerIds = window.prompt("Enter Viewer IDs separated by comma:");
        if (viewerIds) {
            const ids = viewerIds.split(',').map(id => id.trim());
            api.put(`/projects/${id}/assign`, { viewerIds: ids })
                .then(() => toast.success('Viewers assigned successfully'))
                .catch(err => toast.error(err.response?.data?.message || 'Failed to assign viewers'));
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
                                                <button onClick={() => handleAssign(project._id)} className="text-sky-400 hover:text-sky-300 ml-auto" title="Assign Viewers">
                                                    <Users className="w-5 h-5" />
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
        </div>
    );
}
