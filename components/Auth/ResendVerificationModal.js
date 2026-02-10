import { useEffect } from "react";
import { gaEvent } from "../../lib/gtag";
import classes from "./ResendVerificationModal.module.css";

export default function ResendVerificationModal({
  message,
  email,
  onEmailChange,
  onSubmit,
  result,
  onClose,
}) {
  // 👉 Track when modal appears
  useEffect(() => {
    gaEvent("auth_verification_modal_view", { message });
  }, []); // fires only once when modal opens

  useEffect(() => {
    gaEvent("key_verification_modal_opened", { message });
  }, []);

  useEffect(() => {
    if (!result) return;
    if (result === "") return; // prevent firing on empty

    if (result.startsWith("✅")) {
      gaEvent("auth_verification_resend_success", { email });
    } else {
      gaEvent("auth_verification_resend_error", {
        email,
        message: result,
      });
    }
  }, [result, email]);

  return (
    <div className={classes.modalOverlay}>
      <div className={classes.modalContent}>
        <button
          onClick={() => {
            gaEvent("auth_verification_modal_close"); // 👉 ADD
            onClose();
          }}
          className={classes.closeButton}
        >
          ×
        </button>
        <h3>❌ {message}</h3>
        <form
          onSubmit={(e) => {
            gaEvent("auth_verification_resend_submit", {
              email,
            }); // 👉 ADD
            onSubmit(e);
          }}
          className={classes.form}
        >
          <input
            type="email"
            placeholder="Enter your email"
            required
            value={email}
            onChange={(e) => {
              gaEvent("auth_verification_email_input"); // 👉 ADD (fires once per change)
              onEmailChange(e);
            }}
            onFocus={() => gaEvent("auth_verification_email_focus")}
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
