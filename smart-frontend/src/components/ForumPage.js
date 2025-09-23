import { useState } from "react";
import "./Forum.css"; // 👈 import CSS

function Forum() {
  const [questions] = useState([
    {
      id: 1,
      subject: "Programming",
      topic: "JavaScript",
      question_text: "What is the difference between var, let, and const?",
      replies: ["var is function scoped, let/const are block scoped", "const cannot be reassigned"]
    },
    {
      id: 2,
      subject: "Web Development",
      topic: "React",
      question_text: "What is the purpose of useEffect in React?",
      replies: ["It handles side effects like data fetching", "It runs after rendering"]
    },
    {
      id: 3,
      subject: "Backend",
      topic: "Node.js",
      question_text: "How do you handle asynchronous code in Node.js?",
      replies: ["Using callbacks", "Using Promises and async/await"]
    },
    {
      id: 4,
      subject: "Database",
      topic: "SQL",
      question_text: "How do you find the second highest salary in SQL?",
      replies: ["Use ORDER BY with LIMIT", "Use a subquery with MAX"]
    },
    {
      id: 5,
      subject: "Data Structures",
      topic: "Algorithms",
      question_text: "What is the difference between BFS and DFS?",
      replies: ["BFS uses a queue, DFS uses a stack", "BFS explores level by level, DFS goes deep first"]
    }
  ]);

  const [openReplies, setOpenReplies] = useState(null);

  const toggleReplies = (id) => {
    setOpenReplies(openReplies === id ? null : id);
  };

  return (
    <div className="forum-container">
      <h1 className="forum-title">Forum Questions</h1>
      <ul className="forum-list">
        {questions.map((q) => (
          <li key={q.id} className="forum-item">
            <h2 className="forum-subject">{q.subject} - {q.topic}</h2>
            <p className="forum-question">{q.question_text}</p>
            <p 
              className="forum-replies"
              onClick={() => toggleReplies(q.id)}
            >
              Replies: {q.replies.length}
            </p>
            <div className={`reply-wrapper ${openReplies === q.id ? "open" : ""}`}>
              <ul className="reply-list">
                {q.replies.map((reply, index) => (
                  <li key={index} className="reply-item">{reply}</li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Forum;
