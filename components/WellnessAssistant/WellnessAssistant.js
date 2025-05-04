import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useUI } from "../../context/UIContext";
import PremiumButton from "../PremiumButton/PremiumButton";
import classes from "./WellnessAssistant.module.css";

export default function WellnessAssistantContent() {
  const { user, isPremium, loadingPremium } = useAuth();

  // ✅ return early BEFORE calling any other hooks
  if (typeof loadingPremium !== "boolean" || loadingPremium) {
    return (
      <div className={classes.loaderWrapper}>
        <p className={classes.loading}>🔄 Checking access...</p>
      </div>
    );
  }

  const { openLogin } = useUI();
  const isAuthenticated = !!user;
  const [isOpen, setIsOpen] = useState(false);
  const [chat, setChat] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // ✅ Show a nice loader until premium status check is complete
  if (loadingPremium) {
    return (
      <div className={classes.loaderWrapper}>
        <div className={classes.spinner}></div>
        <p className={classes.loading}>Checking your access...</p>
      </div>
    );
  }

  // Load saved chat on first render
  useEffect(() => {
    const storedChat = localStorage.getItem("wellnessChat");
    if (storedChat) {
      setChat(JSON.parse(storedChat));
    }
  }, []);

  // Save chat and scroll to bottom when updated
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
    localStorage.setItem("wellnessChat", JSON.stringify(chat));
  }, [chat]);

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

  // Clear chat after logout
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.removeItem("wellnessChat");
      setChat([]); // Clear chat visually too
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      setChat(prevChat => prevChat.filter(msg => msg.content !== "⚠️ Please login first to upgrade and access the Assistant!"));
    }
  }, [isAuthenticated]);
  

  return (
    <div className={classes.launcher}>
      {isOpen ? (
        <div className={classes.box}>
          <h4 className={classes.title}>🌿 Wellness Assistant</h4>

          {!isAuthenticated && (
            <p className={`${classes.notice} ${classes.loginPrompt}`}>
              💎 This is a premium feature.
              <span
                type="button"
                onClick={() => {
                  if (!isAuthenticated) {
                    setChat((prev) => [
                      ...prev,
                      {
                        role: "system",
                        content:
                          "⚠️ Please login first to upgrade and access the Assistant!",
                      },
                    ]);
                  }
                }}
              >
                <PremiumButton />
              </span>
              to unlock.
            </p>
          )}

          {isAuthenticated && !isPremium && (
            <p className={`${classes.notice} ${classes.loginPrompt}`}>
              💎 This is a premium feature. <PremiumButton />
              <br />
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
