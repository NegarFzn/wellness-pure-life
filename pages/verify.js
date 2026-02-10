import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { gaEvent } from "../../lib/gtag";

export default function VerifyPage() {
  const router = useRouter();
  const { token, email } = router.query;

  const [status, setStatus] = useState("Verifying your email…");
  const [isError, setIsError] = useState(false);

  // PAGE VIEW ANALYTICS
  useEffect(() => {
    gaEvent("verify_page_view");
    gaEvent("key_verify_page_view");
  }, []);

  useEffect(() => {
    if (!token || !email) return;

    async function verify() {
      try {
        const res = await fetch(
          `/api/auth/emailverification?token=${token}&email=${email}`,
        );
        const data = await res.json();

        if (res.ok) {
          setStatus("Your email is verified!");
          setIsError(false);

          // SUCCESS ANALYTICS
          gaEvent("verify_success", { email });
          gaEvent("key_verify_success", { email });

          setTimeout(() => router.push("/login"), 1500);
        } else {
          setStatus(data.message || "Verification failed.");
          setIsError(true);

          // FAIL ANALYTICS
          gaEvent("verify_failed", { email, reason: data.message });
          gaEvent("key_verify_failed", { email, reason: data.message });
        }
      } catch (err) {
        setStatus("Server error. Please try again.");
        setIsError(true);

        // ERROR ANALYTICS
        gaEvent("verify_failed", { email, reason: "server_error" });
        gaEvent("key_verify_failed", { email, reason: "server_error" });
      }
    }

    verify();
  }, [token, email, router]);

  return (
    <div className="verify-container">
      <div className="verify-box">
        <div className="icon-wrapper">
          {isError ? (
            <div className="icon error">✖</div>
          ) : (
            <div className="icon success">✓</div>
          )}
        </div>

        <h2 className="title">
          {isError ? "Verification Issue" : "Email Verified"}
        </h2>

        <p className="message">{status}</p>

        {isError && (
          <button
            onClick={() => {
              gaEvent("verify_go_to_login_click");
              gaEvent("key_verify_go_to_login_click");
              router.push("/login");
            }}
            className="retry-btn"
          >
            Go to Login
          </button>
        )}
      </div>

      <style jsx>{`
        .verify-container {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 40px 20px;
          background: linear-gradient(135deg, #fafafa 0%, #f0f0ff 100%);
        }

        .verify-box {
          max-width: 420px;
          width: 100%;
          background: white;
          padding: 40px 32px;
          border-radius: 24px;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.06);
          text-align: center;
          border: 1px solid #eee;
        }

        .icon-wrapper {
          margin-bottom: 24px;
        }

        .icon {
          font-size: 54px;
          font-weight: bold;
        }

        .icon.success {
          color: #4f46e5;
          animation: pulse 1.5s infinite;
        }

        .icon.error {
          color: #e11d48;
        }

        .title {
          font-size: 24px;
          font-weight: 600;
          margin-bottom: 12px;
          color: #111827;
        }

        .message {
          font-size: 16px;
          line-height: 1.6;
          color: #4b5563;
        }

        .retry-btn {
          margin-top: 24px;
          background: #4f46e5;
          color: white;
          padding: 12px 26px;
          border-radius: 12px;
          border: none;
          cursor: pointer;
          font-size: 15px;
          font-weight: 600;
          transition: 0.25s ease;
        }

        .retry-btn:hover {
          background: #4338ca;
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 0.7;
          }
          50% {
            transform: scale(1.18);
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 0.7;
          }
        }
      `}</style>
    </div>
  );
}
