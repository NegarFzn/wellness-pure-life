import { getSession } from "next-auth/react";
import { firestore } from "../../utils/firebaseAdmin";

export default async function handler(req, res) {
  const session = await getSession({ req });
  const email = session?.user?.email;
  const category = req.query.category || "fitness";

  if (!email) return res.status(200).json({ show: true }); // Show for guests

  // 🔍 Find the document where email matches
  const querySnapshot = await firestore
    .collection("users")
    .where("email", "==", email)
    .limit(1)
    .get();

  if (querySnapshot.empty) {
    return res.status(404).json({ error: "User not found" });
  }

  const userDoc = querySnapshot.docs[0];
  const userRef = firestore.collection("users").doc(userDoc.id);
  const userData = userDoc.data();

  const fieldKey = `premiumDismissedAt_${category}`;

  if (req.method === "POST") {
    await userRef.set(
      {
        [fieldKey]: new Date().toISOString(),
      },
      { merge: true }
    );
    return res.status(200).json({ ok: true });
  }

  if (req.method === "GET") {
    const last = userData?.[fieldKey];
    const remindInDays = 3;

    const shouldShow =
      !last || new Date(last).getTime() + remindInDays * 86400000 < Date.now();

    return res.status(200).json({ show: shouldShow });
  }

  res.status(405).end(); // Unsupported method
}
