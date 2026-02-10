import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { gaEvent } from "../../../lib/gtag";

export default function DailyQuizSync() {
  const { status, data: session } = useSession();
  const syncingRef = useRef(false);

  useEffect(() => {
    if (status !== "authenticated" || syncingRef.current) return;
    if (typeof window === "undefined") return;

    const timer = setTimeout(() => {
      const keys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith("daily-checkin:")) keys.push(k);
      }

      if (keys.length === 0) return;

      // Analytics: detected keys
      gaEvent("daily_quiz_sync_detected", { count: keys.length });
      gaEvent("key_daily_quiz_sync_detected", { count: keys.length });

      (async () => {
        syncingRef.current = true;

        // Analytics: attempt started
        gaEvent("daily_quiz_sync_attempt", { count: keys.length });
        gaEvent("key_daily_quiz_sync_attempt", { count: keys.length });

        try {
          for (const key of keys) {
            const raw = localStorage.getItem(key);
            if (!raw) {
              gaEvent("daily_quiz_sync_parse_error", { key });
              gaEvent("key_daily_quiz_sync_parse_error", { key });
              continue;
            }

            let parsed;
            try {
              parsed = JSON.parse(raw);
            } catch (err) {
              gaEvent("daily_quiz_sync_parse_error", { key });
              gaEvent("key_daily_quiz_sync_parse_error", { key });
              continue;
            }

            const answer = parsed?.answer;
            if (!answer) {
              gaEvent("daily_quiz_sync_missing_answer", { key });
              gaEvent("key_daily_quiz_sync_missing_answer", { key });
              continue;
            }

            const res = await fetch("/api/quizzes", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                slug: "daily-quiz",
                quizSlug: "daily-quiz",
                isDaily: true,
                result: answer,
                answers: [answer],
                email: session?.user?.email || "",
              }),
            });

            if (res.ok) {
              localStorage.removeItem(key);

              gaEvent("daily_quiz_sync_success", { key, answer });
              gaEvent("key_daily_quiz_sync_success", { key, answer });
            } else {
              gaEvent("daily_quiz_sync_fail", {
                key,
                status: res.status,
              });
              gaEvent("key_daily_quiz_sync_fail", {
                key,
                status: res.status,
              });
            }
          }
        } catch (err) {
          gaEvent("daily_quiz_sync_fail", { error: err.message });
          gaEvent("key_daily_quiz_sync_fail", { error: err.message });
        } finally {
          syncingRef.current = false;
        }
      })();
    }, 250);

    return () => clearTimeout(timer);
  }, [status, session?.user?.email]);

  return null;
}
