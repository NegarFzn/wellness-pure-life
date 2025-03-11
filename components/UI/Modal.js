import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import classes from "./Modal.module.css";

const Modal = ({ onClose, children }) => {
  const [portalElement, setPortalElement] = useState(null);

  useEffect(() => {
    setPortalElement(document.getElementById("overlays"));
  }, []);

  if (!portalElement) {
    return null; // Prevents rendering until the portal is available
  }

  return createPortal(
    <div className={classes.backdrop} onClick={onClose}>
      <div className={classes.modal} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    portalElement
  );
};

export default Modal;
