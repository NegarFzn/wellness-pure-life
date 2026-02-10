import { useState, useEffect } from "react";
import Header from "./header";
import { gaEvent } from "../../lib/gtag";
import Footer from "./footer";

const Layout = ({ children }) => {
  const [weather, setWeather] = useState(null);

  // -------------------------------
  // WEATHER FETCH + ANALYTICS
  // -------------------------------
  useEffect(() => {
    async function fetchWeather() {
      try {
        const response = await fetch("/api/weather?city=New York");
        const data = await response.json();

        if (!data || data.error) {
          gaEvent("weather_fetch_error", {
            message: data?.error?.message || "Invalid API response",
          });
          gaEvent("key_weather_fetch_error");
          throw new Error(data.error?.message || "Invalid API response");
        }

        setWeather(data);

        // Success analytics
        gaEvent("weather_fetch_success", { city: "New York" });
        gaEvent("key_weather_fetch_success");

      } catch (error) {
        console.error("Error fetching weather:", error.message);

        gaEvent("weather_fetch_exception", {
          message: error.message,
        });

        gaEvent("key_weather_fetch_exception");
      }
    }

    fetchWeather();
  }, []);

  // -------------------------------
  // LAYOUT LOADED ANALYTICS
  // -------------------------------
  useEffect(() => {
    gaEvent("layout_loaded");
    gaEvent("key_layout_loaded");
  }, []);

  return (
    <>
      <Header weather={weather} />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default Layout;
