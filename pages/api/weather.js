import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  const city = req.query.city || "New York";
  const API_KEY = process.env.WEATHER_API_KEY;
  const API_URL = `http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${encodeURIComponent(
    city
  )}&aqi=no`;

  try {
    const response = await fetch(API_URL);
    const data = await response.json();

    if (!response.ok || !data || data.error) {
      throw new Error(data.error?.message || "Invalid API response");
    }

    // Save weather data locally
    const filePath = path.join(process.cwd(), "data", "weather.json");
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    res.status(200).json(data);
  } catch (error) {
    console.error("Weather API Error:", error.message);
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
}
