import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useParams } from 'react-router-dom';
import MCQQuestion from './MCQQuestion';
import DragDropQuestion from './DragDropQuestion';
import FillInBlanksQuestion from './FillInBlanksQuestion';
import PredictOutputQuestion from './PredictOutputQuestion';
import './QuizPage.css';

const QuizPage = () => {
    const { quizId } = useParams();
    const [quiz, setQuiz] = useState(null);
    const [currentAttempt, setCurrentAttempt] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchQuiz();
    }, [quizId]);

    const fetchQuiz = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.get(`/planner/quizzes/${quizId}/`);
            setQuiz(response.data);
        } catch (err) {
            setError('Failed to load quiz. Please try again.');
            console.error('Error loading quiz:', err);
        } finally {
            setLoading(false);
        }
    };

    const startQuiz = async () => {
        try {
            setIsSubmitting(true);
            const response = await api.post(`/planner/quizzes/${quizId}/start_attempt/`);
            setCurrentAttempt(response.data);
            setCurrentQuestionIndex(0);
        } catch (err) {
            setError('Failed to start quiz. Please try again.');
            console.error('Error starting quiz:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleMCQAnswer = async (questionId, optionId) => {
        if (!currentAttempt || isSubmitting) return;

        try {
            setIsSubmitting(true);
            await api.post(`/planner/quiz-attempts/${currentAttempt.id}/submit_mcq_answer/`, {
                question: questionId,
                selected_option: optionId
            });
            moveToNextQuestion();
        } catch (err) {
            setError('Failed to submit answer. Please try again.');
            console.error('Error submitting answer:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDragDropAnswer = async (questionId, answers) => {
        if (!currentAttempt || isSubmitting) return;

        try {
            setIsSubmitting(true);
            for (const answer of answers) {
                await api.post(`/planner/quiz-attempts/${currentAttempt.id}/submit_drag_drop_answer/`, {
                    question: questionId,
                    drag_drop_item: answer.itemId,
                    placed_position: answer.position
                });
            }
            moveToNextQuestion();
        } catch (err) {
            setError('Failed to submit answer. Please try again.');
            console.error('Error submitting answer:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleFillInBlanksAnswer = async (questionId, answers) => {
        if (!currentAttempt || isSubmitting) return;

        try {
            setIsSubmitting(true);
            for (const answer of answers) {
                await api.post(`/planner/quiz-attempts/${currentAttempt.id}/submit_fill_in_blanks_answer/`, {
                    question: questionId,
                    fill_in_blanks_item: answer.itemId,
                    user_answer: answer.userAnswer
                });
            }
            moveToNextQuestion();
        } catch (err) {
            setError('Failed to submit answer. Please try again.');
            console.error('Error submitting answer:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePredictOutputAnswer = async (questionId, answers) => {
        if (!currentAttempt || isSubmitting) return;

        try {
            setIsSubmitting(true);
            for (const answer of answers) {
                await api.post(`/planner/quiz-attempts/${currentAttempt.id}/submit_predict_output_answer/`, {
                    question: questionId,
                    predict_output_item: answer.itemId,
                    user_output: answer.userOutput
                });
            }
            moveToNextQuestion();
        } catch (err) {
            setError('Failed to submit answer. Please try again.');
            console.error('Error submitting answer:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const moveToNextQuestion = () => {
        if (currentQuestionIndex < quiz.questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            completeQuiz();
        }
    };

    const completeQuiz = async () => {
        try {
            setIsSubmitting(true);
            const response = await api.post(`/planner/quiz-attempts/${currentAttempt.id}/complete_attempt/`);
            setCurrentAttempt(response.data);
            // Show results
        } catch (err) {
            setError('Failed to complete quiz. Please try again.');
            console.error('Error completing quiz:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <div className="quiz-loading">Loading quiz...</div>;
    if (error) return <div className="quiz-error">{error}</div>;
    if (!quiz) return null;

    const currentQuestion = quiz.questions[currentQuestionIndex];

    return (
        <div className="quiz-container">
            {!currentAttempt ? (
                <div className="quiz-intro">
                    <h1>{quiz.title}</h1>
                    <p>{quiz.description}</p>
                    <button 
                        onClick={startQuiz} 
                        disabled={isSubmitting}
                        className="start-quiz-btn"
                    >
                        {isSubmitting ? 'Starting...' : 'Start Quiz'}
                    </button>
                </div>
            ) : (
                <div className="quiz-content">
                    <div className="quiz-progress">
                        Question {currentQuestionIndex + 1} of {quiz.questions.length}
                    </div>
                    
                    {currentQuestion.question_type === 'MCQ' ? (
                        <MCQQuestion
                            question={currentQuestion}
                            onAnswer={handleMCQAnswer}
                            disabled={isSubmitting}
                        />
                    ) : currentQuestion.question_type === 'DRAG_DROP' ? (
                        <DragDropQuestion
                            question={currentQuestion}
                            onAnswer={handleDragDropAnswer}
                            disabled={isSubmitting}
                        />
                    ) : currentQuestion.question_type === 'FILL_IN_THE_BLANKS' ? (
                        <FillInBlanksQuestion
                            question={currentQuestion}
                            onAnswer={handleFillInBlanksAnswer}
                            disabled={isSubmitting}
                        />
                    ) : currentQuestion.question_type === 'PREDICT_OUTPUT' ? (
                        <PredictOutputQuestion
                            question={currentQuestion}
                            onAnswer={handlePredictOutputAnswer}
                            disabled={isSubmitting}
                        />
                    ) : null}
                </div>
            )}
        </div>
    );
};

export default QuizPage;