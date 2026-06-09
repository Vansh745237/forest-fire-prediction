import { useState } from "react";
import "./ChatBot.css";
import axios from "axios";
function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
  sender: "bot",
  text:
    "🔥 Welcome to Forest Fire Intelligence Dashboard. Ask me about predictions, weather, safety tips, history, reports or how to use the portal."
}
  ]);

  const [input, setInput] = useState("");

  const sendMessage = async () => {

  if (!input.trim()) return;

  const userMessage = {
    sender: "user",
    text: input
  };

  setMessages(prev => [
    ...prev,
    userMessage
  ]);

  try {

    const API_URL = "https://your-app-name.onrender.com";

    const botReply = res.data.reply;

    setMessages(prev => [
      ...prev,
      {
        sender: "bot",
        text: botReply
      }
    ]);

  } catch (error) {

    console.error(error);

    setMessages(prev => [
      ...prev,
      {
        sender: "bot",
        text: "❌ Unable to connect to AI Assistant."
      }
    ]);
  }

  setInput("");
};
  return (
    <>
      <button
        className="chat-toggle"
        onClick={() => setOpen(!open)}
      >
        💬
      </button>

      {open && (
        <div className="chat-container">

          <div className="chat-header">
            🔥 Forest Fire Assistant
          </div>

          <div className="chat-messages">

            {messages.map((msg, index) => (
              <div
                key={index}
                className={`message ${msg.sender}`}
              >
                {msg.text}
              </div>
            ))}

          </div>

          <div className="chat-input">

            <input
              type="text"
              placeholder="Ask a question..."
              value={input}
              onChange={(e) =>
                setInput(e.target.value)
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
            />

            <button onClick={sendMessage}>
              Send
            </button>

          </div>

        </div>
      )}
    </>
  );
}

export default ChatBot;