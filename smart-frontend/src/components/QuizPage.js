import React, { useState } from "react";
import { Link } from "react-router-dom";
import quizzesData from "../data/Quizzes.json";
import "./QuizPage.css";

function QuizPage() {
    const [selectedSubject, setSelectedSubject] = useState(null);

    const quizTypes = [
        { type: 'mcq', label: 'Quiz', description: 'Multiple Choice Questions' },
        { type: 'drag_drop', label: 'Drag and Drop', description: 'Interactive drag and drop questions' },
        { type: 'fill_blanks', label: 'Fill the Blanks', description: 'Complete the code by filling blanks' },
        { type: 'predict_output', label: 'Predict the Output', description: 'Predict program output' }
    ];

    if (selectedSubject) {
        return (
            <div className="quiz-page">
                <div className="subject-header">
                    <button
                        className="back-btn"
                        onClick={() => setSelectedSubject(null)}
                    >
                        ← Back to Subjects
                    </button>
                    <h2>{selectedSubject} - Select Quiz Type</h2>
                </div>
                <div className="quiz-types-grid">
                    {quizTypes.map((quizType) => (
                        <div key={quizType.type} className="quiz-type-card">
                            <h3>{quizType.label}</h3>
                            <p>{quizType.description}</p>
                            <Link
                                to={`/quiz/${selectedSubject}/${quizType.type}`}
                                className="quiz-btn"
                            >
                                Start {quizType.label}
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="quiz-page">
            <h2>Select a Quiz Subject</h2>
            <div className="quiz-list">
                {quizzesData.map((quiz, index) => (
                    <div key={index} className="quiz-card">
                        <h3>{quiz.subject}</h3>
                        <p>{quiz.questions.length} Questions Available</p>
                        <button
                            onClick={() => setSelectedSubject(quiz.subject)}
                            className="quiz-btn"
                        >
                            Select Subject
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default QuizPage;
