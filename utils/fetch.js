export async function fetchWeather(city = "New York") {
  try {
    const response = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
    const data = await response.json();

    if (!response.ok || !data || data.error) {
      throw new Error(data.error || "Invalid API response");
    }

    return data;
  } catch (error) {
    console.error("Error fetching weather:", error.message);
    return null; // Ensure the UI handles missing data
  }
}




export async function fetchNews() {
  try {
    const response = await fetch("/api/news");
    const data = await response.json();

    if (!data || data.error) {
      throw new Error(data.error || "Invalid API response");
    }

    return data;
  } catch (error) {
    console.error("Error fetching news:", error.message);
    return [];
  }
}
