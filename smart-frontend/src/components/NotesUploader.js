import React, { useState, useEffect } from "react";
import "./NotesUploader.css";

const NotesUploader = () => {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [notes, setNotes] = useState([]);

  // Load notes from localStorage
  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem("notes")) || [];
    setNotes(savedNotes);
  }, []);

  // Save notes to localStorage
  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !file) {
      setMessage("❌ Please provide both a title and a file.");
      return;
    }

    setUploading(true);
    setMessage("");

    const reader = new FileReader();
    reader.onloadend = () => {
      const newNote = {
        id: Date.now(),
        title,
        fileName: file.name,
        fileData: reader.result,
      };

      setNotes((prevNotes) => [...prevNotes, newNote]);
      setMessage("✅ Notes uploaded successfully!");
      setTitle("");
      setFile(null);
      setUploading(false);
    };

    reader.readAsDataURL(file);
  };

  const handleDelete = (id) => {
    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
  };

  return (
    <div className="notes-card">
      <h2 className="notes-title">Notes Uploader</h2>

      <form onSubmit={handleSubmit} className="notes-form">
        <input
          type="text"
          placeholder="Enter note title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="file"
          accept=".pdf,.docx,.jpg,.png"
          onChange={handleFileChange}
        />
        <button type="submit" disabled={uploading}>
          {uploading ? "Uploading..." : "Upload Notes"}
        </button>
      </form>

      {message && (
        <p className={message.includes("✅") ? "success" : "error"}>{message}</p>
      )}

      <h3 className="notes-subtitle">Your Notes</h3>
      {notes.length === 0 ? (
        <p>No notes uploaded yet. Add some above!</p>
      ) : (
        <ul className="notes-list">
          {notes.map((note) => (
            <li key={note.id} className="note-item">
              <p>
                <strong>{note.title}</strong> ({note.fileName})
              </p>
              <div className="note-actions">
                <a href={note.fileData} download={note.fileName}>
                  Download
                </a>
                <button onClick={() => handleDelete(note.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotesUploader;
