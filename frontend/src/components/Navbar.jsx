import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Cpu, LogOut, ArrowRight, Sun, Moon } from 'lucide-react';

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { token, logout } = React.useContext(AuthContext);
    const auth = !!token;

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

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    // Do not show fixed navbar on dashboard pages which use a different layout, or handle it via a layout component.
    // We'll show this on public pages.
    const hiddenPaths = ['/dashboard', '/config', '/analysis', '/users', '/projects'];
    if (hiddenPaths.some(path => location.pathname.startsWith(path))) {
        return null; // hide Navbar in app dashboard (dashboard has its own Header)
    }

    return (
        <nav className="h-20 w-full glassmorphism border-b border-white/10 px-6 sm:px-12 flex items-center justify-between z-50 fixed top-0 bg-gray-950/80 backdrop-blur-3xl">
            <Link to="/" className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.1)] group-hover:border-cyan-400/80 transition-all">
                    <Cpu className="w-6 h-6 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
                </div>
                <h2 className="font-black text-white text-xl tracking-tighter uppercase">
                    CreaBuild <span className="text-cyan-400">AI</span>
                </h2>
            </Link>

            <div className="flex items-center gap-6">
                <button onClick={toggleTheme} className="relative p-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors hidden sm:flex">
                    {isDarkMode ? <Sun className="w-5 h-5 text-gray-300" /> : <Moon className="w-5 h-5 text-gray-300" />}
                </button>

                {auth ? (
                    <>
                        <Link to="/dashboard" className="text-gray-300 hover:text-white font-medium text-sm tracking-widest uppercase flex items-center gap-2">
                            Dashboard <ArrowRight className="w-4 h-4" />
                        </Link>
                        <button onClick={handleLogout} className="flex items-center gap-2 text-red-400 hover:text-red-300 text-sm font-bold tracking-widest uppercase bg-red-950/30 px-5 py-2.5 rounded-full border border-red-500/30 transition-colors hover:bg-red-900/40">
                            <LogOut className="w-4 h-4" /> Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="text-gray-300 hover:text-white font-medium text-sm tracking-widest uppercase px-6 py-2.5 rounded-full border border-white/10 hover:bg-white/5 transition-colors">Login</Link>
                        <Link to="/signup" className="group text-gray-950 font-bold text-sm tracking-widest uppercase bg-cyan-400 hover:bg-cyan-300 px-6 py-2.5 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] transition-all flex items-center gap-2">
                            Get Started
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
}
