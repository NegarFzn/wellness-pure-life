import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useUI } from "../../context/UIContext";
import PremiumButton from "../PremiumButton/PremiumButton";
import classes from "./WellnessAssistant.module.css";

export default function WellnessAssistantContent() {
  const { data: session, status } = useSession();
  const { openLogin } = useUI();
  const user = session?.user;
  const isAuthenticated = !!user;
  const isPremium = user?.isPremium || false;

  const [isOpen, setIsOpen] = useState(false);
  const [chat, setChat] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // ✅ Always run hooks before early return
  useEffect(() => {
    const storedChat = localStorage.getItem("wellnessChat");
    if (storedChat) {
      setChat(JSON.parse(storedChat));
    }
  }, []);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
    localStorage.setItem("wellnessChat", JSON.stringify(chat));
  }, [chat]);

  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.removeItem("wellnessChat");
      setChat([]);
    } else {
      setChat((prevChat) =>
        prevChat.filter(
          (msg) =>
            msg.content !==
            "⚠️ Please login first to upgrade and access the Assistant!"
        )
      );
    }
  }, [isAuthenticated]);

  // ✅ Safe to return after all hooks
  if (status === "loading") {
    return (
      <div className={classes.loaderWrapper}>
        <p className={classes.loading}>🔄 Checking access...</p>
      </div>
    );
  }

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setChat((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

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
                  setChat((prev) => [
                    ...prev,
                    {
                      role: "system",
                      content:
                        "⚠️ Please login first to upgrade and access the Assistant!",
                    },
                  ]);
                  openLogin();
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
