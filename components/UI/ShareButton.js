import { gaEvent } from "../../lib/gtag";
import classes from "./ShareButton.module.css";

export default function ShareButton({ url = "", title, text }) {
  const handleShare = async () => {
    gaEvent("share_button_click", {
      url: url || window.location.href,
      title: title || null,
    });

    try {
      if (navigator.share) {
        await navigator.share({
          title: title || "Wellness Plan",
          text:
            text ||
            "Check out this personalized wellness plan from Wellness Pure Life!",
          url: url || window.location.href,
        });
      } else {
        alert("Sharing is not supported on this browser.");
      }
    } catch (err) {
      console.warn("Share cancelled or failed:", err);
    }
  };

  return (
    <button
      className={`${classes.utilityButton} ${classes.shareButton}`}
      onClick={handleShare}
    >
      📤 Share Plan
    </button>
  );
}
