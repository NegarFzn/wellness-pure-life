import { useState, useEffect } from "react";
import classes from './weather.module.css';

export default function Weather() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    async function fetchWeather() {
      try {
        // Fetch New York weather
        const response = await fetch("/api/weather?city=New York");
        const data = await response.json();

        if (!data || data.error) {
          throw new Error(data.error?.message || "Invalid API response");
        }

        setWeather(data);
      } catch (error) {
        console.error("Error fetching weather:", error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchWeather();

    // Update the time every second
    const interval = setInterval(() => {
      const newYorkTime = new Intl.DateTimeFormat("en-US", {
        timeZone: "America/New_York",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true, // Show AM/PM
      }).format(new Date());

      setCurrentTime(newYorkTime);
    }, 1000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  if (loading) return <p>Loading weather...</p>;
  if (!weather || !weather.location) return <p>Error loading weather data</p>;

  return (
    <div className={classes.weatherPage}>
      <h1 className={classes.weatherHeader}>
        Weather in {weather.location.name}
      </h1>
      <h2 className={classes.weatherTime}>🕰️ Current Time: {currentTime}</h2>

      <div className={classes.weatherInfo}>
        <p className={classes.weatherDetails}>
          🌡️ Temperature: {weather.current.temp_c}°C
        </p>
        <p className={classes.weatherDetails}>
          🌥️ Condition: {weather.current.condition.text}
        </p>
        <img
          className={classes.weatherIcon}
          src={weather.current.condition.icon}
          alt="Weather icon"
        />
        <p className={classes.weatherDetails}>
          💨 Wind Speed: {weather.current.wind_kph} km/h
        </p>
      </div>
    </div>
  );
}
