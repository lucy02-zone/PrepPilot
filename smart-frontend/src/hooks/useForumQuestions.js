import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';

export const useForumQuestions = () => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchQuestions = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get('/forum/questions/');
            setQuestions(response.data);
            setError(null);
        } catch (err) {
            console.error('Error loading questions:', err.response || err);
            setError(
                err.response?.data?.detail || 
                err.response?.data?.message || 
                'Failed to load questions. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    }, []);

    const createQuestion = async (questionData) => {
        try {
            const response = await api.post('/forum/questions/', questionData);
            setQuestions(prev => [response.data, ...prev]);
            return response.data;
        } catch (err) {
            console.error('Error creating question:', err.response || err);
            throw new Error(
                err.response?.data?.detail || 
                err.response?.data?.message || 
                'Failed to create question. Please try again.'
            );
        }
    };

    const addReply = async (questionId, replyText) => {
        try {
            const response = await api.post(`/forum/questions/${questionId}/replies/`, {
                reply_text: replyText
            });
            return response.data;
        } catch (err) {
            throw new Error('Failed to add reply. Please try again.');
        }
    };

    const upvoteReply = async (replyId) => {
        try {
            const response = await api.post(`/forum/replies/${replyId}/upvote/`);
            return response.data;
        } catch (err) {
            throw new Error('Failed to upvote reply. Please try again.');
        }
    };

    useEffect(() => {
        fetchQuestions();
    }, [fetchQuestions]);

    return {
        questions,
        loading,
        error,
        createQuestion,
        addReply,
        upvoteReply,
        refreshQuestions: fetchQuestions
    };
};

export const useQuestion = (questionId) => {
    const [question, setQuestion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchQuestion = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get(`/forum/questions/${questionId}/`);
            
            // Add methods to the question object
            const questionData = {
                ...response.data,
                addReply: async (replyText) => {
                    const replyResponse = await api.post(`/forum/questions/${questionId}/replies/`, {
                        reply_text: replyText
                    });
                    return replyResponse.data;
                },
                upvoteReply: async (replyId) => {
                    const upvoteResponse = await api.post(`/forum/replies/${replyId}/upvote/`);
                    return upvoteResponse.data;
                }
            };
            
            setQuestion(questionData);
            setError(null);
        } catch (err) {
            setError('Failed to load question details. Please try again.');
            console.error('Error loading question:', err);
        } finally {
            setLoading(false);
        }
    }, [questionId]);

    useEffect(() => {
        if (questionId) {
            fetchQuestion();
        }
    }, [questionId, fetchQuestion]);

    return {
        question,
        loading,
        error,
        refreshQuestion: fetchQuestion
    };
};