import {
  getDocs,
  query,
  where,
  collection,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";

export async function markUserAsPremiumByEmail(email) {
  const normalizedEmail = email.toLowerCase();
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("email", "==", normalizedEmail));
  const snapshot = await getDocs(q);

  if (snapshot.empty) throw new Error("User not found in Firestore");

  const userDoc = snapshot.docs[0];

  await updateDoc(userDoc.ref, {
    isPremium: true,
    upgradedAt: new Date().toISOString(),
  });
}
