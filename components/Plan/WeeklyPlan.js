import classes from "./WeeklyPlan.module.css";

export default function WeeklyPlan({
  day,
  data,
  dayProgress,
  toggleProgress,
  updatedAt,
}) {
  if (!data) return null;

  /* ---------------------------------------------------
     WEEK DATE HANDLING
  --------------------------------------------------- */
  const DAY_ORDER = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const moodColors = {
    red: "#FFEAEA",
    orange: "#FFF3E2",
    yellow: "#FFF9D9",
    green: "#E9FFE9",
    blue: "#E9F4FF",
    lavender: "#F4EDFF",
    pink: "#FFEAF3",
  };

  function getWeekDateForDay(updatedAt, dayName) {
    if (!updatedAt) return null;

    const base = new Date(updatedAt);
    const monday = new Date(base);

    const targetIndex = DAY_ORDER.indexOf(dayName);
    if (targetIndex === -1) return null;

    const d = new Date(monday);
    d.setDate(monday.getDate() + targetIndex);

    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  }

  const dateLabel = getWeekDateForDay(updatedAt, day);

  const moodClass = data.moodColor
    ? classes["mood_" + data.moodColor.toLowerCase()]
    : "";

  return (
    <div
      className={classes.dayCard}
      style={{
        backgroundColor: moodColors[data?.moodColor] || "#F8F8FF",
        transition: "background-color 0.3s ease",
      }}
    >
      <details className={classes.details} open>
        <summary className={classes.dayHeader}>
          <span className={classes.dayCircle}>{day.charAt(0)}</span>

          <div className={classes.dayLabelWrap}>
            <span className={classes.dayLabel}>{day}</span>
            {dateLabel && (
              <span className={classes.dateLabel}> • {dateLabel}</span>
            )}
          </div>
        </summary>

        {/* --------------------- COACH TIP --------------------- */}
        {data.mentorTip && (
          <div className={classes.mentorBox}>
            <strong>Coach tip:</strong> {data.mentorTip}
          </div>
        )}

        {/* --------------------- THEME --------------------- */}
        <div className={classes.section}>
          <h4 className={classes.sectionTitle}>✨ Theme</h4>
          <p className={classes.sectionText}>{data.theme}</p>
        </div>

        {/* --------------------- FOCUS --------------------- */}
        <div className={classes.section}>
          <h4 className={classes.sectionTitle}>🎯 Focus</h4>
          <p className={classes.sectionText}>{data.focus}</p>
        </div>

        {/* --------------------- FITNESS --------------------- */}
        <div className={`${classes.section} ${classes.fitness}`}>
          <div className={classes.sectionHeader}>
            <h4 className={classes.sectionTitle}>💪 Fitness</h4>
            <button
              type="button"
              className={`${classes.checkButton} ${
                dayProgress?.fitness ? classes.checkOn : ""
              }`}
              onClick={() => toggleProgress(day, "fitness")}
            >
              {dayProgress?.fitness ? "Done" : "Mark done"}
            </button>
          </div>

          <h5 className={classes.itemTitle}>{data.fitness?.title}</h5>

          <p className={classes.sectionText}>{data.fitness?.description}</p>

          <div className={classes.badges}>
            <span className={classes.durationBadge}>
              ⏱ {data.fitness?.durationMinutes} min
            </span>
            <span
              className={`${classes.intensityBadge} ${
                classes["intensity_" + data.fitness?.intensity]
              }`}
            >
              {data.fitness?.intensity}
            </span>
          </div>
        </div>

        {/* --------------------- MINDFULNESS --------------------- */}
        <div className={`${classes.section} ${classes.mindfulness}`}>
          <div className={classes.sectionHeader}>
            <h4 className={classes.sectionTitle}>🧘 Mindfulness</h4>
            <button
              type="button"
              className={`${classes.checkButton} ${
                dayProgress?.mindfulness ? classes.checkOn : ""
              }`}
              onClick={() => toggleProgress(day, "mindfulness")}
            >
              {dayProgress?.mindfulness ? "Done" : "Mark done"}
            </button>
          </div>

          <h5 className={classes.itemTitle}>{data.mindfulness?.title}</h5>

          <p className={classes.sectionText}>{data.mindfulness?.description}</p>

          <span className={classes.durationBadge}>
            ⏱ {data.mindfulness?.durationMinutes} min
          </span>
        </div>

        {/* --------------------- NOURISH --------------------- */}
        <div className={`${classes.section} ${classes.nourish}`}>
          <div className={classes.sectionHeader}>
            <h4 className={classes.sectionTitle}>🥗 Nourish</h4>
            <button
              type="button"
              className={`${classes.checkButton} ${
                dayProgress?.nourish ? classes.checkOn : ""
              }`}
              onClick={() => toggleProgress(day, "nourish")}
            >
              {dayProgress?.nourish ? "Done" : "Mark done"}
            </button>
          </div>

          <h5 className={classes.itemTitle}>{data.nourish?.title}</h5>

          <p className={classes.sectionText}>{data.nourish?.description}</p>

          {data.nourish?.reminders?.length > 0 && (
            <ul className={classes.list}>
              {data.nourish.reminders.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          )}
        </div>

        {/* --------------------- EVENING --------------------- */}
        <div className={`${classes.section} ${classes.evening}`}>
          <div className={classes.sectionHeader}>
            <h4 className={classes.sectionTitle}>🌙 Evening</h4>
            <button
              type="button"
              className={`${classes.checkButton} ${
                dayProgress?.evening ? classes.checkOn : ""
              }`}
              onClick={() => toggleProgress(day, "evening")}
            >
              {dayProgress?.evening ? "Done" : "Mark done"}
            </button>
          </div>

          <h5 className={classes.itemTitle}>{data.evening?.title}</h5>

          <p className={classes.sectionText}>{data.evening?.description}</p>
        </div>

        {/* --------------------- QUOTE --------------------- */}
        {(data.quote || data.quoteAuthor) && (
          <div className={classes.quoteBox}>
            {data.quote && <p className={classes.quoteText}>“{data.quote}”</p>}
            {data.quoteAuthor && (
              <p className={classes.quoteAuthor}>— {data.quoteAuthor}</p>
            )}
          </div>
        )}
      </details>
    </div>
  );
}
