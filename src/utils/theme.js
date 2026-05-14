// Lightweight theme manager. Persists choice in localStorage; defaults to dark.

import { useEffect, useState } from "react";
import { storage } from "./storage.js";

const KEY = "theme";

export const getTheme = () => storage.get(KEY, "dark");

export const applyTheme = (theme) => {
  document.documentElement.setAttribute("data-theme", theme === "light" ? "light" : "dark");
  document.querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", theme === "light" ? "#f5f7fb" : "#07090f");
};

export const setTheme = (theme) => {
  storage.set(KEY, theme);
  applyTheme(theme);
};

export const useTheme = () => {
  const [theme, setT] = useState(getTheme());
  useEffect(() => { applyTheme(theme); }, [theme]);
  return [theme, (t) => { setTheme(t); setT(t); }];
};
