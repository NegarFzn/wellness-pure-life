import admin from "firebase-admin";
import serviceAccount from "../serviceAccountKey.json"; // 🔐 downloaded from Firebase Console

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();
const auth = admin.auth();

export { db, auth };
