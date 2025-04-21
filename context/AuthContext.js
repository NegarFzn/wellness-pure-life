import { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signOut,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { auth } from "../lib/firebase";
import { useRouter } from "next/router";
import { useUI } from "./UIContext"; // ✅ Modal control from UIContext

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const router = useRouter();
  const [justSignedUp, setJustSignedUp] = useState(false);
  const { openLogin } = useUI(); // ✅ control modal

  useEffect(() => {
    console.log("🧠 AuthContext:", { user, loading });
  }, [user, loading]);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // ✅ Ensure persistence is set before any auth check
        await setPersistence(auth, browserLocalPersistence);

        // ✅ Listen for auth changes
        onAuthStateChanged(auth, (firebaseUser) => {
          setUser(firebaseUser);
          setLoading(false);
        });
      } catch (error) {
        console.error("🔥 Auth init error:", error.message);
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // 🔁 Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      const isFresh = localStorage.getItem("justSignedUp") === "true"; // ✅ read here too
      console.log("👤 Auth state changed:", firebaseUser);
      setUser(firebaseUser);
      setJustSignedUp(isFresh); // ✅ this line matters most

      if (firebaseUser) {
        setToast(`🎉 Welcome, ${firebaseUser.email.split("@")[0]}! 🌿`);
        setTimeout(() => setToast(null), 3000);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 🚫 Redirect to login if trying to access a protected route
  useEffect(() => {
    if (loading) return;

    const isPublic = [
      "/",
      "/login",
      "/signup",
      "/news",
      "/contact",
      "/reset-password",
    ].some((path) => router.pathname.startsWith(path));

    if (!user && !isPublic) {
      openLogin(); // ✅ Trigger modal
      router.push("/"); // ✅ Safe fallback
    }
  }, [user, loading, router.pathname]);

  // 🕒 Auto logout after 60 minutes of inactivity
  useEffect(() => {
    if (!user) return;

    let timeout;
    const logoutTimer = () => {
      clearTimeout(timeout);
      timeout = setTimeout(async () => {
        try {
          await signOut(auth);
          console.log("⏳ Auto-logout due to inactivity");
        } catch (err) {
          console.error("Auto logout failed:", err);
        }
      }, 60 * 60 * 1000); // 1 hour
    };

    window.addEventListener("mousemove", logoutTimer);
    window.addEventListener("keydown", logoutTimer);
    logoutTimer();

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("mousemove", logoutTimer);
      window.removeEventListener("keydown", logoutTimer);
    };
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, loading, toast, justSignedUp }}>
      {!loading && (
        <>
          {toast && (
            <div
              style={{
                position: "fixed",
                top: 20,
                right: 20,
                background: "#4CAF50",
                color: "white",
                padding: "12px 20px",
                borderRadius: "10px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                zIndex: 9999,
                fontSize: "0.95rem",
              }}
            >
              {toast}
            </div>
          )}
          {children}
        </>
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
