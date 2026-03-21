import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useUI } from "../../context/UIContext";
import PremiumButton from "../PremiumButton/PremiumButton";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { gaEvent } from "../../lib/gtag";
import classes from "./ChatBox.module.css";

export default function ChatBox() {
  const { data: session, status, update } = useSession();
  const { openLogin } = useUI();
  const user = session?.user;
  const isAuthenticated = !!user;
  const isPremium = user?.isPremium || false;
  const router = useRouter();

  const [chat, setChat] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const { isChatOpen, openChat, closeChat } = useUI();

  /* -------------------------------------- */
  /* LOAD CHAT FOR USER                     */
  /* -------------------------------------- */
  useEffect(() => {
    if (user?.email) {
      const storedChat = localStorage.getItem(`wellnessChat-${user.email}`);
      if (storedChat) setChat(JSON.parse(storedChat));
    }
  }, [user?.email]);

  /* SAVE CHAT */
  useEffect(() => {
    if (user?.email) {
      localStorage.setItem(`wellnessChat-${user.email}`, JSON.stringify(chat));
    }
  }, [chat, user?.email]);

  /* CLEAR CHAT ON LOGOUT */
  useEffect(() => {
    if (!isAuthenticated && status !== "loading") {
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("wellnessChat-")) localStorage.removeItem(key);
      });
      setChat([]);
    }
  }, [isAuthenticated, status]);

  /* AUTO SCROLL */
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  /* -------------------------------------- */
  /* SEND MESSAGE                           */
  /* -------------------------------------- */
  const sendMessage = async () => {
    if (!input.trim()) return;

    // GA – User sends message
    gaEvent("chat_send_message");
    gaEvent("key_chat_send_message");

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

      // GA – AI reply received
      gaEvent("chat_ai_reply", { length: data.reply?.length || 0 });
      gaEvent("key_chat_ai_reply");
    } catch (error) {
      console.error("GPT Error:", error);

      setChat((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ Failed to fetch response." },
      ]);

      // GA – AI error
      gaEvent("chat_ai_error", { error: error.toString() });
      gaEvent("key_chat_ai_error");
    } finally {
      setLoading(false);
    }
  };

  /* -------------------------------------- */
  /* RENDER CHAT BOX                        */
  /* -------------------------------------- */
  return (
    <div id="chat-box" className={classes.launcher}>
      {isChatOpen ? (
        <div className={classes.box}>
          {/* CLOSE CHAT */}
          <button
            onClick={() => {
              gaEvent("chat_close_widget");
              gaEvent("key_chat_close_widget");
              closeChat();
            }}
            className={classes.closeBtn}
          >
            ×
          </button>

          <h4 className={classes.title}>🌿 Wellness Assistant</h4>

          {/* PREMIUM LOCK */}
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
              to unlock
            </p>
          )}

          {isAuthenticated && !isPremium && (
            <p className={`${classes.notice} ${classes.loginPrompt}`}>
              💎 <strong>This is a premium feature.</strong>
              <br />
              <span className={classes.buttonWrap}>
                <PremiumButton />
              </span>
              <span className={classes.unlockText}> to unlock.</span>
            </p>
          )}

          {/* CHAT LOG */}
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

          {/* INPUT AREA */}
          <div className={classes.inputRow}>
            <textarea
              className={classes.input}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                gaEvent("chat_input_typing");
              }}
              onFocus={() => gaEvent("chat_input_focus")}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  gaEvent("chat_send_enter");
                  gaEvent("key_chat_send_enter");
                  sendMessage();
                }
              }}
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
              onClick={() => {
                gaEvent("chat_send_click");
                gaEvent("key_chat_send_click");
                sendMessage();
              }}
              className={classes.send}
              disabled={!isAuthenticated || !isPremium || loading}
            >
              {loading ? "..." : "Send"}
            </button>
          </div>

          {loading && <p className={classes.loading}>Thinking...</p>}
        </div>
      ) : (
        <button
          onClick={() => {
            gaEvent("chat_open_widget");
            gaEvent("key_chat_open_widget");
            openChat();
          }}
          className={classes.askAssistantBtn}
        >
          💬 Ask Wellness Assistant
        </button>
      )}
    </div>
  );
}
