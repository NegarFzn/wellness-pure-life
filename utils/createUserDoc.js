// utils/createUserDoc.js
import { setDoc, doc } from "firebase/firestore";
import { db } from "../lib/firebase"; // adjust if your firebase config is elsewhere

export async function createUserDocIfNotExists(user) {
  if (!user) return;

  const userRef = doc(db, "users", user.uid);
  await setDoc(
    userRef,
    {
      email: user.email,
      isPremium: false,
      createdAt: new Date().toISOString(),
    },
    { merge: true }
  );
}
