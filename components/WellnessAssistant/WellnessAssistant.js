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
  const [justSignedUp, setJustSignedUp] = useState(false);

  useEffect(() => {
    const checkFlag = () => {
      const flag = localStorage.getItem("justSignedUp") === "true";
      setJustSignedUp(flag);
    };
  
    checkFlag();
    window.addEventListener("storage", checkFlag);
  
    return () => window.removeEventListener("storage", checkFlag);
  }, []);
  

  // ✅ If user logs in AND flag is removed => allow AI
  useEffect(() => {
    if (user) {
      const flag = localStorage.getItem("justSignedUp") === "true";
      if (!flag) {
        setJustSignedUp(false); // login not after signup => allow AI
      }
    }
  }, [user]);

  const isAuthenticated = !!user && !justSignedUp;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const sendMessage = async () => {
    if (!input.trim() || loading || !isAuthenticated) return;

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
          {!isAuthenticated && (
            <p className={classes.notice}>
              🔒 Please <a href="/login">log in</a> to activate the AI
              assistant.
            </p>
          )}
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
              placeholder={
                isAuthenticated ? "Ask me anything..." : "Login required..."
              }
              disabled={!isAuthenticated}
            />
            <button
              onClick={sendMessage}
              className={classes.send}
              disabled={!isAuthenticated || loading}
            >
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
