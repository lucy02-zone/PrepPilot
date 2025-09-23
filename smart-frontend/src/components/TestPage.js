// src/components/TestPage.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import quizzesData from "../data/Quizzes.json";
import "./TestPage.css";

function TestPage() {
  const { subject } = useParams();
  const navigate = useNavigate();
  const quiz = quizzesData.find(q => q.subject === subject);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [progress, setProgress] = useState(0);

  // update progress bar when question changes
  useEffect(() => {
    if (quiz) {
      const percent = (currentQuestion / quiz.questions.length) * 100;
      setProgress(percent);
    }
  }, [currentQuestion, quiz]);

  if (!quiz) {
    return <h2>Quiz not found</h2>;
  }

  const handleAnswer = (option) => {
    if (option === quiz.questions[currentQuestion].answer) {
      setScore(prev => prev + 1);
    }

    const nextQ = currentQuestion + 1;
    if (nextQ < quiz.questions.length) {
      setCurrentQuestion(nextQ);
    } else {
      navigate("/results", {
        state: {
          subject: quiz.subject,
          score: option === quiz.questions[currentQuestion].answer ? score + 1 : score,
          total: quiz.questions.length
        }
      });
    }
  };

  return (
    <div className="test-page">
      <h2>{quiz.subject} Test</h2>

      {/* Progress Bar */}
      <div className="progress-container">
        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
      </div>

      <div className="question-card">
        <h3>
          Q{currentQuestion + 1}: {quiz.questions[currentQuestion].question}
        </h3>
        <div className="options">
          {quiz.questions[currentQuestion].options.map((option, i) => (
            <button
              key={i}
              className="option-btn"
              onClick={() => handleAnswer(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TestPage;
