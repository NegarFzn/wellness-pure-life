import bcrypt from "bcryptjs";
import { firestore } from "../../../utils/firebaseAdmin";
import admin from "firebase-admin";
import crypto from "crypto";
import { sendEmail } from "../../../utils/email";
import { createVerificationEmail } from "../../../emails/emailCreator";

const TOKEN_LIFETIME = 72 * 60 * 60 * 1000; // 72 hours

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

    const existingUser = await usersRef.where("email", "==", email).limit(1).get();
    if (!existingUser.empty) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationExpiresAt = new Date(Date.now() + TOKEN_LIFETIME);

    const userDocRef = await usersRef.add({
      name,
      email,
      password: hashedPassword,
      isPremium: false,
      isVerified: false,
      verificationToken,
      verificationExpiresAt,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    const { subject, body } = createVerificationEmail(name, verificationToken);
    await sendEmail(email, subject, body);

    return res.status(201).json({ message: "✅ Signup successful. Please verify your email." });
  } catch (err) {
    console.error("❌ Signup error:", err.stack || err.message);
    return res.status(500).json({ message: "Internal server error" });
  }
}
