import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { gaEvent } from "../../lib/gtag";
import classes from "./Modal.module.css";

const Modal = ({ onClose, children }) => {
  const [portalElement, setPortalElement] = useState(null);
  const mountedRef = useRef(false);

  // Mount + anomaly detection
  useEffect(() => {
    if (mountedRef.current) {
      gaEvent("modal_double_mount");
      gaEvent("key_modal_double_mount");
    }
    mountedRef.current = true;

    const el = document.getElementById("overlays");
    if (!el) {
      gaEvent("modal_missing_portal");
      gaEvent("key_modal_missing_portal");
    }

    setPortalElement(el);

    gaEvent("modal_open");
    gaEvent("key_modal_open");

    return () => {
      gaEvent("modal_unexpected_unmount");
      gaEvent("key_modal_unexpected_unmount");
    };
  }, []);

  // ESC key close
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") {
        gaEvent("modal_close_escape");
        gaEvent("key_modal_close_escape");
        onClose();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!portalElement) return null;

  return createPortal(
    <div
      className={classes.backdrop}
      onClick={() => {
        gaEvent("modal_close_backdrop");
        gaEvent("key_modal_close_backdrop");
        onClose();
      }}
    >
      <div className={classes.modal} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    portalElement,
  );
};

export default Modal;
