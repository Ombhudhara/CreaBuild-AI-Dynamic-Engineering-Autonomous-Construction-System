import api from './api';

export const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const { token, role, name } = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    if (name) localStorage.setItem('name', name);
    return response.data;
};

export const register = async (name, email, password, role = 'Viewer') => {
    const response = await api.post('/auth/signup', { name, email, password, role });
    const { token, role: returnedRole, name: returnedName } = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('role', returnedRole);
    if (returnedName) localStorage.setItem('name', returnedName);
    return response.data;
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('name');
};

export const isAuthenticated = () => {
    return !!localStorage.getItem('token');
};

export const getUserRole = () => {
    const role = localStorage.getItem('role') || 'viewer';
    return role.toLowerCase();
};

export const getUserName = () => {
    return localStorage.getItem('name') || 'Operator';
};
