import classes from "./ResendVerificationModal.module.css";

export default function ResendVerificationModal({
  message,
  email,
  onEmailChange,
  onSubmit,
  result,
  onClose,
}) {
  return (
    <div className={classes.modalOverlay}>
      <div className={classes.modalContent}>
        <button onClick={onClose} className={classes.closeButton}>
          ×
        </button>
        <h3>❌ {message}</h3>
        <form onSubmit={onSubmit} className={classes.form}>
          <input
            type="email"
            placeholder="Enter your email"
            required
            value={email}
            onChange={onEmailChange}
            className={classes.input}
          />
          <button
            type="submit"
            className={`${classes.button} ${
              result?.startsWith("✅") ? classes.buttonSuccess : ""
            }`}
          >
            <span className={classes.flexCenter}>
              {result?.startsWith("✅")
                ? "✅ Sent!"
                : "Resend Verification Email"}
            </span>
          </button>
        </form>
        {result && (
          <p
            className={`${classes.result} ${
              result.startsWith("✅") ? classes.success : classes.error
            }`}
          >
            <span className={classes.flexCenter}>{result}</span>
          </p>
        )}
      </div>
    </div>
  );
}
