import { createContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verifyAuth = async () => {
            const storedToken = localStorage.getItem('token');
            const storedUser = JSON.parse(localStorage.getItem('user'));

            if (storedToken && storedUser?.refresh) {
                try {
                    await api.post('/auth/token/verify/');
                    setToken(storedToken);
                    setUser(storedUser);
                    setIsAuthenticated(true);
                } catch (error) {
                    if (error.response?.status === 401) {
                        // Token expired, try to refresh
                        try {
                            await refreshToken();
                        } catch (refreshError) {
                            console.error('Token refresh failed:', refreshError);
                            logout();
                        }
                    } else {
                        console.error('Auth verification failed:', error);
                        logout();
                    }
                }
            } else {
                setIsAuthenticated(false);
            }
            setLoading(false);
        };

        verifyAuth();
    }, []);

    const refreshToken = async () => {
        const storedUser = JSON.parse(localStorage.getItem('user'));

        if (storedUser?.refresh) {
            try {
                const response = await api.post('/auth/token/refresh/', {
                    refresh: storedUser.refresh
                });

                const newToken = response.data.access;
                localStorage.setItem('token', newToken);
                setToken(newToken);
                setIsAuthenticated(true);
                return true;
            } catch (error) {
                console.error('Token refresh failed:', error);
                logout();
                return false;
            }
        }
        return false;
    };

    const login = async (accessToken, userData) => {
        localStorage.setItem('token', accessToken);
        localStorage.setItem('user', JSON.stringify(userData));
        setToken(accessToken);
        setUser(userData);
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            token,
            user,
            login,
            logout,
            refreshToken,
            loading
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;

