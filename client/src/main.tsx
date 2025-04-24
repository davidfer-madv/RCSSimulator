import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./hooks/use-auth";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { RcsFormatterProvider } from "./context/rcs-formatter-context";

// Wrap the app in the QueryClientProvider, AuthProvider, and RcsFormatterProvider
createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <RcsFormatterProvider>
        <App />
      </RcsFormatterProvider>
    </AuthProvider>
  </QueryClientProvider>
);
