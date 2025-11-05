// src/components/Login.js
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import api from '../api/axios';
import './Auth.css';

function Login() {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);


    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await api.post('/auth/login/', formData);
            const data = response.data;

            login(data.access, {
                username: formData.username,
                refresh: data.refresh
            });
            navigate('/');
        } catch (err) {
            if (err.response) {
                setError(err.response.data.detail || 'Login failed. Please check your credentials.');
            } else {
                setError('An error occurred. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };



    return (
        <div className="auth-container">
            <h2>Login</h2>
            {error && <p className="auth-error">{error}</p>}
            <form className="auth-form" onSubmit={handleLogin}>
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                        id="username"
                        type="text"
                        value={formData.username}
                        onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                        required
                        disabled={isLoading}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                        required
                        disabled={isLoading}
                    />
                </div>
                <button type="submit" disabled={isLoading} className={isLoading ? 'loading' : ''}>
                    {isLoading ? 'Logging in...' : 'Login'}
                </button>
            </form>
            <div className="auth-link">
                Don't have an account? <a href="/register">Register</a>
            </div>
        </div>
    );
}

export default Login;

