// frontend/src/components/ChatPanel.jsx
import "../styles/ChatPanel.css";
import ChatInput from "./ChatInput";
import { useApp } from "../context/AppContext";

export default function ChatPanel() {
  const { messages, vizEnabled, setVizEnabled } = useApp();

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2 style={{ margin: 0, fontSize: '20px' }}>Chat</h2>
        <div className="toggle-group">
          <span className="toggle-label">VISUALIZATION</span>
          <div 
            className={`switch ${vizEnabled ? 'on' : 'off'}`} 
            onClick={() => setVizEnabled(!vizEnabled)}
          >
            <div className={`dot ${vizEnabled ? 'on' : 'off'}`} />
          </div>
        </div>
      </div>

      <div className="messages-area">
        {messages.map((m, i) => (
          <div key={i} className={`bubble ${m.role === "user" ? "user-bubble" : "assistant-bubble"}`}>
            {m.text}
          </div>
        ))}
      </div>

      <div className="input-container">
        <ChatInput />
      </div>
    </div>
  );
}