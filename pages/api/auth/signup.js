import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendEmail } from "../../../utils/email";
import { createVerificationEmail } from "../../../emails/emailCreator";
import { connectToDatabase } from "../../../utils/mongodb";

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
    const { db } = await connectToDatabase();
    const users = db.collection("users");

    /* ------------------------------------------
       1. CHECK IF USER ALREADY EXISTS
    ------------------------------------------- */
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    /* ------------------------------------------
       2. HASH PASSWORD + CREATE VERIFICATION TOKEN
    ------------------------------------------- */
    const hashedPassword = await bcrypt.hash(password, 12);
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationExpiresAt = new Date(Date.now() + TOKEN_LIFETIME);

    /* ------------------------------------------
       3. INSERT INTO MONGODB ONLY
          (No Firestore)
    ------------------------------------------- */
    await users.insertOne({
      name,
      email,
      password: hashedPassword,
      isPremium: false, // Default for NextAuth premium lookup
      isVerified: false, // Email verification flag
      verificationToken,
      verificationExpiresAt,
      createdAt: new Date(),
    });

    /* ------------------------------------------
       4. SEND VERIFICATION EMAIL
    ------------------------------------------- */
    const { subject, body } = createVerificationEmail(
      name,
      email,
      verificationToken,
    );

    await sendEmail(email, subject, body);

    return res.status(201).json({
      message: "Signup successful. Please verify your email.",
    });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}
