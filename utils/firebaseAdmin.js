import admin from "firebase-admin";

// Sanitize and validate private key
const rawKey = process.env.FIREBASE_PRIVATE_KEY;
const privateKey = rawKey ? rawKey.replace(/\\n/g, "\n") : undefined;

if (!admin.apps.length) {
  if (
    !privateKey ||
    !process.env.FIREBASE_PROJECT_ID ||
    !process.env.FIREBASE_CLIENT_EMAIL
  ) {
    throw new Error("Firebase Admin SDK ENV variables are missing or invalid.");
  }

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey,
    }),
  });
}

const firestore = admin.firestore();
const FieldValue = admin.firestore.FieldValue;

export { firestore, FieldValue, admin };
