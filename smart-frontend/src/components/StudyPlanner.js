// src/components/StudyPlanner.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FileUpload from './FileUpload';
import './StudyPlanner.css';

function StudyPlanner() {
    const [plans, setPlans] = useState([]);
    const [subject, setSubject] = useState('');
    const [topic, setTopic] = useState('');
    const [examDate, setExamDate] = useState('');
    const [notes, setNotes] = useState('');
    const [priority, setPriority] = useState(1);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/study-plans/`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch study plans');
            }

            const data = await response.json();
            setPlans(data);
        } catch (err) {
            setError('Failed to load study plans. Please try logging in again.');
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    const addPlan = async (e) => {
        e.preventDefault();
        if (!subject || !topic || !examDate) {
            setError('Please fill all fields');
            return;
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/study-plans/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    subject,
                    topic,
                    exam_date: examDate,
                    notes,
                    priority,
                    status: 'pending'
                })
            });

            if (!response.ok) {
                throw new Error('Failed to create study plan');
            }

            const newPlan = await response.json();
            setPlans([...plans, newPlan]);
            setSubject('');
            setTopic('');
            setExamDate('');
            setNotes('');
            setPriority(1);
            setError('');
        } catch (err) {
            setError('Failed to create study plan. Please try again.');
            console.error('Submit error:', err);
        }
    };

    // Toggle pending/done
    const toggleStatus = async (id) => {
        try {
            const plan = plans.find(p => p.id === id);
            const newStatus = plan.status === 'pending' ? 'done' : 'pending';
            
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/study-plans/${id}/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    status: newStatus
                })
            });

            if (!response.ok) {
                throw new Error('Failed to update study plan');
            }

            setPlans(plans.map(plan =>
                plan.id === id ? { ...plan, status: newStatus } : plan
            ));
        } catch (err) {
            setError('Failed to update study plan status');
            console.error('Update error:', err);
        }
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
                    required
                />
                <input
                    type="text"
                    placeholder="Topic"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    required
                />
                <input
                    type="date"
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                    required
                />
                <textarea
                    placeholder="Notes (optional)"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="notes-input"
                />
                <div className="priority-input">
                    <label>Priority (1-5):</label>
                    <input
                        type="number"
                        min="1"
                        max="5"
                        value={priority}
                        onChange={(e) => setPriority(parseInt(e.target.value))}
                        required
                    />
                </div>
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
                            {plan.priority && <span> | Priority: {plan.priority}</span>}
                        </div>
                        {plan.notes && (
                            <div className="plan-notes">
                                <strong>Notes:</strong>
                                <p>{plan.notes}</p>
                            </div>
                        )}
                        <div className="files-section">
                            <FileUpload
                                studyPlanId={plan.id}
                                onUploadSuccess={() => fetchPlans()}
                            />
                            {plan.files && plan.files.length > 0 && (
                                <ul className="file-list">
                                    {plan.files.map(file => (
                                        <li key={file.id}>
                                            <a href={file.file_url} target="_blank" rel="noopener noreferrer">
                                                {file.filename}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            )}
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
