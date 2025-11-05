import React, { useState } from 'react';
import './MCQQuestion.css';

const MCQQuestion = ({ question, onAnswer, disabled }) => {
    const [selectedOption, setSelectedOption] = useState(null);

    const handleOptionClick = (optionId) => {
        if (disabled) return;
        setSelectedOption(optionId);
        onAnswer(question.id, optionId);
    };

    return (
        <div className="mcq-question">
            <h2 className="question-text">{question.text}</h2>
            <div className="options-container">
                {question.mcq_options.map((option) => (
                    <button
                        key={option.id}
                        className={`option-button ${selectedOption === option.id ? 'selected' : ''}`}
                        onClick={() => handleOptionClick(option.id)}
                        disabled={disabled}
                    >
                        {option.text}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default MCQQuestion;