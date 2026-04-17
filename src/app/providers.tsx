import React from "react";
import { AppProvider } from "../context/AppContext";
import { AuthProvider } from "../context/AuthContext";
import { FarmProvider } from "../context/FarmContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AppProvider>
        <FarmProvider>
          {children}
        </FarmProvider>
      </AppProvider>
    </AuthProvider>
  );
}
