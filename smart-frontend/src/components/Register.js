import React, { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

function Register() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await api.post('auth/register/', {
                username,
                email,
                password
            });
            console.log('Registration successful:', response.data);
            navigate('/login', { 
                state: { message: 'Registration successful! Please log in.' }
            });
        } catch (err) {
            console.error('Registration failed:', err);
            if (err.isConnectionError) {
                setError('Unable to connect to the server. Please check your internet connection and try again.');
            } else if (err.response?.data) {
                // Handle specific backend validation errors
                const data = err.response.data;
                if (typeof data === 'object') {
                    const errors = Object.entries(data)
                        .map(([key, value]) => `${key}: ${value.join(', ')}`)
                        .join('\n');
                    setError(errors);
                } else {
                    setError(data);
                }
            } else {
                setError('Registration failed. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <h2>Register</h2>
            {error && (
                <div className="auth-error">
                    {error.split('\n').map((err, index) => (
                        <p key={index}>{err}</p>
                    ))}
                </div>
            )}
            <form className="auth-form" onSubmit={handleRegister}>
                <label>Username</label>
                <input
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={isLoading}
                    required
                />

                <label>Email</label>
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    required
                />

                <label>Password</label>
                <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button type="submit">Register</button>
            </form>

            <div className="auth-link">
                Already have an account? <a href="/login">Login</a>
            </div>
        </div>
    );
}

export default Register;
