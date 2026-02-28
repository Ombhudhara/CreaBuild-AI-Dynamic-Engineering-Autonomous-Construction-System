import api from './api';

export const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const { token, role } = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    return response.data;
};

export const register = async (name, email, password, role = 'Viewer') => {
    const response = await api.post('/auth/signup', { name, email, password, role });
    const { token, role: returnedRole } = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('role', returnedRole);
    return response.data;
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
};

export const isAuthenticated = () => {
    return !!localStorage.getItem('token');
};

export const getUserRole = () => {
    return localStorage.getItem('role') || 'viewer';
};
