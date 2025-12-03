import { useState } from "react";
import classes from "./WeeklyPlan.module.css";

export default function WeeklyPlanDay({ day, content }) {
  const [open, setOpen] = useState(false);

  if (!content) return null; // Safety

  return (
    <div className={classes.card}>
      <button className={classes.header} onClick={() => setOpen(!open)}>
        <span className={classes.day}>{day}</span>
        <span className={classes.icon}>{open ? "−" : "+"}</span>
      </button>

      {open && (
        <div className={classes.body}>
          {/* THEME */}
          {content.theme && (
            <div className={classes.section}>
              <h4>Theme</h4>
              <p>{content.theme}</p>
            </div>
          )}

          {/* FOCUS */}
          {content.focus && (
            <div className={classes.section}>
              <h4>Focus</h4>
              <p>{content.focus}</p>
            </div>
          )}

          {/* FITNESS */}
          {content.fitness && (
            <div className={classes.section}>
              <h4>Fitness</h4>
              <p>
                <strong>{content.fitness.title}</strong>
              </p>
              <p>{content.fitness.description}</p>
              <p className={classes.meta}>
                Duration: {content.fitness.durationMinutes} min • Intensity:{" "}
                {content.fitness.intensity}
              </p>
            </div>
          )}

          {/* MINDFULNESS */}
          {content.mindfulness && (
            <div className={classes.section}>
              <h4>Mindfulness</h4>
              <p>
                <strong>{content.mindfulness.title}</strong>
              </p>
              <p>{content.mindfulness.description}</p>
              <p className={classes.meta}>
                Duration: {content.mindfulness.durationMinutes} min
              </p>
            </div>
          )}

          {/* NOURISH */}
          {content.nourish && (
            <div className={classes.section}>
              <h4>Nourish</h4>
              <p>
                <strong>{content.nourish.title}</strong>
              </p>
              <p>{content.nourish.description}</p>

              {/* Optional reminders */}
              {Array.isArray(content.nourish.reminders) &&
                content.nourish.reminders.length > 0 && (
                  <ul className={classes.list}>
                    {content.nourish.reminders.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                )}
            </div>
          )}

          {/* EVENING */}
          {content.evening && (
            <div className={classes.section}>
              <h4>Evening</h4>
              <p>
                <strong>{content.evening.title}</strong>
              </p>
              <p>{content.evening.description}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
