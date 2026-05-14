import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { applyTheme, getTheme } from "./utils/theme.js";

applyTheme(getTheme());

const root = createRoot(document.getElementById("root"));
root.render(<App />);
