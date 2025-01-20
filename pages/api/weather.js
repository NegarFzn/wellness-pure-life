export default async function handler(req, res) {
  try {
    const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
    const city = req.query.city || "New York"; // Default to New York

    const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}&aqi=no`;

    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message);
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("Weather API Error:", error.message);
    res.status(500).json({ error: error.message });
  }
}
