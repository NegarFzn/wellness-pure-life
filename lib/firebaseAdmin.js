import admin from "firebase-admin";
import serviceAccount from "../serviceAccountKey.json"; // 🔐 your service account key

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore(); // Firestore instance
const auth = admin.auth(); // Auth if needed later

export { db, auth };
