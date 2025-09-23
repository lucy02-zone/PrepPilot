// src/components/StudyPlanner.js
import React, { useState, useEffect } from 'react';
import './StudyPlanner.css';

function StudyPlanner() {
    const [plans, setPlans] = useState([]);
    const [subject, setSubject] = useState('');
    const [topic, setTopic] = useState('');
    const [examDate, setExamDate] = useState('');
    const [error, setError] = useState('');

    
    useEffect(() => {
        const savedPlans = JSON.parse(localStorage.getItem('studyPlans')) || [];
        setPlans(savedPlans);
    }, []);


    useEffect(() => {
        localStorage.setItem('studyPlans', JSON.stringify(plans));
    }, [plans]);

    const addPlan = (e) => {
        e.preventDefault();
        if (!subject || !topic || !examDate) {
            setError('Please fill all fields');
            return;
        }

        const newPlan = {
            id: Date.now(),
            subject,
            topic,
            exam_date: examDate,
            status: 'pending',
        };

        setPlans([...plans, newPlan]);
        setSubject('');
        setTopic('');
        setExamDate('');
        setError('');
    };

    // Toggle pending/done
    const toggleStatus = (id) => {
        setPlans(plans.map(plan =>
            plan.id === id
                ? { ...plan, status: plan.status === 'pending' ? 'done' : 'pending' }
                : plan
        ));
    };

    // Progress calculation
    const completed = plans.filter(p => p.status === 'done').length;
    const total = plans.length;
    const progress = total > 0 ? (completed / total) * 100 : 0;

    return (
        <div className="study-planner-container">
            <h2>Study Planner</h2>

            <p className="score">
                You have {plans.length} study plan{plans.length !== 1 ? 's' : ''}
            </p>
            <p className="feedback">
                {plans.length === 0
                    ? "Add some study plans to get started!"
                    : "Keep up your studies!"}
            </p>

            {/* Progress Bar */}
            {total > 0 && (
                <div>
                    <div className="progress-container">
                        <div
                            className="progress-fill"
                            style={{
                                width: `${progress}%`,
                                background:
                                    completed === total
                                        ? "linear-gradient(90deg, #16a34a, #065f46)" // green when done
                                        : "linear-gradient(90deg, #2563eb, #1e40af)"
                            }}
                        ></div>
                    </div>
                    <p className="progress-text">
                        {completed} of {total} plans completed
                    </p>
                </div>
            )}

            {/* Add Plan Form */}
            <form className="study-planner-form" onSubmit={addPlan}>
                {error && <p className="error-message">{error}</p>}
                <input
                    type="text"
                    placeholder="Subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Topic"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                />
                <input
                    type="date"
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                />
                <button type="submit" className="btn">Add Study Plan</button>
            </form>

            {/* Plan List */}
            <ul className="study-planner-list">
                {plans.map(plan => (
                    <li key={plan.id} className={`plan-item ${plan.status}`}>
                        <div className="plan-details">
                            <strong>{plan.subject}</strong> - {plan.topic}
                        </div>
                        <div className="plan-meta">
                            Exam: <span>{plan.exam_date}</span> | Status:{" "}
                            <span className={`plan-status ${plan.status}`}>{plan.status}</span>
                        </div>
                        <div className="result-actions">
                            <button className="btn" onClick={() => toggleStatus(plan.id)}>
                                Mark as {plan.status === 'pending' ? 'Done' : 'Pending'}
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default StudyPlanner;
