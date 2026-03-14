import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import Providers from "./app/providers.tsx";
import { Toaster } from "sonner";
import "./styles/index.css";
import "./i18n/config";

createRoot(document.getElementById("root")!).render(
  <Providers>
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
  </Providers>
);
