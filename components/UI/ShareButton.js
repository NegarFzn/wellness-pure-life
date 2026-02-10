import { gaEvent } from "../../lib/gtag";
import { useEffect } from "react";
import classes from "./ShareButton.module.css";

export default function ShareButton({ url = "", title, text }) {
  // → View event (impression)
  useEffect(() => {
    gaEvent("share_button_view");
    gaEvent("key_share_button_view");
  }, []);

  const handleShare = async () => {
    const shareUrl = url || window.location.href;

    // → Click event
    gaEvent("share_button_click", { url: shareUrl, title: title || null });
    gaEvent("key_share_button_click", { url: shareUrl });

    try {
      if (navigator.share) {
        await navigator.share({
          title: title || "Wellness Plan",
          text:
            text ||
            "Check out this personalized wellness plan from Wellness Pure Life!",
          url: shareUrl,
        });

        gaEvent("share_button_success", { url: shareUrl });
        gaEvent("key_share_button_success");
      } else {
        gaEvent("share_button_fail", { reason: "unsupported_browser" });
        gaEvent("key_share_button_fail");
        alert("Sharing is not supported on this browser.");
      }
    } catch (err) {
      if (err?.name === "AbortError") {
        gaEvent("share_button_cancel");
        gaEvent("key_share_button_cancel");
      } else {
        gaEvent("share_button_fail", { error: err?.message });
        gaEvent("key_share_button_fail");
      }
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
