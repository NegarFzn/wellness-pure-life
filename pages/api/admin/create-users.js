import bcrypt from "bcryptjs";
import { connectToDatabase } from "../../../utils/mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const users = [
    {
      name: "Fatih Yegenoglu",
      email: "fatih@example.com",
      password: "password123",
      isPremium: true,
    },
    {
      name: "John Doe",
      email: "john@example.com",
      password: "test456",
      isPremium: false,
    },
  ];

  try {
    const { db } = await connectToDatabase();
    const collection = db.collection("users");

    for (const user of users) {
      // Check if user exists
      const existing = await collection.findOne({ email: user.email });

      if (existing) {
        console.log(`⚠️ Skipped existing user: ${user.email}`);
        continue;
      }

      const hashedPassword = await bcrypt.hash(user.password, 12);

      await collection.insertOne({
        name: user.name,
        email: user.email,
        password: hashedPassword,
        isPremium: user.isPremium,
        createdAt: new Date().toISOString(),
      });

      console.log(`✅ Created user: ${user.email}`);
    }

    return res.status(200).json({ message: "Users created successfully." });
  } catch (err) {
    console.error("❌ Error creating users:", err.stack || err.message);
    return res.status(500).json({ message: "Internal server error" });
  }
}
