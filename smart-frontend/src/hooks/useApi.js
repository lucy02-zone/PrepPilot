import { useState, useCallback } from 'react';
import api from '../api/axios';

export const useApi = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const executeRequest = useCallback(async (requestFn) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await requestFn();
            return response.data;
        } catch (err) {
            const errorMessage = err.isConnectionError 
                ? err.message 
                : err.response?.data?.message || 'An error occurred. Please try again.';
            setError({ message: errorMessage, isConnectionError: err.isConnectionError });
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    return {
        isLoading,
        error,
        clearError,
        executeRequest
    };
};