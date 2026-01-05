// components/Plan/DailyPreviewModal.js
import classes from "./DailyPreviewModal.module.css";

export default function DailyPreviewModal({ routine, onClose, onConfirm }) {
  if (!routine) return null;

  const daySummary = routine.daySummary || "";

  // ✅ SAFE NORMALIZATION (supports ALL shapes)
  const blocks =
    routine.blocks ||
    routine.dailyRoutine?.blocks ||
    routine.dailyRoutine ||
    routine;

  return (
    <div className={classes.overlay} onClick={onClose}>
      <div className={classes.modal} onClick={(e) => e.stopPropagation()}>
        <button className={classes.closeButton} onClick={onClose}>
          ✕
        </button>

        <h3 className={classes.title}>Preview Daily Routine</h3>
        {daySummary && <p className={classes.summary}>{daySummary}</p>}

        <div className={classes.daysScroll}>
          {blocks &&
            Object.entries(blocks).map(([periodKey, periodData]) => (
              <div key={periodKey} className={classes.dayCard}>
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
            ))}
        </div>

        <div className={classes.actionsRow}>
          <button className={classes.cancelButton} onClick={onClose}>
            Cancel
          </button>
          <button className={classes.confirmButton} onClick={onConfirm}>
            Set as Today’s Routine
          </button>
        </div>
      </div>
    </div>
  );
}
