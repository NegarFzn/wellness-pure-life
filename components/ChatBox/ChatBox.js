import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useUI } from "../../context/UIContext";
import PremiumButton from "../PremiumButton/PremiumButton";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import classes from "./ChatBox.module.css";

export default function ChatBox() {
  const { data: session, status, update } = useSession();
  const { openLogin } = useUI();
  const user = session?.user;
  const isAuthenticated = !!user;
  const isPremium = user?.isPremium || false;

  const [isOpen, setIsOpen] = useState(false);
  const [chat, setChat] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

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
    if (status !== "authenticated") return;

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
  }, [status, isAuthenticated]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    const updatedChat = [...chat, userMessage];
    setChat(updatedChat);
    setInput("");
    setLoading(true);

    try {
      const systemMessage = {
        role: "system",
        content:
          "You are Wellness Assistant, a concise, friendly expert on fitness, nutrition, and mental well-being. Reply clearly, using markdown. Keep responses short and helpful.",
      };

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [systemMessage, ...updatedChat] }),
      });

      const data = await res.json();

      setChat((prev) => [
        ...prev,
        { role: "assistant", content: data.reply || "No reply." },
      ]);
    } catch (error) {
      console.error("❌ GPT Error:", error);
      setChat((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ Failed to fetch response." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className={classes.loaderWrapper}>
        <p className={classes.loading}>🔄 Checking access...</p>
      </div>
    );
  }

  return (
    <div className={classes.launcher}>
      {isOpen ? (
        <div className={classes.box}>
          <h4 className={classes.title}>🌿 Wellness Assistant</h4>

          {!isAuthenticated && (
            <p className={`${classes.notice} ${classes.loginPrompt}`}>
              💎 This is a premium feature.
              <span onClick={openLogin}>
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
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {msg.content}
                </ReactMarkdown>
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
