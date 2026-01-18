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

  // ------------------ LOAD FAVORITES ------------------
  const loadFavorites = async () => {
    try {
      const res = await fetch("/api/plan/favorites?type=daily");
      const data = await res.json();
      if (res.ok) setFavorites(data.favorites || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ------------------ SET AS CURRENT ------------------
  const setAsCurrent = async (fav) => {
    gaEvent({
      event: "daily_favorite_set_as_current",
      params: { favorite_id: fav.favoriteId },
    });

    try {
      const res = await fetch("/api/plan/restore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "daily",
          favoriteId: fav.favoriteId, // CORRECT
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Routine set as current.");
        router.push("/plan/daily-routine");
      } else {
        alert(data.error || "Failed to set routine");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to set routine");
    }
  };

  // ------------------ REMOVE FAVORITE ------------------
  const removeFavorite = async (fav) => {
    gaEvent({
      event: "daily_favorite_removed",
      params: { favorite_id: fav.favoriteId },
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
          prev.filter((f) => f.favoriteId !== fav.favoriteId)
        );
      } else {
        const data = await res.json();
        console.error("Remove error:", data.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ------------------ EFFECT: LOAD ON AUTH ------------------
  useEffect(() => {
    if (status === "authenticated" && session?.user?.isPremium) {
      gaEvent({
        event: "daily_favorites_view",
        params: { user: session?.user?.email || "anon" },
      });
      loadFavorites();
    }
  }, [status, session]);

  // ------------------ AUTH GUARDS ------------------
  if (status === "loading") {
    return <p className={classes.status}>Checking your session…</p>;
  }

  if (!session) {
    return (
      <div className={classes.lockWrap}>
        <h2 className={classes.lockTitle}>Favorite Daily Routines</h2>
        <p className={classes.lockText}>
          Please sign in to view your favorite daily routines.
        </p>
        <button
          onClick={() => router.push("/auth")}
          className={classes.lockButton}
        >
          Sign In
        </button>
      </div>
    );
  }

  if (!session.user?.isPremium) {
    return (
      <div className={classes.lockWrap}>
        <h2 className={classes.lockTitle}>Premium Feature</h2>
        <p className={classes.lockText}>
          Favorite daily routines are available for Premium members.
        </p>
        <button
          onClick={() => router.push("/premium")}
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
            gaEvent({
              event: "daily_favorites_go_to_routine",
              params: {
                user: session?.user?.email || "anonymous",
              },
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
