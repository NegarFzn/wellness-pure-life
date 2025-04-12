import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useRouter } from "next/router";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        setToast(`🎉 Welcome, ${firebaseUser.email.split("@")[0]}! 🌿`);
        setTimeout(() => setToast(null), 3000);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const publicRoutes = [
      "/",
      "/login",
      "/signup",
      "/contact",
      "/weather",
      "/news",
    ];
    if (!loading && !user && !publicRoutes.includes(router.pathname)) {
      router.push("/login");
    }
  }, [user, loading, router.pathname]);

  useEffect(() => {
    if (!user) return;

    let timeout;
    const logoutTimer = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        signOut(auth);
      }, 1 * 60 * 1000); // 30 mins of inactivity
    };

    window.addEventListener("mousemove", logoutTimer);
    window.addEventListener("keydown", logoutTimer);
    logoutTimer(); // start the timer

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("mousemove", logoutTimer);
      window.removeEventListener("keydown", logoutTimer);
    };
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, loading, toast }}>
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
