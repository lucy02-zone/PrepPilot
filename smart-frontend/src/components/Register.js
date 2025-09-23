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

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('auth/register/', { username, email, password });
            console.log('Registration successful:', response.data);
            navigate('/login'); // redirect to login after successful registration
        } catch (err) {
            if (err.response && err.response.data) {
                // Show backend error if available
                setError(JSON.stringify(err.response.data));
            } else {
                setError('Registration failed. Try again.');
            }
            console.error('Registration failed:', err);
        }
    };

    return (
        <div className="auth-container">
            <h2>Register</h2>
            {error && <p className="auth-error">{error}</p>}
            <form className="auth-form" onSubmit={handleRegister}>
                <label>Username</label>
                <input
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />

                <label>Email</label>
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
