import React, { useContext } from 'react';
import { LayoutDashboard, Layers, Activity, Settings, Users, FolderOpen, PlusSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Sidebar() {
    const location = useLocation();
    const { role } = useContext(AuthContext);
    const currentRole = role ? role.toLowerCase() : 'viewer';

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard', roles: ['admin', 'engineer', 'viewer'] },
        { icon: FolderOpen, label: 'Projects', path: '/projects', roles: ['admin', 'engineer', 'viewer'] },
        { icon: PlusSquare, label: 'Create Project', path: '/projects/create', roles: ['admin', 'engineer'] },
        { icon: Activity, label: 'Analysis', path: '/analysis', roles: ['admin', 'engineer'] },
        { icon: Settings, label: 'Config', path: '/config', roles: ['admin', 'engineer'] },
        { icon: Users, label: 'Users', path: '/users', roles: ['admin'] },
    ];

    return (
        <aside className="w-20 md:w-64 glassmorphism border-r border-white/10 h-full flex flex-col justify-between py-6 px-4 bg-gray-950/80 shrink-0 relative z-20">
            <div>
                <Link to="/" className="flex items-center gap-3 px-2 mb-12 hover:opacity-80 transition-opacity" title="CreaBuild AI">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                        <span className="text-cyan-400 font-bold text-xl">C</span>
                    </div>
                    <h2 className="hidden md:block font-black text-white text-xl tracking-tighter uppercase whitespace-nowrap">CreaBuild <span className="text-cyan-400">AI</span></h2>
                </Link>

                <nav className="space-y-2">
                    {navItems.filter(item => item.roles.includes(currentRole)).map((item, index) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link key={index} to={item.path} className="block">
                                <motion.div
                                    whileHover={{ x: 5 }}
                                    className={`flex items-center gap-4 px-3 py-3 rounded-xl cursor-pointer transition-colors ${isActive
                                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-[inset_0_0_20px_rgba(6,182,212,0.1)]'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    <item.icon className="w-6 h-6 shrink-0" />
                                    <span className="hidden md:block font-medium uppercase tracking-widest text-xs">{item.label}</span>
                                </motion.div>
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="hidden md:block rounded-2xl bg-gray-900 border border-white/5 p-4 mt-8 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                <h4 className="text-xs uppercase tracking-widest text-gray-400 mb-2 font-bold">System Status</h4>
                <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <span className="text-sm text-green-400 font-mono">100% OPERATIONAL</span>
                </div>
            </div>
        </aside>
    );
}
