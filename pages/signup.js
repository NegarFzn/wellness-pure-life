import { useEffect } from "react";
import Signup from "../components/Auth/Signup";
import { gaEvent } from "../lib/gtag"; // 👉 ADD THIS

export default function SignupPage() {
  useEffect(() => {
    gaEvent("auth_signup_page_view"); // 👉 PAGE VIEW
    gaEvent("auth_signup_modal_auto_open"); // 👉 OPTIONAL (recommended)
  }, []);

  return <Signup isOpen={true} onClose={() => window.history.back()} />;
}
