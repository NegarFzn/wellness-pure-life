import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
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
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [chat, setChat] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);
  const { isChatOpen, openChat, closeChat } = useUI();


  // ✅ Load chat for logged-in user
  useEffect(() => {
    if (user?.email) {
      const storedChat = localStorage.getItem(`wellnessChat-${user.email}`);
      if (storedChat) {
        setChat(JSON.parse(storedChat));
      } else {
        setChat([]);
      }
    }
  }, [user?.email]);

  // ✅ Save chat per user
  useEffect(() => {
    if (user?.email) {
      localStorage.setItem(`wellnessChat-${user.email}`, JSON.stringify(chat));
    }
  }, [chat, user?.email]);

  // ✅ Clear chat on logout
  useEffect(() => {
    if (!isAuthenticated && status !== "loading") {
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("wellnessChat-")) {
          localStorage.removeItem(key);
        }
      });
      setChat([]);
    }
  }, [isAuthenticated, status]);

  // ✅ Auto scroll to latest message
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chat]);

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


  return (
    <div id="chat-box"  className={classes.launcher}>
      {isChatOpen ? (
        <div className={classes.box}>
          <button onClick={closeChat} className={classes.closeBtn}>
            ×
          </button>
          <h4 className={classes.title}>🌿 Wellness Assistant</h4>

          {!isAuthenticated && (
            <p className={`${classes.notice} ${classes.loginPrompt}`}>
              💎 This is a premium feature.
              {router.pathname === "/upgrade" ? (
                <PremiumButton />
              ) : (
                <Link href="/upgrade">
                  <PremiumButton />
                </Link>
              )}
              to unlock.
            </p>
          )}

          {isAuthenticated && !isPremium && (
            <p className={`${classes.notice} ${classes.loginPrompt}`}>
              <span className={classes.icon}>💎</span>
              <strong>This is a premium feature.</strong>
              <br />
              <span className={classes.buttonWrap}>
                <PremiumButton />
              </span>
              <span className={classes.unlockText}> to unlock.</span>
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
            <textarea
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
        <button onClick={openChat} className={classes.askAssistantBtn}>
          💬 Ask Wellness Assistant
        </button>
      )}
    </div>
  );
}
