import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";

export default function DailyQuizSync() {
  const { status, data: session } = useSession();
  const syncingRef = useRef(false);

  useEffect(() => {
    if (status !== "authenticated" || syncingRef.current) return;
    if (typeof window === "undefined") return;

    // Small delay to ensure token cookies are ready
    const timer = setTimeout(() => {
      const keys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith("daily-checkin:")) keys.push(k);
      }
      if (keys.length === 0) return;

      console.log("[DailyQuizSync] Found guest entries to sync:", keys);

      (async () => {
        syncingRef.current = true;
        try {
          for (const key of keys) {
            const raw = localStorage.getItem(key);
            if (!raw) continue;

            let parsed;
            try {
              parsed = JSON.parse(raw);
            } catch (err) {
              console.warn(
                "[DailyQuizSync] Failed to parse localStorage item:",
                key,
                err
              );
              continue;
            }

            const answer = parsed?.answer;
            if (!answer) {
              console.warn("[DailyQuizSync] No answer found for key:", key);
              continue;
            }

            console.log(
              "[DailyQuizSync] Syncing:",
              key,
              "with answer:",
              answer
            );

            const res = await fetch("/api/quizzes", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                slug: "daily-quiz",
                quizSlug: "daily-quiz",
                isDaily: true,
                result: answer,
                answers: [answer],
                email: session?.user?.email || "", // Always send something
              }),
            });

            if (res.ok) {
              console.log("[DailyQuizSync] Successfully synced:", key);
              localStorage.removeItem(key);
            } else {
              console.warn(
                "[DailyQuizSync] Save failed for key:",
                key,
                "Status:",
                res.status,
                "Response:",
                await res.text()
              );
            }
          }
        } catch (e) {
          console.error("[DailyQuizSync] Sync process failed", e);
        } finally {
          syncingRef.current = false;
        }
      })();
    }, 250); // 250ms delay

    return () => clearTimeout(timer);
  }, [status, session?.user?.email]);

  return null;
}
