import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Login from "../components/Auth/Login";

export default function LoginPage() {
  const router = useRouter();
  const [showMessage, setShowMessage] = useState(false);
  const fromReset = router.query.reset === "1";

  useEffect(() => {
    if (fromReset) {
      setShowMessage(true);
      const timer = setTimeout(() => setShowMessage(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [fromReset]);

  return (
    <>
      {showMessage && (
        <div
          style={{
            background: "#e6ffed",
            color: "#256029",
            padding: "1rem",
            textAlign: "center",
            borderRadius: "8px",
            marginBottom: "1rem",
          }}
        >
          ✅ Your password has been reset. Please log in.
        </div>
      )}
      <Login isOpen={true} onClose={() => router.push("/")} />
    </>
  );
}
