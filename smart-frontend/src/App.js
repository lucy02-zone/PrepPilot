// src/App.js
import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AuthContext, { AuthProvider } from './context/AuthContext';
import StudyPlanner from './components/StudyPlanner';
import NotesUploader from './components/NotesUploader';
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
        <nav className="navbar-container">
            <div className="navbar-brand">
                <Link to="/" className="brand-link">Smart Exam Hub</Link>
            </div>
            <div className="navbar-links">
                <Link to="/study-planner">Study Planner</Link>
                <Link to="/notes">Notes</Link>
                <Link to="/quizzes">Quizzes</Link>
                <Link to="/forum">Forum</Link>

                {!token ? (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                ) : (
                    <>
                        <span className="navbar-user">Hello, {user?.username}</span>
                        <button onClick={logout} className="logout-btn">Logout</button>
                    </>
                )}
            </div>
        </nav>
    );
}

function App() {
    return (
        <AuthProvider>
            <Router>
                <Navbar />
                <div className="container">
                    <Routes>
                        <Route path="/" element={<StudyPlanner />} />
                        <Route path="/study-planner" element={<StudyPlanner />} />
                        <Route path="/notes" element={<NotesUploader />} />
                        <Route path="/quizzes" element={<QuizPage />} />
                        <Route path="/quiz/:subject" element={<TestPage />} />  
                        <Route path="/results" element={<ResultPage />} /> 
                        <Route path="/forum" element={<ForumPage />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
