import { useState } from "react";
import classes from "./DailyRoutine.module.css";

export default function DailyRoutine({ label, data }) {
  const [open, setOpen] = useState(false);

  if (!data) return null;

  return (
    <div className={classes.card}>
      {/* Header */}
      <button className={classes.header} onClick={() => setOpen(!open)}>
        <span className={classes.label}>{label}</span>
        <span className={classes.icon}>{open ? "−" : "+"}</span>
      </button>

      {/* Body */}
      {open && (
        <div className={classes.body}>
          {data.title && (
            <p className={classes.title}>
              <strong>{data.title}</strong>
            </p>
          )}

          {data.description && (
            <p className={classes.description}>{data.description}</p>
          )}

          {(data.durationMinutes || data.notes) && (
            <p className={classes.meta}>
              {data.durationMinutes
                ? `Duration: ${data.durationMinutes} minutes`
                : ""}
              {data.durationMinutes && data.notes ? " • " : ""}
              {data.notes || ""}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
