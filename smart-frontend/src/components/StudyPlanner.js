// src/components/StudyPlanner.js
import React, { useState, useEffect } from 'react';
import api from '../api/axios';

function StudyPlanner() {
    const [plans, setPlans] = useState([]);
    const [subject, setSubject] = useState('');
    const [topic, setTopic] = useState('');
    const [examDate, setExamDate] = useState('');

    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        try {
            const response = await api.get('study-plans/');
            setPlans(response.data);
        } catch (error) {
            console.error('Error fetching study plans:', error);
        }
    };

    const addPlan = async () => {
        try {
            await api.post('study-plans/', { subject, topic, exam_date: examDate });
            fetchPlans();
            setSubject('');
            setTopic('');
            setExamDate('');
        } catch (error) {
            console.error('Error adding plan:', error);
        }
    };

    return (
        <div>
            <h2>Study Planner</h2>
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
            <button onClick={addPlan}>Add Study Plan</button>

            <h3>Your Study Plans</h3>
            <ul>
                {plans.map((plan) => (
                    <li key={plan.id}>
                        {plan.subject} - {plan.topic} (Exam: {plan.exam_date}) [Status: {plan.status}]
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default StudyPlanner;
