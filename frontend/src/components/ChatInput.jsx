// frontend/src/components/ChatInput.jsx
import "../styles/ChatInput.css"
import { useState } from "react";
import axios from "axios";
import { useApp } from "../context/AppContext";

export default function ChatInput() {
  const [question, setQuestion] = useState("");
  const { setMessages, setVizData, vizEnabled } = useApp();

  async function ask() {
    if (!question.trim()) return;
    setMessages((m) => [...m, { role: "user", text: question }]);
    setQuestion("");

    try {
      const res = await axios.post("http://127.0.0.1:8000/ask/", { question });
      setMessages((m) => [...m, { role: "assistant", text: res.data.explanation }]);
      if (vizEnabled) setVizData(res.data);
    } catch (e) {
      console.error("Error fetching data", e);
    }
  }

  return (
    <div className="chat-input-wrapper">
      <div className="chat-input-container">
        <input
          className="chat-input-field"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask the intelligence system..."
          onKeyDown={(e) => e.key === 'Enter' && ask()}
        />
        
        <div className="chat-input-actions">
          <button type="button" className="action-icon-btn" title="Voice input">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </button>
          
          <button onClick={ask} className="send-btn-modern">
            <span>Send</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}