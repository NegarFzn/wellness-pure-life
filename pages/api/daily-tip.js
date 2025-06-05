// pages/api/daily-tip.js

import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { connectToDatabase } from "../../utils/mongodb";
import mongoose from "mongoose";

// Define schema
const WellnessTipSchema = new mongoose.Schema({
  index: Number,
  quote: String,
});

// Reuse model if it already exists
const WellnessTip =
  mongoose.models.WellnessTip ||
  mongoose.model("WellnessTip", WellnessTipSchema);

export default async function handler(req, res) {
  // Authenticate session
  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user?.isPremium) {
    return res.status(403).json({ error: "Premium access required" });
  }

  try {
    // Connect to MongoDB
    await connectToDatabase();

    // Determine current day of the year
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 0);
    const diff = now - startOfYear;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);

    // Count total tips in DB
    const tipCount = await WellnessTip.countDocuments();
    console.log("Tip count:", tipCount);
    if (tipCount === 0) {
      return res.status(404).json({ error: "No tips available in database" });
    }

    // Calculate index and fetch tip
    const tipIndex = dayOfYear % tipCount;
    console.log("Today's tip index:", tipIndex);
    const tipDoc = await WellnessTip.findOne({ index: tipIndex });
    console.log("TipDoc:", tipDoc);

    if (!tipDoc) {
      return res.status(404).json({ error: "Tip not found" });
    }

    res.status(200).json({ tip: tipDoc.quote });
  } catch (error) {
    console.error("Error fetching tip:", error);
    res.status(500).json({ error: "Failed to fetch wellness tip" });
  }
}
