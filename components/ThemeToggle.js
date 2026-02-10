import { useContext, useEffect } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { gaEvent } from "../lib/gtag";

export default function ThemeToggle() {
  const { darkMode, setDarkMode } = useContext(ThemeContext);

  // ---- VIEW EVENT ----
  useEffect(() => {
    gaEvent("theme_toggle_view");
    gaEvent("key_theme_toggle_view");
  }, []);

  const toggle = () => {
    const newMode = darkMode ? "light" : "dark";

    gaEvent("theme_toggle_click", { newMode });
    gaEvent("key_theme_toggle_click", { newMode });

    setDarkMode(!darkMode);
  };

  return (
    <button onClick={toggle} style={{ margin: "10px" }}>
      {darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
    </button>
  );
}
