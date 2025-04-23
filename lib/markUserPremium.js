import {
  doc,
  getDocs,
  query,
  where,
  collection,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";

// 🔍 Upgrade user by email
export async function markUserAsPremiumByEmail(email) {
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("email", "==", email));
  const snapshot = await getDocs(q);

  if (snapshot.empty) throw new Error("User not found");

  const userDoc = snapshot.docs[0];
  await updateDoc(userDoc.ref, {
    isPremium: true,
    upgradedAt: new Date().toISOString(),
  });
}
