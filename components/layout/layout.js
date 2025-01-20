import { useState, useEffect } from "react";
import Header from "./header";
import Footer from "./footer";

const Layout = ({ children }) => {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    async function fetchWeather() {
      try {
        const response = await fetch("/api/weather?city=New York");
        const data = await response.json();

        if (!data || data.error) {
          throw new Error(data.error?.message || "Invalid API response");
        }

        setWeather(data);
      } catch (error) {
        console.error("Error fetching weather:", error.message);
      }
    }

    fetchWeather();
  }, []);

  return (
    <>
      <Header weather={weather} /> {/* ✅ Pass weather to Header */}
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default Layout;
