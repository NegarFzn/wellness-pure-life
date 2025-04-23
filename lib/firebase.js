import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";



// ✅ Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCVILJvPLf_vnI2bZ_Q-f0FytX3yY_umig",
  authDomain: "wellnesspurelife-25a60.firebaseapp.com",
  projectId: "wellnesspurelife-25a60",
  storageBucket: "wellnesspurelife-25a60.appspot.com",
  messagingSenderId: "687125148179",
  appId: "1:687125148179:web:77922e4d895e41311785e6",
};

// ✅ Initialize Firebase (singleton)
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// ✅ Auth instance only — persistence handled in AuthContext
const auth = getAuth(app);

// ✅ Firestore
const db = getFirestore(app);

// ✅ Set browser persistence safely (only runs client-side)
if (typeof window !== "undefined") {
  setPersistence(auth, browserLocalPersistence).catch((error) => {
    console.error("🔥 Auth persistence setup failed:", error.message);
  });
}



export { app, auth, db };
