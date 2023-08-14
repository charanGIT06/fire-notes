import { createContext, useContext, useEffect, useState } from "react";
import propTypes from "prop-types";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  ThemeProvider.propTypes = {
    children: propTypes.node.isRequired,
  };

  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const detectDeviceTheme = () => {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  }

  useEffect(() => {
    detectDeviceTheme();
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

const ThemeState = () => {
  return useContext(ThemeContext);
}

export default ThemeState;