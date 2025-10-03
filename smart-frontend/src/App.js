// src/App.js
import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import glassTheme from './theme/glassTheme';
import GlassBackground from './components/common/GlassBackground';
import AuthContext, { AuthProvider } from './context/AuthContext';
import StudyPlanner from './components/StudyPlanner';
import { NotesGrid } from './components/notes/NotesGrid.tsx';
import Login from './components/Login';
import Register from './components/Register';
import ForumPage from './components/ForumPage';
import QuizPage from './components/QuizPage'; 
import TestPage from './components/TestPage';   
import ResultPage from './components/ResultPage';
import './App.css';

function Navbar() {
    const { token, user, logout } = useContext(AuthContext);

    return (
        <nav
            style={{
                background: 'rgba(255, 255, 255, 0.7)',
                backdropFilter: 'blur(10px)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                padding: '1rem',
                marginBottom: '2rem',
            }}
            className="navbar-container"
        >
            <div className="navbar-brand">
                <Link 
                    to="/" 
                    className="brand-link"
                    style={{
                        fontSize: '1.5rem',
                        fontWeight: 600,
                        color: 'rgba(104, 85, 224, 0.9)',
                        textDecoration: 'none',
                    }}
                >
                    Smart Exam Hub
                </Link>
            </div>
            <div className="navbar-links">
                <Link 
                    to="/study-planner"
                    style={{
                        color: 'rgba(0, 0, 0, 0.8)',
                        textDecoration: 'none',
                        margin: '0 1rem',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            color: 'rgba(104, 85, 224, 0.9)',
                        },
                    }}
                >Study Planner</Link>
                <Link 
                    to="/notes"
                    style={{
                        color: 'rgba(0, 0, 0, 0.8)',
                        textDecoration: 'none',
                        margin: '0 1rem',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            color: 'rgba(104, 85, 224, 0.9)',
                        },
                    }}
                >Notes</Link>
                <Link 
                    to="/quizzes"
                    style={{
                        color: 'rgba(0, 0, 0, 0.8)',
                        textDecoration: 'none',
                        margin: '0 1rem',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            color: 'rgba(104, 85, 224, 0.9)',
                        },
                    }}
                >Quizzes</Link>
                <Link 
                    to="/forum"
                    style={{
                        color: 'rgba(0, 0, 0, 0.8)',
                        textDecoration: 'none',
                        margin: '0 1rem',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            color: 'rgba(104, 85, 224, 0.9)',
                        },
                    }}
                >Forum</Link>

                {!token ? (
                    <>
                        <Link 
                            to="/login"
                            style={{
                                color: 'white',
                                textDecoration: 'none',
                                margin: '0 0.5rem',
                                padding: '0.5rem 1rem',
                                borderRadius: '8px',
                                background: 'rgba(104, 85, 224, 0.9)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    background: 'rgba(104, 85, 224, 1)',
                                },
                            }}
                        >Login</Link>
                        <Link 
                            to="/register"
                            style={{
                                color: 'white',
                                textDecoration: 'none',
                                margin: '0 0.5rem',
                                padding: '0.5rem 1rem',
                                borderRadius: '8px',
                                background: 'rgba(104, 85, 224, 0.9)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    background: 'rgba(104, 85, 224, 1)',
                                },
                            }}
                        >Register</Link>
                    </>
                ) : (
                    <>
                        <span 
                            className="navbar-user"
                            style={{
                                color: 'rgba(0, 0, 0, 0.8)',
                                margin: '0 1rem',
                            }}
                        >Hello, {user?.username}</span>
                        <button 
                            onClick={logout} 
                            className="logout-btn"
                            style={{
                                color: 'white',
                                border: 'none',
                                padding: '0.5rem 1rem',
                                borderRadius: '8px',
                                background: 'rgba(104, 85, 224, 0.9)',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    background: 'rgba(104, 85, 224, 1)',
                                },
                            }}
                        >Logout</button>
                    </>
                )}
            </div>
        </nav>
    );
}

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useContext(AuthContext);
    const location = useLocation();

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="loading-spinner"></div>
                <p>Loading...</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

function App() {
    return (
        <ThemeProvider theme={glassTheme}>
            <CssBaseline />
            <AuthProvider>
                <Router>
                    <GlassBackground>
                        <Navbar />
                        <div className="container">
                            <Routes>
                                <Route path="/" element={
                                    <ProtectedRoute>
                                        <StudyPlanner />
                                    </ProtectedRoute>
                                } />
                                <Route path="/study-planner" element={
                                    <ProtectedRoute>
                                        <StudyPlanner />
                                    </ProtectedRoute>
                                } />
                                <Route path="/notes" element={
                                    <ProtectedRoute>
                                        <NotesGrid />
                                    </ProtectedRoute>
                                } />
                                <Route path="/quizzes" element={
                                    <ProtectedRoute>
                                        <QuizPage />
                                    </ProtectedRoute>
                                } />
                                <Route path="/quiz/:subject" element={
                                    <ProtectedRoute>
                                        <TestPage />
                                    </ProtectedRoute>
                                } />
                                <Route path="/results" element={
                                    <ProtectedRoute>
                                        <ResultPage />
                                    </ProtectedRoute>
                                } />
                                <Route path="/forum" element={
                                    <ProtectedRoute>
                                        <ForumPage />
                                    </ProtectedRoute>
                                } />
                                <Route path="/login" element={<Login />} />
                                <Route path="/register" element={<Register />} />
                            </Routes>
                        </div>
                    </GlassBackground>
                </Router>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
