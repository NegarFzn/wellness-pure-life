// components/Layout/Weather.js
import { useEffect, useState } from "react";
import { fetchWeather } from "../../utils/fetch";
import classes from "./weather.module.css"; // your compact CSS

export default function Weather() {
  const [weather, setWeather] = useState(null);
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    async function getWeather() {
      const data = await fetchWeather("New York");
      setWeather(data);
    }

    getWeather();

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

    return () => clearInterval(interval);
  }, []);

  if (!weather) return <p className={classes.weatherDetails}>Loading...</p>;

  return (
    <div
      className={classes.weatherMini}
      style={{
        backgroundColor: "#f2faf5",
        padding: "12px",
        borderRadius: "10px",
        boxShadow: " 0 2px 8px rgba(202, 223, 204, 0.6)",
        color: "#225c50",
        textAlign: "center",
      }}
    >
      <h3
        className={classes.weatherHeader}
        style={{
          fontSize: "15px",
          margin: "4px 0 6px 0",
          lineHeight: "1.2",
          fontWeight: 600,
        }}
      >
        Weather in {weather.location.name}
      </h3>
      <div className={classes.weatherRow}>🕒 {currentTime}</div>
      <div className={classes.weatherRow}>🌡️ {weather.current.temp_c}°C</div>
      <div className={classes.weatherRow}>
        🌤️ {weather.current.condition.text}
      </div>
      <div className={classes.weatherRow}>
        💨 {weather.current.wind_kph} km/h
      </div>
    </div>
  );
}
