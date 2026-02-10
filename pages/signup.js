import { useEffect } from "react";
import Signup from "../components/Auth/Signup";
import { gaEvent } from "../lib/gtag";

export default function SignupPage() {
  useEffect(() => {
    // PAGE VIEW
    gaEvent("auth_signup_page_view");
    gaEvent("key_auth_signup_page_view");

    // AUTO OPEN MODAL
    gaEvent("auth_signup_modal_auto_open");
    gaEvent("key_auth_signup_modal_auto_open");
  }, []);

  const handleClose = () => {
    gaEvent("auth_signup_close_click");
    gaEvent("key_auth_signup_close_click");
    window.history.back();
  };

  return <Signup isOpen={true} onClose={handleClose} />;
}
