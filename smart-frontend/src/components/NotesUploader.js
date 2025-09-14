// src/components/NotesUploader.js
import React, { useState, useEffect } from 'react';
import api from '../api/axios';

function NotesUploader() {
    const [file, setFile] = useState(null);
    const [subject, setSubject] = useState('');
    const [topic, setTopic] = useState('');
    const [notes, setNotes] = useState([]);

    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        try {
            const response = await api.get('notes/');
            setNotes(response.data);
        } catch (error) {
            console.error('Error fetching notes:', error);
        }
    };

    const uploadNote = async () => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('subject', subject);
        formData.append('topic', topic);

        try {
            await api.post('notes/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            fetchNotes();
            setSubject('');
            setTopic('');
            setFile(null);
        } catch (error) {
            console.error('Error uploading note:', error);
        }
    };

    return (
        <div>
            <h2>Upload Study Notes</h2>
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
            <input type="file" onChange={(e) => setFile(e.target.files[0])} />
            <button onClick={uploadNote}>Upload</button>

            <h3>Available Notes</h3>
            <ul>
                {notes.map((note) => (
                    <li key={note.id}>
                        {note.subject} - {note.topic} | <a href={`http://localhost:8000${note.file}`} target="_blank">View Note</a>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default NotesUploader;
