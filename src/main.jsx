import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { LanguageProvider } from "./i18n/LanguageContext"
import { AdminProvider } from "./admin/AdminContext"
import "./index.css"
import App from "./App.jsx"

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AdminProvider>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </AdminProvider>
  </StrictMode>
)
