// pages/plan/weekly-plan.js
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Head from "next/head";
import { gaEvent } from "../../lib/gtag";
import { toast } from "react-hot-toast";
import PlanHistoryModal from "../../components/Plan/PlanHistoryModal";
import WeeklyPlan from "../../components/Plan/WeeklyPlan";
import classes from "./weekly-plan.module.css";
import ShareButton from "../../components/UI/ShareButton";
const HISTORY_KEY = "wpl_weekly_history";
const PROGRESS_KEY = "wpl_weekly_progress";

export default function WeeklyPlanPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [plan, setPlan] = useState(null);
  const [weekSummary, setWeekSummary] = useState("");
  const [updatedAt, setUpdatedAt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [modalState, setModalState] = useState(null);
  const [progress, setProgress] = useState({}); // { Monday: { fitness: true, ... }, ... }
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    gaEvent("weekly_plan_page_view", {
      isPremium: session?.user?.isPremium || false,
    });
    gaEvent("key_weekly_plan_page_view", {
      premium: session?.user?.isPremium || false,
      hasSession: !!session,
    });
  }, [session]);

  function isWeekFinished(updatedAt) {
    if (!updatedAt) return true;

    const updated = new Date(updatedAt);
    const now = new Date();

    // Normalize time to midnight so partial days are not counted
    const updatedMid = new Date(
      updated.getFullYear(),
      updated.getMonth(),
      updated.getDate(),
    );
    const nowMid = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const diffDays = Math.round((nowMid - updatedMid) / (1000 * 60 * 60 * 24));

    return diffDays >= 7;
  }

  const loadProgressFromStorage = (weekId) => {
    try {
      const raw = window.localStorage.getItem(PROGRESS_KEY);
      if (!raw) return {};
      const parsed = JSON.parse(raw);
      if (parsed.weekId !== weekId) return {};
      return parsed.data || {};
    } catch {
      return {};
    }
  };

  const saveProgressToStorage = (weekId, data) => {
    try {
      const payload = { weekId, data };
      window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(payload));
    } catch {
      // ignore
    }
  };

  const getWeekId = (dt) => dt || "unknown_week";

  // ---------- API calls ----------

  const loadWeeklyPlan = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/plan/weekly");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load plan");

      const p = data.plan || null;
      if (!p) gaEvent("key_weekly_plan_missing_plan");

      const weekId = getWeekId(data.updatedAt);

      // FIX: normalize weeklyPlan shape (supports old history & restored plans)
      const normalized = p?.days ? p.days : p;
      setPlan(normalized);

      setWeekSummary(data.weekSummary || "");
      if (!data.weekSummary) gaEvent("key_weekly_plan_missing_week_summary");

      setUpdatedAt(data.updatedAt || null);
      if (!data.updatedAt) gaEvent("key_weekly_plan_missing_updated_at");

      if (typeof window !== "undefined" && p) {
        const stored = loadProgressFromStorage(weekId);
        setProgress(stored);
      }
    } catch (err) {
      console.error("Load plan error:", err);
      gaEvent("key_weekly_plan_load_fail", {
        error: err.message || "unknown",
      });

      setPlan(null);
      setWeekSummary("");
      setUpdatedAt(null);
      setProgress({});
    } finally {
      setLoading(false);
    }
  };

  const regeneratePlan = async () => {
    try {
      setRegenerating(true);

      // Request a new plan from API (this writes history in MongoDB)
      const res = await fetch("/api/plan/weekly", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to regenerate plan");

      // Load newest active plan from database
      await loadWeeklyPlan();

      // 🔥 Load updated MongoDB history
      await loadHistory();
      gaEvent("key_weekly_plan_regenerate_success");

      setModalState("success");

      // Reset progress for new week
      const weekId = getWeekId(data.updatedAt);
      if (typeof window !== "undefined") {
        saveProgressToStorage(weekId, {});
      }
    } catch (err) {
      console.error("Regenerate error:", err);
      gaEvent("key_weekly_plan_regenerate_fail", {
        error: err.message || "unknown",
      });
    } finally {
      setRegenerating(false);
    }
  };

  const loadHistory = async (page = 1) => {
    try {
      setHistoryLoading(true);

      const res = await fetch(`/api/plan/history?page=${page}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to load history");
      }

      // ANOMALY: empty history list
      if (!data.items || data.items.length === 0) {
        gaEvent("key_weekly_plan_history_empty");
      }

      setHistory(data.items || []);
    } catch (err) {
      console.error("Load history error:", err);

      gaEvent("key_weekly_plan_history_fail", {
        error: err.message || "unknown",
      });

      setHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  // ---------- progress toggle ----------

  const toggleProgress = (day, key) => {
    if (!day || typeof key !== "string") {
      gaEvent("key_weekly_plan_toggle_invalid", { day, key });
    }

    // GA4 tracking
    gaEvent("weekly_plan_item_toggle", {
      day,
      item: key,
      new_value: !progress?.[day]?.[key] || false,
    });

    const weekId = getWeekId(updatedAt);
    setProgress((prev) => {
      const forDay = prev[day] || {};
      const newForDay = { ...forDay, [key]: !forDay[key] };

      // If all tasks for the day are completed:
      if (Object.values(newForDay).every((v) => v === true)) {
        gaEvent("weekly_plan_day_completed", { day });
      }

      const updated = {
        ...prev,
        [day]: {
          ...forDay,
          [key]: !forDay[key],
        },
      };
      if (typeof window !== "undefined") {
        try {
          saveProgressToStorage(weekId, updated);
        } catch {
          gaEvent("key_weekly_plan_progress_save_fail", { weekId });
        }
      }

      return updated;
    });
  };

  // ---------- effects ----------

  useEffect(() => {
    if (status === "authenticated" && session?.user?.isPremium) {
      loadWeeklyPlan();
    }
  }, [status, session]);

  useEffect(() => {
    if (showHistory) loadHistory();
  }, [showHistory]);

  useEffect(() => {
    if (!loading && plan) {
      scrollToToday();
    }
  }, [loading, plan]);

  // ---------- permission gates ----------
  if (
    status !== "loading" &&
    status !== "authenticated" &&
    status !== "unauthenticated"
  ) {
    gaEvent("key_weekly_plan_session_state_invalid", { status });
  }

  if (status === "loading") {
    return <p className={classes.loading}>Checking your session…</p>;
  }

  // If user is NOT logged in
  if (!session) {
    gaEvent("key_weekly_plan_invalid_session");

    return (
      <div className={classes.lockWrap}>
        <h2 className={classes.lockTitle}>Your Weekly Wellness Plan</h2>

        <p className={classes.lockText}>
          Please sign in to view your personalized weekly plan.
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
    gaEvent("key_weekly_plan_not_premium", {
      email: session?.user?.email || "unknown",
    });

    return (
      <div className={classes.lockWrap}>
        <h2 className={classes.lockTitle}>Premium Feature</h2>

        <p className={classes.lockText}>
          Your personalized weekly plan is available for Premium members.
        </p>

        <button
          onClick={() => router.push("/premium")}
          className={classes.lockButton}
        >
          Upgrade to Premium
        </button>

        <p className={classes.hintText}>
          Premium gives you full access to weekly plans, daily rituals, sleep
          reset, stress protocol, premium workouts and your AI coach.
        </p>
      </div>
    );
  }

  // ---------- print handler ----------

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  async function handleSendEmail() {
    try {
      // 📌 GA TRACKING — must be FIRST line inside try {}
      gaEvent("weekly_plan_email_click", {
        user_id: session?.user?.email || "unknown",
      });

      const res = await fetch("/api/plan/weekly?action=email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (!res.ok) {
        gaEvent("key_weekly_plan_email_api_fail", {
          status: res.status,
          error: data.error,
        });

        toast.error(data.error || "Failed to send weekly plan email.");
        return;
      }

      toast.success("📩 Your weekly plan has been sent to your email.");
    } catch (error) {
      gaEvent("key_weekly_plan_email_fail", {
        error: error.message || "unknown",
      });
      toast.error("Network error while sending email.");
    }
  }

  const scrollToToday = () => {
    const today = new Date().toLocaleString("en-US", { weekday: "long" });
    const el = document.getElementById(`day-${today}`);
    if (!el) {
      gaEvent("key_weekly_plan_scroll_to_today_fail", { today });
    }

    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      <Head>
        <title>Your Weekly Plan | Wellness Pure Life</title>
      </Head>

      {/* MAIN PAGE */}
      <div className={classes.page}>
        <h1 className={classes.title}>Your Weekly Wellness Plan</h1>
        <p className={classes.subtitle}>Fitness • Mindfulness • Nutrition</p>

        {weekSummary && <p className={classes.summary}>{weekSummary}</p>}

        {updatedAt && (
          <p className={classes.updated}>
            Last updated:{" "}
            {new Date(updatedAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        )}

        {plan && (
          <p className={classes.completion}>
            {Math.round(
              (Object.values(progress)
                .flatMap((obj) => Object.values(obj))
                .filter((v) => v === true).length /
                28) *
                100,
            )}
            % completed this week
          </p>
        )}

        <div className={classes.buttonRow}>
          <button
            onClick={() => {
              // 🔥 GA4 tracking — must be FIRST LINE
              gaEvent("weekly_plan_regenerate_click", {
                isFinished: isWeekFinished(updatedAt),
              });

              if (!isWeekFinished(updatedAt)) {
                setModalState("warning");

                // 🔥 Track regenerate "warning" result
                gaEvent("weekly_plan_regenerate_result", { status: "warning" });
                gaEvent("key_weekly_plan_regenerate_blocked", {
                  updatedAt: updatedAt || "missing",
                });
              } else {
                regeneratePlan().then(() => {
                  setModalState("success");

                  // 🔥 Track regenerate "success" result
                  gaEvent("weekly_plan_regenerate_result", {
                    status: "success",
                  });
                });
              }
            }}
            className={`${classes.regenButton} ${
              isWeekFinished(updatedAt) ? classes.regenGlow : ""
            }`}
            disabled={regenerating}
          >
            {regenerating ? "Updating…" : "Regenerate Weekly Plan"}
          </button>

          <button
            type="button"
            className={classes.historyButton}
            onClick={() => {
              if (!showHistory) {
                gaEvent("weekly_plan_history_open", {
                  count: history?.length || 0,
                });

                loadHistory();
              }

              setShowHistory((prev) => !prev);
            }}
          >
            {showHistory ? "Close History" : "📜 View History"}
          </button>
          <button
            className={classes.favButton}
            onClick={() => router.push("/plan/weekly_plan_favorites")}
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
          <ShareButton
            title="My Personalized Weekly Plan"
            text="Check out my personalized Weekly plan based on my preferences at Wellness Pure Life."
            url={`https://wellnesspurelife.com${router.asPath}`}
            onShare={() =>
              gaEvent("weekly_plan_share", {
                user: session?.user?.email || "anonymous",
              })
            }
          />
        </div>

        {loading ? (
          <p className={classes.loading}>Loading your plan…</p>
        ) : !plan ? (
          <p className={classes.empty}>No weekly plan available.</p>
        ) : (
          <div className={classes.days}>
            {[
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ].map((day) => (
              <div key={day} id={`day-${day}`}>
                <WeeklyPlan
                  day={day}
                  data={plan?.[day] || null}
                  dayProgress={progress[day]}
                  toggleProgress={toggleProgress}
                  updatedAt={updatedAt}
                />
              </div>
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
            {/* WARNING STATE */}
            {modalState === "warning" && (
              <>
                <h2 className={classes.modalTitle}>Week Not Finished Yet</h2>

                <p className={classes.modalText}>
                  Your current weekly plan is still in progress. Before
                  generating a new plan, please complete the remaining days.
                </p>

                <div className={classes.modalActions}>
                  <button
                    className={classes.cancelBtn}
                    onClick={() => setModalState(null)}
                  >
                    Keep Current Plan
                  </button>

                  <button
                    className={classes.confirmBtn}
                    onClick={() => {
                      setModalState(null);
                      scrollToToday(); // scrolls user to remaining days
                    }}
                  >
                    View Remaining Days
                  </button>
                </div>
              </>
            )}

            {/* SUCCESS STATE */}
            {modalState === "success" && (
              <>
                <h2 className={classes.modalTitle}>Plan Updated</h2>

                <p className={classes.modalText}>
                  Your weekly plan has been beautifully refreshed. Enjoy a newly
                  crafted 7-day journey of personalized fitness, mindfulness,
                  and nourishment designed exclusively for you.
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

      {/* 📘 HISTORY MODAL — Insert this EXACTLY here */}
      <PlanHistoryModal
        show={showHistory}
        onClose={() => setShowHistory(false)}
        history={history}
        loading={historyLoading}
      />
    </>
  );
}
