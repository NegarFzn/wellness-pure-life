// pages/plan/daily-routine.js
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Head from "next/head";
import { toast } from "react-hot-toast";
import DailyHistoryModal from "../../components/Plan/DailyHistoryModal";
import DailyRoutine from "../../components/Plan/DailyRoutine";
import classes from "./daily-routine.module.css";

const PROGRESS_KEY = "wpl_daily_progress";

export default function DailyRoutinePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [routine, setRoutine] = useState(null);
  const [daySummary, setDaySummary] = useState("");
  const [updatedAt, setUpdatedAt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [modalState, setModalState] = useState(null);
  const [dailyQuote, setDailyQuote] = useState(null);
  const [progress, setProgress] = useState({}); // { morning: { fitness: true }, ... }
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [nextAvailable, setNextAvailable] = useState(null);

  function getNextUTCDayCountdown(updatedAt) {
    if (!updatedAt) return null;

    const last = new Date(updatedAt);

    const nextUTC = new Date(
      Date.UTC(
        last.getUTCFullYear(),
        last.getUTCMonth(),
        last.getUTCDate() + 1,
        0,
        0,
        0
      )
    );
    const now = new Date();
    const nowUTC = new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        now.getUTCHours(),
        now.getUTCMinutes()
      )
    );

    const diffMs = nextUTC - nowUTC;

    if (diffMs <= 0) return "Available now";

    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs / (1000 * 60)) % 60);

    return `${hours}h ${minutes}m`;
  }

  useEffect(() => {
    if (!updatedAt) return;

    const updateCountdown = () => {
      setNextAvailable(getNextUTCDayCountdown(updatedAt));
    };

    updateCountdown(); // First run
    const interval = setInterval(updateCountdown, 60 * 1000);

    return () => clearInterval(interval);
  }, [updatedAt]);

  /* ---------- DAY FINISHED CHECK ---------- */
  function isDayFinished(updatedAt) {
    if (!updatedAt) return true;

    const last = new Date(updatedAt);
    const now = new Date();

    return !(
      last.getUTCFullYear() === now.getUTCFullYear() &&
      last.getUTCMonth() === now.getUTCMonth() &&
      last.getUTCDate() === now.getUTCDate()
    );
  }

  const loadProgressFromStorage = (dayId) => {
    try {
      const raw = window.localStorage.getItem(PROGRESS_KEY);
      if (!raw) return {};
      const parsed = JSON.parse(raw);
      if (parsed.dayId !== dayId) return {};
      return parsed.data || {};
    } catch {
      return {};
    }
  };

  const saveProgressToStorage = (dayId, data) => {
    try {
      const payload = { dayId, data };
      window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(payload));
    } catch {}
  };

  const getDayId = (dt) => dt || "unknown_day";

  /* ---------- API CALLS ---------- */

  const loadDailyRoutine = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/plan/daily");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load routine");

      // ✅ FIX: Use dailyRoutine, not routine
      const r = data.dailyRoutine || null;

      setRoutine(r);
      setDaySummary(data.daySummary || "");
      setUpdatedAt(data.updatedAt || null);

      // ✅ Daily Quote is separate — correct
      setDailyQuote({
        quote: data.quote || "",
        quoteAuthor: data.quoteAuthor || "",
        mentorTip: data.mentorTip || "",
      });

      if (typeof window !== "undefined" && r) {
        const dayId = getDayId(data.updatedAt);
        const stored = loadProgressFromStorage(dayId);
        setProgress(stored);
      }
    } catch (err) {
      console.error("Load routine error:", err);
      setRoutine(null);
      setDaySummary("");
      setUpdatedAt(null);
      setProgress({});
    } finally {
      setLoading(false);
    }
  };

  const regenerateRoutine = async () => {
    try {
      setRegenerating(true);

      const res = await fetch("/api/plan/daily", { method: "POST" });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.error || "Failed to regenerate routine");

      await loadDailyRoutine();
      await loadHistory();

      setModalState("success");

      const dayId = getDayId(data.updatedAt);
      if (typeof window !== "undefined") {
        saveProgressToStorage(dayId, {});
      }
    } catch (err) {
      console.error("Regenerate error:", err);
      toast.error(err.message || "Failed to regenerate routine.");
    } finally {
      setRegenerating(false);
    }
  };

  const loadHistory = async (page = 1) => {
    try {
      setHistoryLoading(true);

      const res = await fetch(`/api/plan/history?type=daily&page=${page}`);

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to load history");
      setHistory(data.items || []);
    } catch (err) {
      console.error("Load history error:", err);
      setHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  /* ---------- PROGRESS TOGGLE ---------- */

  const toggleProgress = (block, key) => {
    const dayId = getDayId(updatedAt);
    setProgress((prev) => {
      const forBlock = prev[block] || {};
      const updated = {
        ...prev,
        [block]: {
          ...forBlock,
          [key]: !forBlock[key],
        },
      };
      if (typeof window !== "undefined") {
        saveProgressToStorage(dayId, updated);
      }
      return updated;
    });
  };

  /* ---------- EFFECT ---------- */
  useEffect(() => {
    if (status === "authenticated" && session?.user?.isPremium) {
      loadDailyRoutine();
    }
  }, [status, session]);

  /* ---------- PERMISSION GATES ---------- */

  if (status === "loading") {
    return <p className={classes.loading}>Checking your session…</p>;
  }

  if (!session) {
    return (
      <div className={classes.lockWrap}>
        <h2 className={classes.lockTitle}>Your Daily Wellness Routine</h2>

        <p className={classes.lockText}>
          Please sign in to view your personalized daily routine.
        </p>

        <button
          onClick={() => router.push("/login")}
          className={classes.lockButton}
        >
          Sign In
        </button>

        <p className={classes.hintText}>
          Don’t have an account yet?{" "}
          <span
            className={classes.hintLink}
            onClick={() => router.push("/signup")}
          >
            Create one for free
          </span>
          .
        </p>
      </div>
    );
  }

  if (!session.user?.isPremium) {
    return (
      <div className={classes.lockWrap}>
        <h2 className={classes.lockTitle}>Premium Feature</h2>

        <p className={classes.lockText}>
          Your personalized daily routine is available for Premium members.
        </p>

        <button
          onClick={() => router.push("/premium")}
          className={classes.lockButton}
        >
          Upgrade to Premium
        </button>

        <p className={classes.hintText}>
          Premium gives you full access to daily routines, weekly plans,
          rituals, sleep reset, stress protocol, and your AI coach.
        </p>
      </div>
    );
  }

  /* ---------- PRINT ---------- */

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  async function handleSendEmail() {
    try {
      const res = await fetch("/api/plan/daily?action=email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to send daily plan email.");
        return;
      }

      toast.success("📩 Your daily plan has been sent to your email.");
    } catch (error) {
      toast.error("Network error while sending email.");
    }
  }

  return (
    <>
      <Head>
        <title>Your Daily Routine | Wellness Pure Life</title>
      </Head>

      <div className={classes.page}>
        <h1 className={classes.title}>Your Daily Wellness Routine</h1>
        <p className={classes.subtitle}>Morning • Midday • Evening</p>

        {daySummary && <p className={classes.summary}>{daySummary}</p>}
        {updatedAt && (
          <>
            <p className={classes.updated}>
              Last updated:{" "}
              {new Date(updatedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>

            {!isDayFinished(updatedAt) && nextAvailable && (
              <p className={classes.nextTimer}>
                ⏳ Next routine available in <strong>{nextAvailable}</strong>
              </p>
            )}
          </>
        )}

        <div className={classes.buttonRow}>
          <button
            onClick={() => {
              if (!isDayFinished(updatedAt)) {
                setModalState("warning");
                return; // ⛔ fully blocks regeneration
              }
              regenerateRoutine(); // ✅ only runs when day is finished
            }}
            className={`${classes.regenButton} ${
              isDayFinished(updatedAt) ? classes.regenGlow : ""
            }`}
            disabled={regenerating}
          >
            {regenerating ? "Updating…" : "Regenerate Daily Routine"}
          </button>

          <button
            type="button"
            className={classes.historyButton}
            onClick={() => {
              if (!showHistory) {
                loadHistory();
              }
              setShowHistory((prev) => !prev);
            }}
          >
            {showHistory ? "Close History" : "📜 View History"}
          </button>

          <button
            className={classes.favButton}
            onClick={() => router.push("/plan/daily_routine_favorites")}
          >
            ⭐ View Favorites
          </button>

          <button
            type="button"
            className={classes.printButton}
            onClick={handlePrint}
          >
            Print / Save as PDF
          </button>
          <button
            className={classes.buttonWeeklyEmail}
            onClick={handleSendEmail}
          >
            Send to Email
          </button>
        </div>
        {dailyQuote?.quote && (
          <div className={classes.quoteBox}>
            <p className={classes.quoteText}>“{dailyQuote.quote}”</p>

            {dailyQuote.quoteAuthor && (
              <p className={classes.quoteAuthor}>— {dailyQuote.quoteAuthor}</p>
            )}

            {dailyQuote.mentorTip && (
              <div className={classes.mentorBox}>
                <strong>Coach tip:</strong> {dailyQuote.mentorTip}
              </div>
            )}
          </div>
        )}
        {loading ? (
          <p className={classes.loading}>Loading your routine…</p>
        ) : routine === null ? (
          <p className={classes.empty}>No daily routine available.</p>
        ) : (
          <div className={classes.days}>
            {["Morning", "Midday", "Evening"].map((block) => (
              <DailyRoutine
                key={block}
                block={block}
                data={routine?.[block] || null}
                blockProgress={progress[block]}
                toggleProgress={toggleProgress}
                updatedAt={updatedAt}
              />
            ))}
          </div>
        )}
      </div>

      {modalState && (
        <div className={classes.overlay}>
          <div
            className={`${classes.modalBase} ${
              modalState === "success"
                ? classes.successModal
                : classes.warningModal
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {modalState === "warning" && (
              <>
                <h2 className={classes.modalTitle}>Day Not Finished Yet</h2>

                <p className={classes.modalText}>
                  Your current daily routine is still in progress. Please
                  complete it before generating a new one.
                </p>

                <div className={classes.modalActions}>
                  <button
                    className={classes.confirmBtn}
                    onClick={() => setModalState(null)}
                  >
                    Keep Current Routine
                  </button>
                </div>
              </>
            )}

            {modalState === "success" && (
              <>
                <h2 className={classes.modalTitle}>Routine Updated</h2>

                <p className={classes.modalText}>
                  Your daily routine has been beautifully refreshed for today.
                </p>

                <div className={classes.modalActions}>
                  <button
                    className={classes.confirmBtn}
                    onClick={() => setModalState(null)}
                  >
                    Continue
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <DailyHistoryModal
        show={showHistory}
        onClose={() => setShowHistory(false)}
        history={history}
        loading={historyLoading}
      />
    </>
  );
}
