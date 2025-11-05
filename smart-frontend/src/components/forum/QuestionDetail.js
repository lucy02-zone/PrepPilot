import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuestion } from '../../hooks/useForumQuestions';
import { LoadingSpinner, ErrorMessage, Button, TextArea, Badge, Card } from './ForumComponents';
import './QuestionDetail.css';

const QuestionDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { question, loading, error, refreshQuestion } = useQuestion(id);
    const [newReply, setNewReply] = useState('');
    const [replyError, setReplyError] = useState(null);

    const handleReplySubmit = async (e) => {
        e.preventDefault();
        setReplyError(null);
        
        try {
            if (!question) return;
            await question.addReply(newReply);
            setNewReply('');
            await refreshQuestion();
        } catch (err) {
            setReplyError('Failed to post reply. Please try again.');
            console.error('Error posting reply:', err);
        }
    };

    const handleUpvote = async (replyId) => {
        try {
            await question.upvoteReply(replyId);
            await refreshQuestion();
        } catch (err) {
            console.error('Error upvoting reply:', err);
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

    if (!question) {
        return <ErrorMessage message="Question not found." />;
    }

    return (
        <div className="question-detail-container">
            <Button 
                variant="secondary"
                onClick={() => navigate('/forum')}
                className="back-btn"
            >
                ← Back to Forum
            </Button>

            <Card className="question-section">
                <div className="question-header">
                    <h1>{question.subject} - {question.topic}</h1>
                    {question.urgent && (
                        <Badge type="urgent">Urgent</Badge>
                    )}
                </div>
                <p className="question-text">{question.question_text}</p>
                <div className="question-meta">
                    <span>Posted on {formatDate(question.created_at)}</span>
                </div>
            </Card>

            <Card className="replies-section">
                <h2>Replies ({question.replies.length})</h2>
                
                <form className="reply-form" onSubmit={handleReplySubmit}>
                    <TextArea
                        value={newReply}
                        onChange={(e) => setNewReply(e.target.value)}
                        placeholder="Write your reply..."
                        required
                        rows="4"
                        error={replyError}
                    />
                    <Button type="submit" variant="primary">Post Reply</Button>
                </form>

                <div className="replies-list">
                    {question.replies.map(reply => (
                        <Card 
                            key={reply.id} 
                            className={`reply-card ${reply.verified ? 'verified' : ''}`}
                        >
                            <div className="reply-content">
                                <p>{reply.reply_text}</p>
                                <div className="reply-footer">
                                    <div className="reply-meta">
                                        <span>Replied on {formatDate(reply.replied_at)}</span>
                                        {reply.verified && (
                                            <Badge type="resolved">Verified Answer</Badge>
                                        )}
                                    </div>
                                    <Button 
                                        variant="secondary"
                                        onClick={() => handleUpvote(reply.id)}
                                        className="upvote-btn"
                                    >
                                        ↑ Upvote ({reply.upvotes})
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}

                    {question.replies.length === 0 && (
                        <Card className="empty-state">
                            No replies yet. Be the first to reply!
                        </Card>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default QuestionDetail;