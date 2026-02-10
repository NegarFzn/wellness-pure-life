import { gaEvent } from "../../lib/gtag";
import classes from "./DailyPreviewModal.module.css";

export default function DailyPreviewModal({ routine, onClose, onConfirm }) {
  if (!routine) return null;

  // NORMAL + ANOMALY
  gaEvent("daily_routine_preview_open", {
    has_summary: !!routine.daySummary,
  });
  gaEvent("key_daily_routine_preview_open", {
    has_summary: !!routine.daySummary,
  });

  const daySummary = routine.daySummary || "";

  // SAFE NORMALIZATION
  const blocks =
    routine.blocks ||
    routine.dailyRoutine?.blocks ||
    routine.dailyRoutine ||
    routine;

  const handleClose = () => {
    // NORMAL + ANOMALY
    gaEvent("daily_routine_preview_close", {});
    gaEvent("key_daily_routine_preview_close", {});
    onClose();
  };

  return (
    <div className={classes.overlay} onClick={handleClose}>
      <div className={classes.modal} onClick={(e) => e.stopPropagation()}>
        <button className={classes.closeButton} onClick={handleClose}>
          ✕
        </button>

        <h3 className={classes.title}>Preview Daily Routine</h3>
        {daySummary && <p className={classes.summary}>{daySummary}</p>}

        <div className={classes.daysScroll}>
          {blocks &&
            Object.entries(blocks).map(([periodKey, periodData], index) => {
              // FIRE VIEW EVENTS FOR EACH BLOCK
              gaEvent("daily_routine_block_view", {
                period: periodKey,
                index,
              });
              gaEvent("key_daily_routine_block_view", {
                period: periodKey,
                index,
              });

              return (
                <div
                  key={periodKey}
                  className={classes.dayCard}
                  onClick={() => {
                    gaEvent("daily_routine_period_click", {
                      period: periodKey,
                      index,
                    });
                    gaEvent("key_daily_routine_period_click", {
                      period: periodKey,
                      index,
                    });
                  }}
                >
                  <div className={classes.dayHeader}>{periodKey}</div>

                  {periodData.theme && (
                    <p className={classes.line}>
                      <span className={classes.label}>Theme:</span>{" "}
                      {periodData.theme}
                    </p>
                  )}

                  {periodData.focus && (
                    <p className={classes.line}>
                      <span className={classes.label}>Focus:</span>{" "}
                      {periodData.focus}
                    </p>
                  )}

                  {periodData.fitness?.title && (
                    <p className={classes.line}>
                      <span className={classes.label}>Movement:</span>{" "}
                      {periodData.fitness.title}
                    </p>
                  )}

                  {periodData.mindfulness?.title && (
                    <p className={classes.line}>
                      <span className={classes.label}>Mindfulness:</span>{" "}
                      {periodData.mindfulness.title}
                    </p>
                  )}

                  {periodData.nourish?.title && (
                    <p className={classes.line}>
                      <span className={classes.label}>Nourish:</span>{" "}
                      {periodData.nourish.title}
                    </p>
                  )}
                </div>
              );
            })}
        </div>

        <div className={classes.actionsRow}>
          <button className={classes.cancelButton} onClick={handleClose}>
            Cancel
          </button>

          <button
            className={classes.confirmButton}
            onClick={() => {
              // NORMAL + ANOMALY
              gaEvent("daily_routine_preview_confirm", {
                action: "set_as_today",
              });
              gaEvent("key_daily_routine_preview_confirm", {
                action: "set_as_today",
              });

              onConfirm();
            }}
          >
            Set as Today’s Routine
          </button>
        </div>
      </div>
    </div>
  );
}
