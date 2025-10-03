import React from 'react';
import { Navigate } from 'react-router-dom';
import Login from '../components/Login';
import { useAuth } from '../hooks/useAuth';
import './Pages.css';

const LoginPage = () => {
    const { isAuthenticated } = useAuth();

    if (isAuthenticated) {
        return <Navigate to="/study-planner" replace />;
    }

    return (
        <div className="page-container">
            <div className="auth-wrapper">
                <div className="auth-header">
                    <h1>PrepPilot</h1>
                    <p>Sign in to continue to your dashboard</p>
                </div>
                <Login />
            </div>
        </div>
    );
};

export default LoginPage;