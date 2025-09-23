import React from "react";
import { Link } from "react-router-dom";
import quizzesData from "../data/Quizzes.json";
import "./QuizPage.css";

function QuizPage() {
    return (
        <div className="quiz-page">
            <h2>Select a Quiz Subject</h2>
            <div className="quiz-list">
                {quizzesData.map((quiz, index) => (
                    <div key={index} className="quiz-card">
                        <h3>{quiz.subject}</h3>
                        <p>{quiz.questions.length} Questions</p>
                        <Link to={`/quiz/${quiz.subject}`} className="quiz-btn">
                            Take Quiz
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default QuizPage;
