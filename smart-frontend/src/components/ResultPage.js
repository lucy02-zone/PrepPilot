// src/components/ResultPage.js
import React from "react";
import { useLocation, Link } from "react-router-dom";
import "./ResultPage.css"; 

function ResultPage() {
    const location = useLocation();
    const { subject, score, total } = location.state || {};

    if (!subject) {
        return (
            <div className="result-page">
                <h2>No results available</h2>
                <Link to="/quizzes" className="btn">Go to Quizzes</Link>
            </div>
        );
    }

    const percentage = ((score / total) * 100).toFixed(2);

    return (
        <div className="result-page">
            <h2>{subject} Quiz Results</h2>
            <p className="score">
                You scored <b>{score}</b> out of <b>{total}</b> ({percentage}%)
            </p>

            <p className="feedback">
                {percentage >= 80 && " Excellent work!"}
                {percentage >= 50 && percentage < 80 && " Good job, keep practicing!"}
                {percentage < 50 && "Don’t worry, review and try again!"}
            </p>

            <div className="result-actions">
                <Link to="/quizzes" className="btn">Take Another Quiz</Link>
                <Link to="/" className="btn">Back to Home</Link>
            </div>
        </div>
    );
}

export default ResultPage; 
