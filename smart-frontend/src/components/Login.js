// src/components/Login.js
import React, { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

function Login() {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();

        // Demo credentials (you can change these)
        const demoUser = {
            username: 'lucy@02',
            password: 'KL#123',
        };

        if (username === demoUser.username && password === demoUser.password) {
            // Fake token for frontend-only auth
            const fakeToken = 'fake-jwt-token';
            login(fakeToken, { username });
            navigate('/study-planner');
        } else {
            setError('Invalid username or password');
        }
    };

    return (
        <div className="auth-container">
            <h2>Login</h2>
            {error && <p className="auth-error">{error}</p>}
            <form className="auth-form" onSubmit={handleLogin}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Login</button>
            </form>
            <div className="auth-link">
                Don't have an account? <a href="/register">Register</a>
            </div>
        </div>
    );
}

export default Login;

