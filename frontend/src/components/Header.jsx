import React, { useState, useEffect } from 'react';
import { Cpu, Bell, User, LogOut, ChevronDown, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

export default function Header({ status = 'active' }) {
    // status: 'active' | 'warning'
    const isWarning = status === 'warning';
    const navigate = useNavigate();


    const [notifOpen, setNotifOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [isDarkMode, setIsDarkMode] = useState(() => {
        return localStorage.getItem('theme') !== 'light';
    });

    const toggleTheme = () => {
        const newTheme = !isDarkMode;
        setIsDarkMode(newTheme);
        if (newTheme) {
            document.body.classList.remove('light-mode');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.add('light-mode');
            localStorage.setItem('theme', 'light');
        }
    };

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const { user, role, logout } = React.useContext(AuthContext);

    const userName = user?.name || 'Operator';
    const userRole = role ? role.toUpperCase() : 'VIEWER';

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const res = await api.get('/notifications');
            setNotifications(res.data.data);
        } catch (error) {
            console.error("Failed to fetch notifications", error);
        }
    };

    const handleReadNotification = async (notif) => {
        try {
            if (!notif.isRead) {
                await api.put(`/notifications/${notif._id}/read`);
                setNotifications(notifications.map(n => n._id === notif._id ? { ...n, isRead: true } : n));
            }
            if (notif.relatedProject) {
                navigate(`/projects/edit/${notif.relatedProject._id || notif.relatedProject}`);
            } else {
                navigate('/projects');
            }
            setNotifOpen(false);
        } catch (error) {
            console.error("Failed to mark read", error);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <header className="h-20 w-full glassmorphism border-b border-white/10 px-6 sm:px-12 flex items-center justify-between bg-gray-950/80 sticky top-0 z-30">
            <div className="flex items-center gap-4">
                <h1 className="text-2xl font-black text-white tracking-widest uppercase truncate drop-shadow-md">
                    Project <span className="text-cyan-400 font-light">Apex-A1</span>
                </h1>
                <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
                    <span className="text-gray-400 text-xs font-bold tracking-widest uppercase">ID:</span>
                    <span className="text-white font-mono text-sm">CB-00984</span>
                </div>
            </div>

            <div className="flex items-center gap-6">
                {/* Pulsing AI Active Badge */}
                <motion.div
                    animate={isWarning ? { scale: [1, 1.05, 1] } : {}}
                    transition={{ repeat: Infinity, duration: 0.5 }}
                    className={`group hidden md:flex items-center gap-3 px-4 py-2 rounded-full border transition-all ${isWarning
                        ? 'bg-red-900/40 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.6)] neon-red-border'
                        : 'bg-cyan-900/30 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.3)] neon-pulse-border'
                        }`}
                >
                    <Cpu className={`w-5 h-5 ${isWarning ? 'text-red-400 animate-pulse' : 'text-cyan-400'}`} />
                    <span className={`text-sm font-bold tracking-widest uppercase ${isWarning ? 'text-red-400 neon-red' : 'text-cyan-300 neon-cyan'
                        }`}>
                        {isWarning ? 'AI ANOMALY DETECTED' : 'AI ACTIVE'}
                    </span>
                    {!isWarning && (
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                        </span>
                    )}
                </motion.div>

                <button onClick={toggleTheme} className="relative p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                    {isDarkMode ? <Sun className="w-5 h-5 text-gray-300" /> : <Moon className="w-5 h-5 text-gray-300" />}
                </button>

                <div className="relative">
                    <button onClick={() => setNotifOpen(!notifOpen)} className="relative p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                        <Bell className="w-5 h-5 text-slate-300" />
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white border-2 border-slate-900 animate-pulse">
                                {unreadCount}
                            </span>
                        )}
                    </button>

                    <AnimatePresence>
                        {notifOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="absolute right-0 mt-3 w-72 glassmorphism bg-slate-950/90 border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden py-2 z-50 max-h-96 overflow-y-auto custom-scrollbar"
                            >
                                <div className="px-4 py-3 border-b border-slate-700/50 flex justify-between items-center">
                                    <span className="block text-white text-sm font-bold uppercase tracking-wider">Notifications</span>
                                    <span className="text-orange-500 text-xs font-bold">{unreadCount} New</span>
                                </div>
                                <div className="flex flex-col">
                                    {notifications.length === 0 ? (
                                        <p className="text-slate-400 text-xs p-4 text-center">No notifications found.</p>
                                    ) : (
                                        notifications.slice(0, 10).map((notif) => (
                                            <button
                                                key={notif._id}
                                                onClick={() => handleReadNotification(notif)}
                                                className={`text-left px-4 py-3 border-b border-slate-700/30 hover:bg-white/5 transition-colors flex items-start gap-3 ${!notif.isRead ? 'bg-orange-500/10' : 'opacity-70'}`}
                                            >
                                                {!notif.isRead && <span className="w-2 h-2 mt-1.5 rounded-full bg-orange-500 shrink-0 shadow-[0_0_8px_rgba(249,115,22,0.6)]"></span>}
                                                <div>
                                                    <p className={`text-xs leading-snug ${!notif.isRead ? 'text-slate-200 font-semibold' : 'text-slate-400'}`}>{notif.message}</p>
                                                    <span className="text-[10px] text-slate-500 mt-1 block uppercase tracking-wide font-mono">
                                                        {new Date(notif.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </button>
                                        ))
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Profile Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="flex items-center gap-3 p-1.5 pr-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                    >
                        <div className="w-8 h-8 rounded-full bg-cyan-900/50 border border-cyan-500/50 flex items-center justify-center">
                            <User className="w-4 h-4 text-cyan-400" />
                        </div>
                        <div className="hidden sm:flex flex-col items-start pr-1">
                            <span className="text-white text-xs font-bold uppercase tracking-wider">{userName}</span>
                            <span className="text-cyan-400 text-[10px] uppercase font-mono tracking-widest">{userRole}</span>
                        </div>
                        <ChevronDown className="w-4 h-4 text-gray-400 hidden md:block" />
                    </button>

                    <AnimatePresence>
                        {dropdownOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="absolute right-0 mt-3 w-48 glassmorphism bg-gray-950 border border-white/10 rounded-2xl shadow-2xl overflow-hidden py-2"
                            >
                                <div className="px-4 py-3 border-b border-white/5 mb-2 sm:hidden">
                                    <span className="block text-white text-sm font-bold uppercase tracking-wider">{userName}</span>
                                    <span className="block text-cyan-400 text-xs uppercase font-mono tracking-widest mt-0.5">{userRole}</span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-4 py-2.5 text-sm font-bold tracking-widest uppercase text-red-400 hover:text-red-300 hover:bg-red-950/30 transition-colors flex items-center gap-3"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Logout Session
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </header>
    );
}
