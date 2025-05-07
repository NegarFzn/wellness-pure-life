import { doc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

export async function markUserAsPremiumByEmail(uid) {
  const userRef = doc(db, "users", uid); // ✅ now doc is defined

  await updateDoc(userRef, {
    isPremium: true,
    upgradedAt: new Date().toISOString(),
  });
}
