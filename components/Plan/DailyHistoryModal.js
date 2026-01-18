import { useState, useEffect } from "react";
import { gaEvent } from "../../lib/gtag";
import DailyPreviewModal from "./DailyPreviewModal";
import classes from "./DailyHistoryModal.module.css";

export default function DailyHistoryModal({ show, onClose, history, loading }) {
  const [previewRoutine, setPreviewRoutine] = useState(null);
  const [favoritedIds, setFavoritedIds] = useState({});

  /* --------------------------------------------------
     GA: Modal Open (correct placement — fires ONCE)
  -------------------------------------------------- */
  useEffect(() => {
    if (show) {
      gaEvent("daily_history_open");
    }
  }, [show]);

  if (!show) return null;

  /* -----------------------------
     RESTORE FROM PREVIEW
  ----------------------------- */
  const handleRestoreFromPreview = async (item) => {
    gaEvent("daily_routine_restore", {
      routine_id: item._id,
    });

    try {
      const res = await fetch("/api/plan/restore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "daily",
          dataToRestore: item,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setPreviewRoutine(null);
        onClose();
      } else {
        alert(data.error || "Failed to restore routine");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to restore routine");
    }
  };

  /* -----------------------------
     TOAST
  ----------------------------- */
  const showToast = (message, type = "success") => {
    const toast = document.createElement("div");
    toast.className = `wpl-toast wpl-toast-${type}`;
    toast.innerText = message;

    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add("show"), 10);
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 300);
    }, 1000);
  };

  /* -----------------------------
     FAVORITE ROUTINE
  ----------------------------- */
  const handleFavorite = async (itemRaw) => {
    const id =
      itemRaw._id?.$oid ||
      itemRaw._id?.toString?.() ||
      itemRaw._id ||
      itemRaw.id ||
      itemRaw.routineId ||
      itemRaw.savedAt;

    const safeItem = {
      ...itemRaw,
      _id: String(id),
    };

    gaEvent("daily_routine_favorited", {
      routine_id: id,
    });

    // Optimistic UI
    setFavoritedIds((prev) => ({ ...prev, [id]: true }));

    try {
      const res = await fetch("/api/plan/favorites?type=daily", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "daily",
          routine: safeItem,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setFavoritedIds((prev) => {
          const copy = { ...prev };
          delete copy[id];
          return copy;
        });

        if (data.error === "already_favorite") {
          showToast("This routine is already in your favorites ❤️", "error");
        } else {
          showToast(data.error || "Failed to save favorite", "error");
        }
        return;
      }

      showToast("Added to favorites ❤️", "success");
    } catch (err) {
      console.error(err);

      setFavoritedIds((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });

      showToast("Failed to save favorite", "error");
    }
  };

  /* -----------------------------
     RENDER
  ----------------------------- */
  return (
    <div className={classes.modalOverlay} onClick={onClose}>
      <div className={classes.modal} onClick={(e) => e.stopPropagation()}>
        <button className={classes.closeButton} onClick={onClose}>
          ✕
        </button>

        <h2 className={classes.title}>Previous Daily Routines</h2>
        <p className={classes.subtitle}>
          View, restore, or favorite your past daily routines.
        </p>

        {loading ? (
          <p className={classes.loading}>Loading history…</p>
        ) : history.length === 0 ? (
          <p className={classes.empty}>No previous daily routines saved yet.</p>
        ) : (
          <ul className={classes.list}>
            {history.map((itemRaw) => {
              const id =
                itemRaw._id?.$oid ||
                itemRaw._id?.toString?.() ||
                itemRaw._id ||
                itemRaw.id ||
                itemRaw.routineId ||
                itemRaw.savedAt;

              const item = { ...itemRaw, _id: String(id) };

              return (
                <li key={item._id} className={classes.item}>
                  {/* Meta dates */}
                  <div className={classes.meta}>
                    <span className={classes.date}>
                      {item.updatedAt
                        ? new Date(item.updatedAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "Unknown date"}
                    </span>

                    <span className={classes.saved}>
                      saved{" "}
                      {item.savedAt
                        ? new Date(item.savedAt).toLocaleString("en-US")
                        : ""}
                    </span>
                  </div>

                  {/* Summary */}
                  {item.daySummary && (
                    <p className={classes.summary}>{item.daySummary}</p>
                  )}

                  {/* Buttons */}
                  <div className={classes.actionsRow}>
                    <button
                      className={classes.restoreButton}
                      onClick={() => {
                        gaEvent("daily_history_preview_click", {
                          routine_id: item._id,
                        });
                        setPreviewRoutine(item);
                      }}
                    >
                      Preview Routine
                    </button>

                    <button
                      className={
                        item.isFavorite || favoritedIds[item._id]
                          ? `${classes.favoriteButton} ${classes.favoriteDone}`
                          : classes.favoriteButton
                      }
                      onClick={() => handleFavorite(item)}
                    >
                      {item.isFavorite || favoritedIds[item._id]
                        ? "✓ Favorited"
                        : "❤️ Favorite"}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {/* Preview Modal */}
        {previewRoutine && (
          <DailyPreviewModal
            routine={previewRoutine}
            onClose={() => setPreviewRoutine(null)}
            onConfirm={() => handleRestoreFromPreview(previewRoutine)}
          />
        )}
      </div>
    </div>
  );
}
