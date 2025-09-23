import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import './navbar.css';

function Navbar() {
    const { token, logout } = useContext(AuthContext);

    return (
        <nav className="navbar">
            <div className="navbar-brand">Smart Exam Hub</div>
            <div className="navbar-links">
                <Link to="/study-planner">Study Planner</Link>
                <Link to="/notes">Notes</Link>
                {!token ? (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                ) : (
                    <button onClick={logout} className="logout-btn">Logout</button>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
