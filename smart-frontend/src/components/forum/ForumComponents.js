import React from 'react';
import './ForumComponents.css';

export const LoadingSpinner = () => (
    <div className="forum-loading">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
    </div>
);

export const ErrorMessage = ({ message }) => (
    <div className="forum-error">
        <p>{message}</p>
    </div>
);

export const Button = ({ children, variant = 'primary', ...props }) => (
    <button className={`forum-button ${variant}`} {...props}>
        {children}
    </button>
);

export const TextArea = ({ label, error, ...props }) => (
    <div className="forum-textarea-container">
        {label && <label>{label}</label>}
        <textarea className={`forum-textarea ${error ? 'error' : ''}`} {...props} />
        {error && <span className="error-message">{error}</span>}
    </div>
);

export const Input = ({ label, error, ...props }) => (
    <div className="forum-input-container">
        {label && <label>{label}</label>}
        <input className={`forum-input ${error ? 'error' : ''}`} {...props} />
        {error && <span className="error-message">{error}</span>}
    </div>
);

export const Badge = ({ children, type }) => (
    <span className={`forum-badge ${type}`}>{children}</span>
);

export const Card = ({ children, className = '', ...props }) => (
    <div className={`forum-card ${className}`} {...props}>
        {children}
    </div>
);