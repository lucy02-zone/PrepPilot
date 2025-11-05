import React, { useState } from 'react';
import './PredictOutputQuestion.css';

const PredictOutputQuestion = ({ question, onAnswer, disabled }) => {
    const [userOutput, setUserOutput] = useState('');
    const [hasSubmitted, setHasSubmitted] = useState(false);

    const handleSubmit = () => {
        if (disabled || hasSubmitted || !userOutput.trim()) return;

        setHasSubmitted(true);
        onAnswer(question.id, [{ itemId: question.predict_output_items[0].id, userOutput: userOutput.trim() }]);
    };

    const item = question.predict_output_items[0]; // Assuming one item per question

    return (
        <div className="predict-output-question">
            <h2 className="question-text">{question.text}</h2>

            <div className="code-container">
                <div className="code-header">
                    <span className="language-label">{item.language}</span>
                </div>
                <pre className="code-snippet">
                    <code>{item.code_snippet}</code>
                </pre>
            </div>

            <div className="output-section">
                <label htmlFor="output-input">Expected Output:</label>
                <textarea
                    id="output-input"
                    className="output-textarea"
                    value={userOutput}
                    onChange={(e) => setUserOutput(e.target.value)}
                    placeholder="Enter the expected output here..."
                    disabled={disabled || hasSubmitted}
                    rows={4}
                />
            </div>

            <button
                className="submit-button"
                onClick={handleSubmit}
                disabled={disabled || hasSubmitted || !userOutput.trim()}
            >
                {disabled ? 'Submitting...' : 'Submit Answer'}
            </button>
        </div>
    );
};

export default PredictOutputQuestion;
