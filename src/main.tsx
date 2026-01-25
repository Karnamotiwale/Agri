import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import { AppProvider } from "./context/AppContext";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "sonner";
import "./styles/index.css";
import "./i18n/config";

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <AppProvider>
      <App />
      <Toaster
        position="top-center"
        richColors
        closeButton
        duration={3000}
        toastOptions={{
          style: {
            borderRadius: '12px',
          },
        }}
      />
    </AppProvider>
  </AuthProvider>
);
