// utils/createUserDoc.js
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";

export async function createUserDocIfNotExists(user) {
  if (!user?.uid) return;

  const userRef = doc(db, "users", user.uid);
  const docSnap = await getDoc(userRef);

  if (!docSnap.exists()) {
    await setDoc(
      userRef,
      {
        email: user.email,
        isPremium: false, // ❌ Start as not premium
        createdAt: serverTimestamp(), // ✅ real Firestore server timestamp
      },
      { merge: true } // ✅ IMPORTANT: merge means "update or create safely"
    );
  }
}
