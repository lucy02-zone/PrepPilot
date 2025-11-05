import React, { useEffect, useState } from 'react';
import { useApi } from '../hooks/useApi';
import ErrorMessage from './ErrorMessage';
import api from '../api/axios';

const ExampleComponent = () => {
    const [data, setData] = useState(null);
    const { isLoading, error, clearError, executeRequest } = useApi();

    const fetchData = async () => {
        try {
            const result = await executeRequest(() => api.get('/your-endpoint'));
            setData(result);
        } catch (err) {
            // Error is handled by useApi hook
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (error?.isConnectionError) {
        return <ErrorMessage 
            message={error.message} 
            onRetry={() => {
                clearError();
                fetchData();
            }} 
        />;
    }

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            {/* Your component content */}
        </div>
    );
};

export default ExampleComponent;