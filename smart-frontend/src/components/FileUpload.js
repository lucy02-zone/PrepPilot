import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useAuth } from '../hooks/useAuth';

const FileUpload = ({ studyPlanId, onUploadSuccess }) => {
    const { token } = useAuth();
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);

    const onDrop = useCallback(async (acceptedFiles) => {
        setError(null);
        setUploading(true);
        
        for (const file of acceptedFiles) {
            const formData = new FormData();
            formData.append('file', file);
            
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/study-plans/${studyPlanId}/attach_file/`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                    body: formData
                });

                if (!response.ok) {
                    throw new Error('Upload failed');
                }

                const data = await response.json();
                onUploadSuccess && onUploadSuccess(data);
            } catch (err) {
                setError('Failed to upload file. Please try again.');
                console.error('Upload error:', err);
            }
        }
        setUploading(false);
    }, [studyPlanId, token, onUploadSuccess]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        maxSize: 10485760, // 10MB
    });

    return (
        <div className="upload-container">
            <div
                {...getRootProps()}
                className={`upload-zone ${isDragActive ? 'dragging' : ''} ${uploading ? 'uploading' : ''}`}
            >
                <input {...getInputProps()} />
                {uploading ? (
                    <div className="upload-status">
                        <div className="upload-spinner" />
                        <p>Uploading...</p>
                    </div>
                ) : (
                    <p>{isDragActive ? 'Drop files here' : 'Drag and drop files here, or click to select'}</p>
                )}
            </div>
            {error && <p className="upload-error">{error}</p>}
        </div>
    );
};

export default FileUpload;