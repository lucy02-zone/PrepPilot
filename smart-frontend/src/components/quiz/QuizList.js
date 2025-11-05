import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import './QuizList.css';

const QuizList = () => {
    const navigate = useNavigate();
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('all'); // 'all', 'mcq', 'drag_drop'

    useEffect(() => {
        fetchQuizzes();
    }, []);

    const fetchQuizzes = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.get('/planner/quizzes/');
            setQuizzes(response.data);
        } catch (err) {
            setError('Failed to load quizzes. Please try again.');
            console.error('Error loading quizzes:', err);
        } finally {
            setLoading(false);
        }
    };

    const filteredQuizzes = quizzes.filter(quiz => {
        if (filter === 'all') return true;
        return quiz.quiz_type.toLowerCase() === filter;
    });

    return (
        <div className="quiz-list-container">
            <div className="quiz-list-header">
                <h1>Available Quizzes</h1>
                <div className="quiz-filters">
                    <button 
                        className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                        onClick={() => setFilter('all')}
                    >
                        All
                    </button>
                    <button 
                        className={`filter-btn ${filter === 'mcq' ? 'active' : ''}`}
                        onClick={() => setFilter('mcq')}
                    >
                        Multiple Choice
                    </button>
                    <button
                        className={`filter-btn ${filter === 'drag_drop' ? 'active' : ''}`}
                        onClick={() => setFilter('drag_drop')}
                    >
                        Drag & Drop
                    </button>
                    <button
                        className={`filter-btn ${filter === 'fill_in_the_blanks' ? 'active' : ''}`}
                        onClick={() => setFilter('fill_in_the_blanks')}
                    >
                        Fill in the Blanks
                    </button>
                    <button
                        className={`filter-btn ${filter === 'predict_output' ? 'active' : ''}`}
                        onClick={() => setFilter('predict_output')}
                    >
                        Predict Output
                    </button>
                </div>
            </div>

            {loading && (
                <div className="quiz-list-loading">Loading quizzes...</div>
            )}

            {error && (
                <div className="quiz-list-error">{error}</div>
            )}

            <div className="quiz-grid">
                {filteredQuizzes.map(quiz => (
                    <div key={quiz.id} className="quiz-card">
                        <h2>{quiz.title}</h2>
                        <p>{quiz.description}</p>
                        <div className="quiz-card-footer">
                            <span className="quiz-type">
                                {quiz.quiz_type === 'MCQ' ? 'Multiple Choice' :
                                 quiz.quiz_type === 'DRAG_DROP' ? 'Drag & Drop' :
                                 quiz.quiz_type === 'FILL_IN_THE_BLANKS' ? 'Fill in the Blanks' :
                                 quiz.quiz_type === 'PREDICT_OUTPUT' ? 'Predict Output' : quiz.quiz_type}
                            </span>
                            <button
                                onClick={() => navigate(`/quiz/${quiz.id}`)}
                                className="start-btn"
                            >
                                Start Quiz
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {!loading && filteredQuizzes.length === 0 && (
                <div className="no-quizzes">
                    No quizzes found for the selected type.
                </div>
            )}
        </div>
    );
};

export default QuizList;