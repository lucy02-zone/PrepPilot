import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForumQuestions } from '../../hooks/useForumQuestions';
import { LoadingSpinner, ErrorMessage, Button, TextArea, Input, Badge, Card } from './ForumComponents';
import './ForumPage.css';

const ForumPage = () => {
    const [newQuestion, setNewQuestion] = useState({
        subject: '',
        topic: '',
        question_text: '',
        urgent: false
    });
    const [showForm, setShowForm] = useState(false);
    const navigate = useNavigate();
    
    const { questions, loading, error, createQuestion, refreshQuestions } = useForumQuestions();

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewQuestion(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const [submitError, setSubmitError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitError(null);
        try {
            await createQuestion(newQuestion);
            setNewQuestion({
                subject: '',
                topic: '',
                question_text: '',
                urgent: false
            });
            setShowForm(false);
            await refreshQuestions();
        } catch (err) {
            console.error('Error posting question:', err);
            setSubmitError(err.message);
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <ErrorMessage message={error} />;
    }

    return (
        <div className="forum-container">
            <div className="forum-header">
                <h1>Student Forum</h1>
                <Button 
                    variant={showForm ? 'secondary' : 'primary'}
                    onClick={() => setShowForm(!showForm)}
                >
                    {showForm ? 'Cancel' : 'Ask a Question'}
                </Button>
            </div>

            {showForm && (
                <Card className="question-form-card">
                    <form onSubmit={handleSubmit}>
                        {submitError && (
                            <div className="error-message">{submitError}</div>
                        )}
                        <Input
                            label="Subject"
                            type="text"
                            name="subject"
                            value={newQuestion.subject}
                            onChange={handleInputChange}
                            required
                        />

                        <Input
                            label="Topic"
                            type="text"
                            name="topic"
                            value={newQuestion.topic}
                            onChange={handleInputChange}
                            required
                        />

                        <TextArea
                            label="Your Question"
                            name="question_text"
                            value={newQuestion.question_text}
                            onChange={handleInputChange}
                            required
                            rows="4"
                        />

                        <div className="form-group checkbox">
                            <input
                                type="checkbox"
                                id="urgent"
                                name="urgent"
                                checked={newQuestion.urgent}
                                onChange={handleInputChange}
                            />
                            <label htmlFor="urgent">Mark as Urgent</label>
                        </div>

                        <Button type="submit" variant="primary">Post Question</Button>
                    </form>
                </Card>
            )}

            <div className="questions-list">
                {questions.map(question => (
                    <Card 
                        key={question.id} 
                        className={question.urgent ? 'urgent' : ''}
                        onClick={() => navigate(`/forum/question/${question.id}`)}
                    >
                        <div className="question-header">
                            <h3>{question.subject} - {question.topic}</h3>
                            {question.urgent && (
                                <Badge type="urgent">Urgent</Badge>
                            )}
                        </div>
                        <p className="question-text">{question.question_text}</p>
                        <div className="question-footer">
                            <Badge type="pending">
                                {question.replies?.length || 0} replies
                            </Badge>
                            <Button
                                variant="secondary"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/forum/question/${question.id}`);
                                }}
                                className="reply-btn"
                            >
                                Reply
                            </Button>
                            <span className="post-date">
                                Posted on {formatDate(question.created_at)}
                            </span>
                        </div>
                    </Card>
                ))}

                {questions.length === 0 && (
                    <Card className="empty-state">
                        No questions have been posted yet. Be the first to ask!
                    </Card>
                )}
            </div>
        </div>
    );
};

export default ForumPage;