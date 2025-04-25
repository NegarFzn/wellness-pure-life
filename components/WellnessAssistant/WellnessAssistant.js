import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useUI } from "../../context/UIContext";
import PremiumButton from "../PremiumButton/PremiumButton";
import classes from "./WellnessAssistant.module.css";

export default function WellnessAssistant() {
  const { user, isPremium } = useAuth();
  const { openLogin } = useUI();
  const isAuthenticated = !!user;
  const [isOpen, setIsOpen] = useState(false);
  const [chat, setChat] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setChat((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    // Simulate AI response (replace with API call if needed)
    setTimeout(() => {
      const response = {
        role: "assistant",
        content:
          "🌿 Here’s a wellness tip: Stay hydrated and take deep breaths!",
      };
      setChat((prev) => [...prev, response]);
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chat]);

  return (
    <div className={classes.launcher}>
      {isOpen ? (
        <div className={classes.box}>
          <h4 className={classes.title}>🌿 Wellness Assistant</h4>

          {!isAuthenticated && (
            <p className={`${classes.notice} ${classes.loginPrompt}`}>
              🔐 Please{" "}
              <button className={classes.loginLink} onClick={openLogin}>
                log in
              </button>{" "}
              to access this feature.
            </p>
          )}

          {isAuthenticated && !isPremium && (
            <p className={`${classes.notice} ${classes.loginPrompt}`}>
              💎 This is a premium feature.{" "} <PremiumButton /><br/>
              to unlock.
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
                !isAuthenticated
                  ? "Login required..."
                  : !isPremium
                  ? "Upgrade to use..."
                  : "Ask me anything..."
              }
              disabled={!isAuthenticated || !isPremium}
            />
            <button
              onClick={sendMessage}
              className={classes.send}
              disabled={!isAuthenticated || !isPremium || loading}
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
