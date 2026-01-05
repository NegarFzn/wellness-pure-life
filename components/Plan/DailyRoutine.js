import classes from "./DailyRoutine.module.css";

export default function DailyRoutine({
  block,
  data,
  blockProgress,
  toggleProgress,
}) {
  if (!data) return null;

  const moodClass = data.moodColor
    ? classes["mood_" + data.moodColor.toLowerCase()]
    : "";

  return (
    <div className={`${classes.dayCard} ${moodClass}`}>
      <details className={classes.details} open>
        <summary className={classes.dayHeader}>
          <span className={classes.dayCircle}>{block?.charAt(0) || "D"}</span>

          <div className={classes.dayLabelWrap}>
            <span className={classes.dayLabel}>{block}</span>
          </div>
        </summary>

        {/* --------------------- COACH TIP --------------------- */}
        {data.mentorTip && (
          <div className={classes.mentorBox}>
            <strong>Coach tip:</strong> {data.mentorTip}
          </div>
        )}

        {/* --------------------- THEME --------------------- */}
        {data.theme && (
          <div className={classes.section}>
            <h4 className={classes.sectionTitle}>✨ Theme</h4>
            <p className={classes.sectionText}>{data.theme}</p>
          </div>
        )}

        {/* --------------------- FOCUS --------------------- */}
        {data.focus && (
          <div className={classes.section}>
            <h4 className={classes.sectionTitle}>🎯 Focus</h4>
            <p className={classes.sectionText}>{data.focus}</p>
          </div>
        )}

        {/* --------------------- MAIN ROUTINE BLOCK --------------------- */}
        <div className={`${classes.section} ${classes[block?.toLowerCase()]}`}>
          <div className={classes.sectionHeader}>
            <h4 className={classes.sectionTitle}>{block}</h4>
            <button
              type="button"
              className={`${classes.checkButton} ${
                blockProgress?.done ? classes.checkOn : ""
              }`}
              onClick={() => toggleProgress(block, "done")}
            >
              {blockProgress?.done ? "Done" : "Mark done"}
            </button>
          </div>

          <h5 className={classes.itemTitle}>{data.title}</h5>

          <p className={classes.sectionText}>{data.description}</p>

          {data.durationMinutes && (
            <span className={classes.durationBadge}>
              ⏱ {data.durationMinutes} min
            </span>
          )}
        </div>

    
        {/* --------------------- POEM --------------------- */}
        {data.poem && (
          <div className={classes.quoteBox}>
            <p className={classes.quoteText}>{data.poem}</p>
          </div>
        )}
      </details>
    </div>
  );
}
