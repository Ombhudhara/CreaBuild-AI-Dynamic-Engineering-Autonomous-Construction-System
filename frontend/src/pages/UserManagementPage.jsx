import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { Edit2, Trash2, Users } from 'lucide-react';
import api from '../services/api';
import { toast } from 'react-hot-toast';

export default function UserManagementPage() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const { data } = await api.get('/users');
            setUsers(data);
        } catch (error) {
            toast.error('Failed to load users');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;
        try {
            await api.delete(`/users/${id}`);
            setUsers(users.filter(u => u._id !== id));
            toast.success('User deleted');
        } catch (error) {
            toast.error('Failed to delete user');
        }
    };

    const handleRoleChange = async (id, newRole) => {
        try {
            await api.put(`/users/${id}`, { role: newRole });
            setUsers(users.map(u => u._id === id ? { ...u, role: newRole } : u));
            toast.success('Role updated');
        } catch (error) {
            toast.error('Failed to update role');
        }
    };

    return (
        <div className="flex h-screen bg-gray-950 overflow-hidden text-white font-sans antialiased relative">
            <div className="absolute inset-0 z-0 bg-grid-pattern opacity-30 pointer-events-none"></div>
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0 z-10 relative">
                <Header status="active" />
                <main className="flex-1 p-6 overflow-y-auto custom-scrollbar">
                    <div className="flex justify-between items-end mb-8">
                        <div>
                            <h2 className="text-3xl font-black uppercase tracking-tight flex items-center gap-3">
                                <Users className="w-8 h-8 text-cyan-400" /> User <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Registry</span>
                            </h2>
                            <p className="text-gray-400 text-sm font-medium mt-1">Admin access matrix. Manage organizational roles.</p>
                        </div>
                    </div>

                    <div className="glassmorphism rounded-3xl border border-white/10 overflow-hidden bg-gray-950/60 p-6">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-white/10 text-xs font-bold text-gray-400 tracking-widest uppercase mb-4">
                                        <th className="p-4">Name</th>
                                        <th className="p-4">Email</th>
                                        <th className="p-4">Authorization Role</th>
                                        <th className="p-4">Status</th>
                                        <th className="p-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {users.map(user => (
                                        <tr key={user._id} className="hover:bg-white/5 transition-colors group">
                                            <td className="p-4 font-bold text-gray-200">{user.name}</td>
                                            <td className="p-4 font-mono text-sm text-gray-400">{user.email}</td>
                                            <td className="p-4">
                                                <select
                                                    value={user.role}
                                                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                                    className="bg-gray-900 border border-white/10 text-sm font-bold uppercase tracking-wider text-cyan-400 px-3 py-1.5 rounded-lg focus:outline-none focus:border-cyan-500"
                                                >
                                                    <option value="Admin">Admin</option>
                                                    <option value="Engineer">Engineer</option>
                                                    <option value="Viewer">Viewer</option>
                                                </select>
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-green-500/10 text-green-400 border border-green-500/20`}>
                                                    Active
                                                </span>
                                            </td>
                                            <td className="p-4 flex gap-3 justify-end">
                                                <button onClick={() => handleDelete(user._id)} className="text-gray-500 hover:text-red-400 transition-colors p-2 bg-white/5 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
