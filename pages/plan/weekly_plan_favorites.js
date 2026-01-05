import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Head from "next/head";
import classes from "./favorites.module.css";

export default function FavoritesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  // ------------------ LOAD FAVORITES ------------------
  const loadFavorites = async () => {
    try {
      const res = await fetch("/api/plan/favorites");
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
    try {
      // Use the full stored snapshot
      const res = await fetch("/api/plan/restore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planToRestore: fav.plan }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Plan set as current.");
        router.push("/plan/weekly-plan");
      } else {
        alert(data.error || "Failed to set plan");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to set plan");
    }
  };

  // ------------------ REMOVE FAVORITE ------------------
  const removeFavorite = async (fav) => {
    try {
      const res = await fetch("/api/plan/favorites", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ favoriteId: fav.favoriteId }),
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
        <h2 className={classes.lockTitle}>Favorite Plans</h2>
        <p className={classes.lockText}>
          Please sign in to view your favorite weekly plans.
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
          Favorite weekly plans are available for Premium members.
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
        <title>Favorite Weekly Plans | Wellness Pure Life</title>
      </Head>

      <div className={classes.page}>
        <h1 className={classes.title}>Your Favorite Weekly Plans</h1>
        <p className={classes.subtitle}>
          Quickly reuse your most-loved wellness weeks.
        </p>
        <button
          className={classes.goWeeklyButton}
          onClick={() => router.push("/plan/weekly-plan")}
        >
          Go to Your Current Weekly Plan
        </button>
        {loading ? (
          <p className={classes.status}>Loading favorites…</p>
        ) : favorites.length === 0 ? (
          <p className={classes.status}>
            You have not added any favorite weekly plans yet.
          </p>
        ) : (
          <div className={classes.grid}>
            {favorites.map((fav) => {
              const updatedAt = fav.updatedAt || null;
              const summary =
                fav.weekSummary || "This weekly plan has no summary available.";
              const monday = fav.Monday || null;

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
                        : "Saved plan"}
                    </span>
                    <span className={classes.cardTag}>Favorite</span>
                  </div>

                  {/* SUMMARY */}
                  <p className={classes.cardSummary}>{summary}</p>

                  {/* MONDAY PREVIEW */}
                  {monday && (
                    <div className={classes.cardPreview}>
                      <strong>{monday.day || "Monday"}</strong>
                      {monday.fitness?.title && (
                        <p>🟣 {monday.fitness.title}</p>
                      )}
                      {monday.mindfulness?.title && (
                        <p>💙 {monday.mindfulness.title}</p>
                      )}
                      {monday.nourish?.title && (
                        <p>💛 {monday.nourish.title}</p>
                      )}
                    </div>
                  )}

                  {/* ACTIONS */}
                  <div className={classes.cardActions}>
                    <button
                      className={classes.primaryButton}
                      onClick={() => setAsCurrent(fav)}
                    >
                      Set as Current Plan
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
