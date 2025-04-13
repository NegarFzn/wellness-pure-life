import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { app } from "./firebase";

const db = getFirestore(app);

export async function saveSubscriber({ email, name }) {
  const q = query(collection(db, "subscribers"), where("email", "==", email));
  const snapshot = await getDocs(q);

  if (!snapshot.empty) {
    return { success: false, message: "already subscribed" };
  }

  await addDoc(collection(db, "subscribers"), {
    email,
    name,
    subscribedAt: new Date(),
  });

  return { success: true };
}
