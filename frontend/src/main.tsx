import { loadPortfolioContent } from "./utils/portfolioApi";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./accessibility.css";

loadPortfolioContent().finally(() => createRoot(document.getElementById("root")!).render(<App />));
