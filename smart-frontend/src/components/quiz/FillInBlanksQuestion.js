import React, { useState } from 'react';
import './FillInBlanksQuestion.css';

const FillInBlanksQuestion = ({ question, onAnswer, disabled }) => {
    const [answers, setAnswers] = useState({});
    const [hasSubmitted, setHasSubmitted] = useState(false);

    const handleInputChange = (itemId, value) => {
        setAnswers(prev => ({
            ...prev,
            [itemId]: value
        }));
    };

    const handleSubmit = () => {
        if (disabled || hasSubmitted) return;

        const answerData = Object.entries(answers).map(([itemId, userAnswer]) => ({
            itemId: parseInt(itemId),
            userAnswer: userAnswer || ''
        }));

        setHasSubmitted(true);
        onAnswer(question.id, answerData);
    };

    const renderBlankText = (blankText, itemId) => {
        // Replace ___ with input field
        const parts = blankText.split('___');
        const elements = [];

        parts.forEach((part, index) => {
            elements.push(<span key={`text-${index}`}>{part}</span>);
            if (index < parts.length - 1) {
                elements.push(
                    <input
                        key={`input-${index}`}
                        type="text"
                        className="blank-input"
                        value={answers[itemId] || ''}
                        onChange={(e) => handleInputChange(itemId, e.target.value)}
                        disabled={disabled || hasSubmitted}
                        placeholder="..."
                    />
                );
            }
        });

        return elements;
    };

    return (
        <div className="fill-in-blanks-question">
            <h2 className="question-text">{question.text}</h2>
            <div className="blanks-container">
                {question.fill_in_blanks_items.map((item) => (
                    <div key={item.id} className="blank-item">
                        <div className="blank-text">
                            {renderBlankText(item.blank_text, item.id)}
                        </div>
                    </div>
                ))}
            </div>
            <button
                className="submit-button"
                onClick={handleSubmit}
                disabled={disabled || hasSubmitted || Object.keys(answers).length === 0}
            >
                {disabled ? 'Submitting...' : 'Submit Answers'}
            </button>
        </div>
    );
};

export default FillInBlanksQuestion;
