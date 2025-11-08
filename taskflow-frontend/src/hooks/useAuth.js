import { useState, useEffect } from 'react';
import { authService } from '../services/authService';

export const useAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const token = localStorage.getItem('authToken');
            if (token) {
                const profile = await authService.getProfile();
                setUser(profile);
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            localStorage.removeItem('authToken');
        } finally {
            setLoading(false);
        }
    };

    const login = async (credentials) => {
        const response = await authService.login(credentials);
        localStorage.setItem('authToken', response.token);
        setUser(response.user);
        return response;
    };

    const logout = async () => {
        await authService.logout();
        localStorage.removeItem('authToken');
        setUser(null);
    };

    const register = async (userData) => {
        const response = await authService.register(userData);
        localStorage.setItem('authToken', response.token);
        setUser(response.user);
        return response;
    };

    const hasAnyRole = (roles) =>
        user && roles.some((role) => user.role === role)

    const hasPermission = (perm) =>
        user && user.permissions?.includes(perm)

    return {
        user,
        loading,
        login,
        logout,
        register,
        isAuthenticated: !!user,
        hasAnyRole,
        hasPermission,
    };
};