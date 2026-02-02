import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load user data from localStorage on mount
    useEffect(() => {
        const storedToken = localStorage.getItem('auth_token');
        const storedUser = localStorage.getItem('user_data');

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Login failed');
            }

            // Store token and user data
            localStorage.setItem('auth_token', data.access_token);
            localStorage.setItem('user_data', JSON.stringify(data.user));

            setToken(data.access_token);
            setUser(data.user);

            return { success: true, user: data.user };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const signup = async (email, password, username = '') => {
        try {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password, username }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Signup failed');
            }

            // After signup, automatically log in
            return await login(email, password);
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const logout = () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
        setToken(null);
        setUser(null);
    };

    const isAuthenticated = () => {
        return token !== null && user !== null;
    };

    const value = {
        user,
        token,
        login,
        signup,
        logout,
        isAuthenticated: isAuthenticated(),
        loading,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
