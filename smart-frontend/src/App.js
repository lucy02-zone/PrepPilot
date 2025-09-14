// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import StudyPlanner from './components/StudyPlanner';
import NotesUploader from './components/NotesUploader';
import Login from './components/Login';
import Register from './components/Register';

function App() {
    return (
        <AuthProvider>
            <Router>
                <nav>
                    <Link to="/study-planner">Study Planner</Link> |{' '}
                    <Link to="/notes">Notes Uploader</Link> |{' '}
                    <Link to="/login">Login</Link> |{' '}
                    <Link to="/register">Register</Link>
                </nav>

                <Routes>
                    <Route path="/study-planner" element={<StudyPlanner />} />
                    <Route path="/notes" element={<NotesUploader />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;

