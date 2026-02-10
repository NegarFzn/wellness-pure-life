import { useState } from "react";
import PlanPreviewModal from "./PlanPreviewModal";
import { gaEvent } from "../../lib/gtag";
import classes from "./PlanHistoryModal.module.css";

export default function PlanHistoryModal({ show, onClose, history, loading }) {
  const [previewPlan, setPreviewPlan] = useState(null);
  const [favoritedIds, setFavoritedIds] = useState({});

  if (!show) return null;

  // MODAL OPEN
  gaEvent("weekly_plan_history_open", {});
  gaEvent("key_weekly_plan_history_open", {});

  const handleRestoreFromPreview = async (item) => {
    gaEvent("weekly_plan_restore_click", { plan_id: item._id });
    gaEvent("key_weekly_plan_restore_click", { plan_id: item._id });

    try {
      const res = await fetch("/api/plan/restore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planToRestore: item }),
      });

      const data = await res.json();
      if (res.ok) {
        gaEvent("weekly_plan_restore_success", { plan_id: item._id });
        gaEvent("key_weekly_plan_restore_success", { plan_id: item._id });

        setPreviewPlan(null);
        onClose();
      } else {
        gaEvent("weekly_plan_restore_fail", { plan_id: item._id });
        gaEvent("key_weekly_plan_restore_fail", { plan_id: item._id });
      }
    } catch (err) {
      gaEvent("weekly_plan_restore_fail", { plan_id: item._id });
      gaEvent("key_weekly_plan_restore_fail", { plan_id: item._id });
    }
  };

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

  const handleFavorite = async (itemRaw) => {
    const id =
      itemRaw._id?.$oid ||
      itemRaw._id?.toString?.() ||
      itemRaw._id ||
      itemRaw.id ||
      itemRaw.planId ||
      itemRaw.savedAt;

    const safeItem = { ...itemRaw, _id: String(id) };

    // ANALYTICS
    gaEvent("weekly_plan_favorite_click", { plan_id: id });
    gaEvent("key_weekly_plan_favorite_click", { plan_id: id });

    setFavoritedIds((prev) => ({ ...prev, [id]: true }));

    try {
      const res = await fetch("/api/plan/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: safeItem }),
      });

      const data = await res.json();

      if (!res.ok) {
        gaEvent("weekly_plan_favorite_fail", { plan_id: id });
        gaEvent("key_weekly_plan_favorite_fail", { plan_id: id });

        setFavoritedIds((prev) => {
          const copy = { ...prev };
          delete copy[id];
          return copy;
        });

        if (data.error === "already_favorite") {
          showToast("This plan is already in your favorites ❤️", "error");
        } else {
          showToast(data.error || "Failed to save favorite", "error");
        }
        return;
      }

      gaEvent("weekly_plan_favorite_success", { plan_id: id });
      gaEvent("key_weekly_plan_favorite_success", { plan_id: id });

      showToast("Added to favorites ❤️", "success");
    } catch (err) {
      gaEvent("weekly_plan_favorite_fail", { plan_id: id });
      gaEvent("key_weekly_plan_favorite_fail", { plan_id: id });

      setFavoritedIds((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });

      showToast("Failed to save favorite", "error");
    }
  };

  return (
    <div
      className={classes.modalOverlay}
      onClick={() => {
        gaEvent("weekly_plan_history_close", {});
        gaEvent("key_weekly_plan_history_close", {});
        onClose();
      }}
    >
      <div className={classes.modal} onClick={(e) => e.stopPropagation()}>
        <button
          className={classes.closeButton}
          onClick={() => {
            gaEvent("weekly_plan_history_close", {});
            gaEvent("key_weekly_plan_history_close", {});
            onClose();
          }}
        >
          ✕
        </button>

        <h2 className={classes.title}>Previous Weekly Plans</h2>
        <p className={classes.subtitle}>
          View, restore, or favorite your past weekly plans.
        </p>

        {loading ? (
          <p className={classes.loading}>Loading history…</p>
        ) : history.length === 0 ? (
          <p className={classes.empty}>No previous weekly plans saved yet.</p>
        ) : (
          <ul className={classes.list}>
            {history.map((itemRaw) => {
              const id =
                itemRaw._id?.$oid ||
                itemRaw._id?.toString?.() ||
                itemRaw._id ||
                itemRaw.id ||
                itemRaw.planId ||
                itemRaw.savedAt;

              const item = { ...itemRaw, _id: String(id) };

              return (
                <li key={item._id} className={classes.item}>
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

                  {item.weekSummary && (
                    <p className={classes.summary}>{item.weekSummary}</p>
                  )}

                  <div className={classes.actionsRow}>
                    <button
                      className={classes.restoreButton}
                      onClick={() => {
                        gaEvent("weekly_plan_history_preview_click", {
                          plan_id: item._id,
                        });
                        gaEvent("key_weekly_plan_history_preview_click", {
                          plan_id: item._id,
                        });

                        setPreviewPlan(item);

                        gaEvent("weekly_plan_preview_open", {
                          plan_id: item._id,
                        });
                        gaEvent("key_weekly_plan_preview_open", {
                          plan_id: item._id,
                        });
                      }}
                    >
                      Preview Plan
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

        {previewPlan && (
          <PlanPreviewModal
            plan={previewPlan}
            onClose={() => {
              gaEvent("weekly_plan_preview_close", {
                plan_id: previewPlan._id,
              });
              gaEvent("key_weekly_plan_preview_close", {
                plan_id: previewPlan._id,
              });
              setPreviewPlan(null);
            }}
            onConfirm={() => handleRestoreFromPreview(previewPlan)}
          />
        )}
      </div>
    </div>
  );
}
