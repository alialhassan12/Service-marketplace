import { useState, useEffect } from "react";
import { ThemeContext } from "./useTheme.js";

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    // Initialize from localStorage or default to "dark"
    const savedTheme = localStorage.getItem("theme");
    return savedTheme === "light" || savedTheme === "dark"
      ? savedTheme
      : "dark";
  });

  useEffect(() => {
    // Apply theme to document root
    document.documentElement.setAttribute("data-theme", theme);
    // Update color-scheme for browser UI
    document.documentElement.style.colorScheme = theme;
    // Save to localStorage
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = (newTheme) => {
    if (newTheme === "dark" || newTheme === "light") {
      setTheme(newTheme);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme: toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
