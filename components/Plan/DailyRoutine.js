import { gaEvent } from "../../lib/gtag";
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
      <details
        className={classes.details}
        open
        onToggle={(e) => {
          const isOpen = e.target.open;

          gaEvent("daily_routine_toggle", {
            block,
            is_open: isOpen,
          });
          gaEvent("key_daily_routine_toggle", {
            block,
            is_open: isOpen,
          });

          if (isOpen) {
            gaEvent("daily_routine_block_view", { block });
            gaEvent("key_daily_routine_block_view", { block });
          }
        }}
      >
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
          <div
            className={classes.section}
            onMouseEnter={() => {
              gaEvent("daily_routine_theme_view", { block });
              gaEvent("key_daily_routine_theme_view", { block });
            }}
          >
            <h4 className={classes.sectionTitle}>✨ Theme</h4>
            <p className={classes.sectionText}>{data.theme}</p>
          </div>
        )}

        {/* --------------------- FOCUS --------------------- */}
        {data.focus && (
          <div
            className={classes.section}
            onMouseEnter={() => {
              gaEvent("daily_routine_focus_view", { block });
              gaEvent("key_daily_routine_focus_view", { block });
            }}
          >
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
              onClick={() => {
                gaEvent("daily_routine_mark_done", {
                  block,
                  new_value: !blockProgress?.done,
                });
                gaEvent("key_daily_routine_mark_done", {
                  block,
                  new_value: !blockProgress?.done,
                });

                toggleProgress(block, "done");
              }}
            >
              {blockProgress?.done ? "Done" : "Mark done"}
            </button>
          </div>

          <h5 className={classes.itemTitle}>{data.title}</h5>

          <p className={classes.sectionText}>{data.description}</p>

          {data.durationMinutes && (
            <span
              className={classes.durationBadge}
              onClick={() => {
                gaEvent("daily_routine_duration_view", {
                  block,
                  minutes: data.durationMinutes,
                });
                gaEvent("key_daily_routine_duration_view", {
                  block,
                  minutes: data.durationMinutes,
                });
              }}
            >
              ⏱ {data.durationMinutes} min
            </span>
          )}
        </div>

        {/* --------------------- POEM --------------------- */}
        {data.poem && (
          <div
            className={classes.quoteBox}
            onMouseEnter={() => {
              gaEvent("daily_routine_poem_view", { block });
              gaEvent("key_daily_routine_poem_view", { block });
            }}
          >
            <p className={classes.quoteText}>{data.poem}</p>
          </div>
        )}
      </details>
    </div>
  );
}
