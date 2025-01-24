import { useState, useEffect } from "react";
import { fetchWeather } from "../../utils/fetch"; // Import fetch function
import classes from "./weather.module.css";

export default function Weather() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    async function getWeather() {
      const data = await fetchWeather("New York"); // Fetch from local API
      setWeather(data);
      setLoading(false);
    }

    getWeather();

    // Update time every second
    const interval = setInterval(() => {
      setCurrentTime(
        new Intl.DateTimeFormat("en-US", {
          timeZone: "America/New_York",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        }).format(new Date())
      );
    }, 1000);

    return () => clearInterval(interval); // Cleanup
  }, []);

  if (loading) return <p className={classes.weatherDetails}>⏳ Loading...</p>;
  if (!weather || !weather.location)
    return <p className={classes.weatherDetails}>⚠️ Error loading weather</p>;

  return (
    <div className={classes.weatherPage}>
      <h1 className={classes.weatherHeader}>
        Weather in {weather.location.name}
      </h1>
      <h2 className={classes.weatherTime}>🕰️ Current Time: {currentTime}</h2>

      <div className={classes.weatherInfo}>
        <p className={classes.weatherDetails}>🌡️ {weather.current.temp_c}°C</p>
        <p className={classes.weatherDetails}>
          🌥️ {weather.current.condition.text}
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
