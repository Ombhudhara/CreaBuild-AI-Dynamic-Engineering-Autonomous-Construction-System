import React, { createContext, useState, useEffect } from 'react';
import { login as loginService, register as registerService } from '../services/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [token, setToken] = useState(null);

    useEffect(() => {
        // Hydrate from localStorage on initial load
        const storedToken = localStorage.getItem('token');
        const storedRole = localStorage.getItem('role');
        const storedName = localStorage.getItem('name');

        if (storedToken && storedRole) {
            setToken(storedToken);
            setRole(storedRole);
            if (storedName) {
                setUser({ name: storedName });
            }
        }
    }, []);

    const login = async (email, password) => {
        const data = await loginService(email, password);
        setToken(data.token);
        setRole(data.role);
        setUser({ name: data.name });
    };

    const register = async (name, email, password, userRole = 'Viewer') => {
        const data = await registerService(name, email, password, userRole);
        setToken(data.token);
        setRole(data.role);
        setUser({ name: data.name });
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('name');
        setToken(null);
        setRole(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ token, role, user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
