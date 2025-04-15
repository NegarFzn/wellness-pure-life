import { getFirestore } from "firebase/firestore";
import { app } from "../../lib/firebase";
import { getAuth } from "firebase-admin/auth";
import admin from "firebase-admin";
import serviceAccount from "../../serviceAccountKey.json";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { token, password } = req.body;
  const db = getFirestore(app);
  const doc = await db.collection("resetTokens").doc(token).get();

  if (!doc.exists || doc.data().expiresAt < Date.now()) {
    return res
      .status(400)
      .json({ message: "Token is invalid or has expired." });
  }

  const { email } = doc.data();
  const user = await admin.auth().getUserByEmail(email);
  await admin.auth().updateUser(user.uid, { password });
  await db.collection("resetTokens").doc(token).delete();

  return res.status(200).json({ message: "✅ Password successfully reset!" });
}
