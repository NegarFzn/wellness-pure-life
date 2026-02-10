import { gaEvent } from "../../lib/gtag";
import classes from "./PlanPreviewModal.module.css";

export default function PlanPreviewModal({ plan, onClose, onConfirm }) {
  if (!plan) return null;

  // OPEN EVENT (normal + anomaly)
  gaEvent("weekly_plan_preview_open", {
    has_summary: !!plan.weekSummary,
  });
  gaEvent("key_weekly_plan_preview_open", {
    has_summary: !!plan.weekSummary,
  });

  const weekSummary = plan.weekSummary || "";
  const days = plan.weeklyPlan?.days ? plan.weeklyPlan.days : plan.weeklyPlan;

  const handleClose = () => {
    gaEvent("weekly_plan_preview_close");
    gaEvent("key_weekly_plan_preview_close");
    onClose();
  };

  const handleConfirm = () => {
    gaEvent("weekly_plan_preview_confirm", {
      action: "set_as_current",
    });

    gaEvent("key_weekly_plan_preview_confirm", {
      action: "set_as_current",
    });

    onConfirm();
  };

  return (
    <div className={classes.overlay} onClick={handleClose}>
      <div className={classes.modal} onClick={(e) => e.stopPropagation()}>
        <button className={classes.closeButton} onClick={handleClose}>
          ✕
        </button>

        <h3 className={classes.title}>Preview Weekly Plan</h3>

        {weekSummary && <p className={classes.summary}>{weekSummary}</p>}

        <div className={classes.daysScroll}>
          {days &&
            Object.entries(days).map(([dayKey, dayData]) => (
              <div
                key={dayKey}
                className={classes.dayCard}
                onMouseEnter={() => {
                  gaEvent("weekly_plan_preview_day_view", { day: dayKey });
                  gaEvent("key_weekly_plan_preview_day_view", { day: dayKey });
                }}
              >
                <div className={classes.dayHeader}>{dayKey}</div>

                {dayData.theme && (
                  <p className={classes.line}>
                    <span className={classes.label}>Theme:</span>{" "}
                    {dayData.theme}
                  </p>
                )}

                {dayData.focus && (
                  <p className={classes.line}>
                    <span className={classes.label}>Focus:</span>{" "}
                    {dayData.focus}
                  </p>
                )}

                {dayData.fitness?.title && (
                  <p className={classes.line}>
                    <span className={classes.label}>Fitness:</span>{" "}
                    {dayData.fitness.title}
                  </p>
                )}

                {dayData.mindfulness?.title && (
                  <p className={classes.line}>
                    <span className={classes.label}>Mindfulness:</span>{" "}
                    {dayData.mindfulness.title}
                  </p>
                )}

                {dayData.nourish?.title && (
                  <p className={classes.line}>
                    <span className={classes.label}>Nourish:</span>{" "}
                    {dayData.nourish.title}
                  </p>
                )}
              </div>
            ))}
        </div>

        <div className={classes.actionsRow}>
          <button className={classes.cancelButton} onClick={handleClose}>
            Cancel
          </button>

          <button className={classes.confirmButton} onClick={handleConfirm}>
            Set as Current Plan
          </button>
        </div>
      </div>
    </div>
  );
}
