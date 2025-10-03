import { createContext, useState, useEffect } from 'react';

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
                    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/token/verify/`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ token: storedToken })
                    });
    
                    if (response.ok) {
                        setIsAuthenticated(true);
                    } else {
                        await refreshToken();
                    }
                } catch (error) {
                    console.error('Auth verification failed:', error);
                    logout();
                }
            }
            setLoading(false);
        };

        verifyAuth();
    }, []);

    const checkAuth = async () => {
        const storedToken = localStorage.getItem('token');
        const storedUser = JSON.parse(localStorage.getItem('user'));
        
        if (storedToken && storedUser?.refresh) {
            // Verify token validity
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/token/verify/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ token: storedToken })
                });

                if (!response.ok) {
                    // Token is invalid, try to refresh
                    await refreshToken();
                } else {
                    setIsAuthenticated(true);
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                logout();
            }
        } else {
            setIsAuthenticated(false);
            setToken(null);
            setUser(null);
        }
        setLoading(false);
    };

    const refreshToken = async () => {
        try {
            const refresh = user?.refresh;
            if (!refresh) {
                throw new Error('No refresh token available');
            }

            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/token/refresh/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refresh })
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.access);
                setToken(data.access);
                setIsAuthenticated(true);
                return true;
            } else {
                throw new Error('Token refresh failed');
            }
        } catch (error) {
            console.error('Token refresh failed:', error);
            logout();
            return false;
        }
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

