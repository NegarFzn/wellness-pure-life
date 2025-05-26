export async function fetchWeather(city = "New York") {
  try {
    const response = await fetch(
      `/api/weather?city=${encodeURIComponent(city)}`
    );
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



export async function fetchNews({ forceRefresh = false } = {}) {
  try {
    const response = await fetch(`/api/news${forceRefresh ? '?refresh=true' : ''}`);
    const data = await response.json();

    if (!data || data.error) {
      throw new Error(data.error || "Invalid API response");
    }

    const normalizedData = data.map((article) => ({
      ...article,
      content:
        article.content?.trim() ||
        article.summary?.trim() ||
        "Full content is not available.",
    }));

    return normalizedData;
  } catch (error) {
    console.error("Error fetching news:", error.message);
    return [];
  }
}


