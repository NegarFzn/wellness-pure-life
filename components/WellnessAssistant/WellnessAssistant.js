import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import classes from "./WellnessAssistant.module.css";

export default function WellnessAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [chat, setChat] = useState([
    {
      role: "assistant",
      content: "Hi! I'm your wellness guide 🌿 How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const { user } = useAuth();

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const updatedChat = [...chat, { role: "user", content: input }];
    setChat(updatedChat);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedChat,
          email: user?.email || "guest@demo.com",
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Something went wrong");

      setChat([...updatedChat, { role: "assistant", content: data.reply }]);
    } catch (err) {
      setChat([
        ...updatedChat,
        {
          role: "assistant",
          content: "⚠️ Sorry, I'm having trouble responding right now.",
        },
      ]);
      console.error("AI fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={classes.launcher}>
      {isOpen ? (
        <div className={classes.box}>
          <h4 className={classes.title}>🌿 Wellness Assistant</h4>
          <div className={classes.log}>
            {chat.map((msg, i) => (
              <div
                key={i}
                className={`${classes.msg} ${
                  msg.role === "user" ? classes.user : classes.bot
                }`}
              >
                {msg.content}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <div className={classes.inputRow}>
            <input
              type="text"
              className={classes.input}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask me anything..."
            />
            <button onClick={sendMessage} className={classes.send}>
              {loading ? "..." : "Send"}
            </button>
          </div>
          {loading && <p className={classes.loading}>Thinking...</p>}
        </div>
      ) : (
        <button onClick={() => setIsOpen(true)} className={classes.send}>
          💬 Ask Wellness Assistant
        </button>
      )}
    </div>
  );
}
