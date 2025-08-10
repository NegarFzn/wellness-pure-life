import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";

export default function DailyQuizSync() {
  const { status, data: session } = useSession();
  const syncingRef = useRef(false);

  useEffect(() => {
    if (status !== "authenticated" || syncingRef.current) return;
    if (typeof window === "undefined") return;

    // gather all pending guest entries (not just today)
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith("daily-checkin:")) keys.push(k);
    }
    if (keys.length === 0) return;

    (async () => {
      syncingRef.current = true;
      try {
        for (const key of keys) {
          const raw = localStorage.getItem(key);
          if (!raw) continue;

          let parsed;
          try {
            parsed = JSON.parse(raw);
          } catch {
            continue;
          }
          const answer = parsed?.answer;
          if (!answer) continue;

          const res = await fetch("/api/quizzes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              slug: "daily-quiz",
              quizSlug: "daily-quiz",
              isDaily: true,
              result: answer,
              answers: [answer],
              // belt-and-suspenders: provide email explicitly
              email: session?.user?.email || undefined,
            }),
          });

          if (res.ok) {
            localStorage.removeItem(key);
          } else {
            console.warn("DailyQuizSync save failed:", key, await res.text());
          }
        }
      } catch (e) {
        console.error("DailyQuizSync failed", e);
      } finally {
        syncingRef.current = false;
      }
    })();
  }, [status, session?.user?.email]);

  return null;
}
