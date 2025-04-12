// lib/firebase.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyCVILJvPLf_vnI2bZ_Q-f0FytX3yY_umig",
  authDomain: "wellnesspurelife-25a60.firebaseapp.com",
  projectId: "wellnesspurelife-25a60",
  appId: "1:687125148179:web:77922e4d895e41311785e6",
};

// ✅ Prevent duplicate initialization
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
