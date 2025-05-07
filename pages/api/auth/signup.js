import bcrypt from "bcryptjs";
import { firestore } from "../../../utils/firebaseAdmin";
import admin from "firebase-admin"; // for serverTimestamp()

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const name = req.body.name?.trim();
  const email = req.body.email?.trim().toLowerCase();
  const password = req.body.password?.trim();

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const usersRef = firestore.collection("users");

    const existingUser = await usersRef.where("email", "==", email).get();
    if (!existingUser.empty) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await usersRef.add({
      name,
      email,
      password: hashedPassword,
      isPremium: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error("❌ Signup error:", err.stack || err.message);
    return res.status(500).json({ message: "Internal server error" });
  }
}
