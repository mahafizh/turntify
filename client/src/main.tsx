import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { ClerkProvider } from "@clerk/clerk-react";
import { BrowserRouter } from "react-router";
import App from "./App.tsx";
import AuthProviders from "./providers/AuthProviders.tsx";
import { Toaster } from "sonner";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Add your Clerk Publishable Key to the .env file");
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <AuthProviders>
        <BrowserRouter>
          <App />
          <Toaster />
        </BrowserRouter>
      </AuthProviders>
    </ClerkProvider>
  </StrictMode>,
);
