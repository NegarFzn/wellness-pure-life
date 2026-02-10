import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Head from "next/head";
import { gaEvent } from "../../lib/gtag";
import classes from "./favorites.module.css";

export default function DailyFavoritesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  // ------------------ PAGE VIEW ------------------
  useEffect(() => {
    gaEvent("daily_favorites_page_view");
    gaEvent("key_daily_favorites_page_view");
  }, []);

  // ------------------ LOAD FAVORITES ------------------
  const loadFavorites = async () => {
    try {
      const res = await fetch("/api/plan/favorites?type=daily");
      const data = await res.json();

      if (res.ok) {
        setFavorites(data.favorites || []);

        if ((data.favorites || []).length > 0) {
          gaEvent("daily_favorites_loaded");
          gaEvent("key_daily_favorites_loaded");
        } else {
          gaEvent("daily_favorites_empty");
          gaEvent("key_daily_favorites_empty");
        }
      }
    } catch (err) {
      console.error(err);
      gaEvent("daily_favorites_load_error", { error: err.message });
      gaEvent("key_daily_favorites_load_error", { error: err.message });
    } finally {
      setLoading(false);
    }
  };

  // ------------------ SET AS CURRENT ------------------
  const setAsCurrent = async (fav) => {
    gaEvent("daily_favorites_set_as_current_click", {
      favorite_id: fav.favoriteId,
    });
    gaEvent("key_daily_favorites_set_as_current_click", {
      favorite_id: fav.favoriteId,
    });

    try {
      const res = await fetch("/api/plan/restore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "daily",
          favoriteId: fav.favoriteId,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        gaEvent("daily_favorites_set_success", { favorite_id: fav.favoriteId });
        gaEvent("key_daily_favorites_set_success", {
          favorite_id: fav.favoriteId,
        });

        alert("Routine set as current.");
        router.push("/plan/daily-routine");
      } else {
        gaEvent("daily_favorites_set_fail", { error: data.error });
        gaEvent("key_daily_favorites_set_fail", { error: data.error });
        alert(data.error || "Failed to set routine");
      }
    } catch (err) {
      gaEvent("daily_favorites_set_fail", { error: err.message });
      gaEvent("key_daily_favorites_set_fail", { error: err.message });
      console.error(err);
      alert("Failed to set routine");
    }
  };

  // ------------------ REMOVE FAVORITE ------------------
  const removeFavorite = async (fav) => {
    gaEvent("daily_favorites_remove_click", { favorite_id: fav.favoriteId });
    gaEvent("key_daily_favorites_remove_click", {
      favorite_id: fav.favoriteId,
    });

    try {
      const res = await fetch("/api/plan/favorites", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "daily",
          dataToRestore: fav.routine,
        }),
      });

      if (res.ok) {
        setFavorites((prev) =>
          prev.filter((f) => f.favoriteId !== fav.favoriteId),
        );

        gaEvent("daily_favorites_remove_success", {
          favorite_id: fav.favoriteId,
        });
        gaEvent("key_daily_favorites_remove_success", {
          favorite_id: fav.favoriteId,
        });
      } else {
        const data = await res.json();
        gaEvent("daily_favorites_remove_fail", { error: data.error });
        gaEvent("key_daily_favorites_remove_fail", { error: data.error });
        console.error("Remove error:", data.error);
      }
    } catch (err) {
      gaEvent("daily_favorites_remove_fail", { error: err.message });
      gaEvent("key_daily_favorites_remove_fail", { error: err.message });
      console.error(err);
    }
  };

  // ------------------ EFFECT: LOAD ON AUTH ------------------
  useEffect(() => {
    if (status === "authenticated" && session?.user?.isPremium) {
      gaEvent("daily_favorites_view", {
        user: session?.user?.email || "anon",
      });
      gaEvent("key_daily_favorites_view", {
        user: session?.user?.email || "anon",
      });
      loadFavorites();
    }
  }, [status, session]);

  // ------------------ AUTH GUARDS ------------------
  if (status === "loading") {
    gaEvent("daily_favorites_checking_auth");
    gaEvent("key_daily_favorites_checking_auth");
    return <p className={classes.status}>Checking your session…</p>;
  }

  if (!session) {
    gaEvent("daily_favorites_not_logged_in");
    gaEvent("key_daily_favorites_not_logged_in");

    return (
      <div className={classes.lockWrap}>
        <h2 className={classes.lockTitle}>Favorite Daily Routines</h2>
        <p className={classes.lockText}>
          Please sign in to view your favorite daily routines.
        </p>
        <button
          onClick={() => {
            gaEvent("daily_favorites_signin_click");
            gaEvent("key_daily_favorites_signin_click");
            router.push("/auth");
          }}
          className={classes.lockButton}
        >
          Sign In
        </button>
      </div>
    );
  }

  if (!session.user?.isPremium) {
    gaEvent("daily_favorites_non_premium");
    gaEvent("key_daily_favorites_non_premium");

    return (
      <div className={classes.lockWrap}>
        <h2 className={classes.lockTitle}>Premium Feature</h2>
        <p className={classes.lockText}>
          Favorite daily routines are available for Premium members.
        </p>
        <button
          onClick={() => {
            gaEvent("daily_favorites_upgrade_click");
            gaEvent("key_daily_favorites_upgrade_click");
            router.push("/premium");
          }}
          className={classes.lockButton}
        >
          Upgrade to Premium
        </button>
      </div>
    );
  }

  // ------------------ RENDER ------------------
  return (
    <>
      <Head>
        <title>Favorite Daily Routines | Wellness Pure Life</title>
      </Head>

      <div className={classes.page}>
        <h1 className={classes.title}>Your Favorite Daily Routines</h1>
        <p className={classes.subtitle}>
          Quickly reuse your most-loved daily wellness flows.
        </p>

        <button
          className={classes.goWeeklyButton}
          onClick={() => {
            gaEvent("daily_favorites_go_to_current_click", {
              user: session?.user?.email || "anonymous",
            });
            gaEvent("key_daily_favorites_go_to_current_click", {
              user: session?.user?.email || "anonymous",
            });
            router.push("/plan/daily-routine");
          }}
        >
          Go to Your Current Daily Routine
        </button>

        {loading ? (
          <p className={classes.status}>Loading favorites…</p>
        ) : favorites.length === 0 ? (
          <p className={classes.status}>
            You have not added any favorite daily routines yet.
          </p>
        ) : (
          <div className={classes.grid}>
            {favorites.map((fav) => {
              const updatedAt = fav.updatedAt || null;
              const summary =
                fav.daySummary ||
                "This daily routine has no summary available.";
              const morning = fav.Morning || null;

              return (
                <div key={fav.favoriteId} className={classes.card}>
                  {/* HEADER */}
                  <div className={classes.cardHeader}>
                    <span className={classes.cardDate}>
                      {updatedAt
                        ? new Date(updatedAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "Saved routine"}
                    </span>
                    <span className={classes.cardTag}>Favorite</span>
                  </div>

                  {/* SUMMARY */}
                  <p className={classes.cardSummary}>{summary}</p>

                  {/* MORNING PREVIEW */}
                  {morning && (
                    <div className={classes.cardPreview}>
                      <strong>{morning.block || "Morning"}</strong>
                      {morning.fitness?.title && (
                        <p>🟣 {morning.fitness.title}</p>
                      )}
                      {morning.mindfulness?.title && (
                        <p>💙 {morning.mindfulness.title}</p>
                      )}
                      {morning.nourish?.title && (
                        <p>💛 {morning.nourish.title}</p>
                      )}
                    </div>
                  )}

                  {/* ACTIONS */}
                  <div className={classes.cardActions}>
                    <button
                      className={classes.primaryButton}
                      onClick={() => setAsCurrent(fav)}
                    >
                      Set as Today’s Routine
                    </button>
                    <button
                      className={classes.secondaryButton}
                      onClick={() => removeFavorite(fav)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
