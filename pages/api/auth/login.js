import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { firestore } from "../../../utils/firebaseAdmin";

const JWT_SECRET = process.env.JWT_SECRET || "your_default_secret"; // ideally store in .env

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const usersRef = firestore.collection("users");
    const snapshot = await usersRef
      .where("email", "==", email.toLowerCase())
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const userDoc = snapshot.docs[0];
    const user = userDoc.data();

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!user.isVerified) {
      return res
        .status(403)
        .json({ message: "Please verify your email before logging in." });
    }

    const token = jwt.sign(
      {
        id: userDoc.id,
        email: user.email,
        name: user.name,
        isPremium: user.isPremium || false,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login failed. Please try again later." });
  }
}
