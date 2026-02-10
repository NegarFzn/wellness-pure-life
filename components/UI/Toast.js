import { useState } from "react";

export function useToast() {
  const [toast, setToast] = useState(null);

  const show = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  return { toast, show };
}

export default function Toast({ toast }) {
  if (!toast) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "30px",
        right: "30px",
        background: "#fff",
        padding: "14px 20px",
        borderRadius: "14px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        fontSize: "0.95rem",
        fontWeight: 500,
        zIndex: 3000,
        animation: "fadeIn 0.3s ease",
        borderLeft:
          toast.type === "success"
            ? "5px solid #4ade80"
            : "5px solid #f87171",
      }}
    >
      {toast.message}

      {/* Inline Keyframes */}
      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(12px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
}
