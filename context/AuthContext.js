import { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signOut,
  setPersistence,
  browserLocalPersistence,
  getAuth,
  reload,
} from "firebase/auth";
import { useRouter } from "next/router";
import { createUserDocIfNotExists } from "../utils/createUserDoc"; // ✅ update path
import { useUI } from "./UIContext"; // ✅ Modal control from UIContext
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const [loadingPremium, setLoadingPremium] = useState(true); // ✅ new
  const router = useRouter();
  const [justSignedUp, setJustSignedUp] = useState(false);
  const { openLogin } = useUI(); // ✅ control modal
  const auth = getAuth();

  const refreshUser = async () => {
    try {
      const currentUser = getAuth().currentUser;
      if (currentUser) {
        await currentUser.reload();
        setUser(getAuth().currentUser); // Do not spread with {...}
      }
    } catch (error) {
      console.error("Failed to refresh user:", error);
    }
  };
  

  useEffect(() => {
    console.log("🧠 AuthContext:", { user, loading });
  }, [user, loading]);

  // Initialize auth with persistence
  // Initialize auth with persistence
  useEffect(() => {
    let unsubscribe;

    const initializeAuth = async () => {
      try {
        await setPersistence(auth, browserLocalPersistence);

        unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
          setUser(firebaseUser);
          setLoading(false);

          if (firebaseUser && firebaseUser.uid) {
            await createUserDocIfNotExists(firebaseUser); // 👈 Add this
            try {
              const docRef = doc(db, "users", firebaseUser.uid);
              const docSnap = await getDoc(docRef);

              if (docSnap.exists()) {
                setIsPremium(docSnap.data().isPremium || false);
              } else {
                console.warn("⚠️ User document not found in Firestore.");
                setIsPremium(false);
              }
            } catch (err) {
              console.error("❌ Failed to fetch user data:", err.message);
              setIsPremium(false);
            }
          } else {
            setIsPremium(false);
          }

          setLoadingPremium(false); // ✅ also set it false on logout
        });
      } catch (error) {
        console.error("🔥 Persistence error:", error.message);
      }
    };

    initializeAuth();

    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe(); // ✅ safe cleanup
      }
    };
  }, []);

  // Handle auth-based UI changes
  useEffect(() => {
    const isFresh = localStorage.getItem("justSignedUp") === "true";
    if (user && isFresh) {
      setToast(
        `🎉 Welcome, ${
          user.displayName || user.email?.split("@")[0] || "friend"
        }! 🌿`
      );
      setJustSignedUp(true);
  
      setTimeout(() => {
        setToast(null);
        localStorage.removeItem("justSignedUp");
      }, 3000);
    }
  }, [user]);
  

  // Route protection logic
  useEffect(() => {
    if (loading) return;

    const isPublic = ["/", "/signup", "/news", "/contact", "/reset-password"];
    const isPublicRoute = isPublic.some((path) =>
      router.pathname.startsWith(path)
    );

    if (user && router.pathname === "/login") {
      router.replace("/dashboard");
      return;
    }

    if (!user && !isPublicRoute) {
      openLogin();
      if (router.pathname !== "/") {
        router.replace("/");
      }
    }
  }, [user, loading, router.pathname]);

  // Auto logout after 60 minutes
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
      }, 24 * 60 * 60 * 1000); // 24 hours
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
    <AuthContext.Provider
      value={{
        user,
        loading,
        toast,
        justSignedUp,
        isPremium,
        loadingPremium,
        refreshUser,
      }}
    >
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
