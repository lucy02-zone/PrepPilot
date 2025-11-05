import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './QuizResults.css';

const QuizResults = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { results, totalQuestions, quizTitle } = location.state || {};

    if (!results) {
        return (
            <div className="quiz-results-container">
                <div className="quiz-results-error">
                    No results data available.
                </div>
                <button 
                    onClick={() => navigate('/quizzes')}
                    className="back-to-quizzes-btn"
                >
                    Back to Quizzes
                </button>
            </div>
        );
    }

    const correctAnswers = results.filter(result => result.isCorrect).length;
    const percentage = Math.round((correctAnswers / totalQuestions) * 100);

    const getScoreColor = (score) => {
        if (score >= 80) return 'excellent';
        if (score >= 60) return 'good';
        if (score >= 40) return 'average';
        return 'needs-improvement';
    };

    return (
        <div className="quiz-results-container">
            <h1>Quiz Results</h1>
            <h2>{quizTitle}</h2>

            <div className={`score-section ${getScoreColor(percentage)}`}>
                <div className="score-circle">
                    <span className="score-percentage">{percentage}%</span>
                </div>
                <p>You got {correctAnswers} out of {totalQuestions} questions correct</p>
            </div>

            <div className="results-breakdown">
                <h3>Question Breakdown</h3>
                {results.map((result, index) => (
                    <div 
                        key={index} 
                        className={`result-item ${result.isCorrect ? 'correct' : 'incorrect'}`}
                    >
                        <div className="question-number">Question {index + 1}</div>
                        <div className="result-content">
                            <p className="question-text">{result.question}</p>
                            <div className="answer-section">
                                <p>Your answer: <span>{result.userAnswer}</span></p>
                                {!result.isCorrect && (
                                    <p>Correct answer: <span>{result.correctAnswer}</span></p>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="results-actions">
                <button 
                    onClick={() => navigate('/quizzes')}
                    className="back-to-quizzes-btn"
                >
                    Back to Quizzes
                </button>
                <button 
                    onClick={() => navigate(`/quiz/${location.state.quizId}`)}
                    className="retry-quiz-btn"
                >
                    Retry Quiz
                </button>
            </div>
        </div>
    );
};

export default QuizResults;