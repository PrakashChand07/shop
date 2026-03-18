import { RouterProvider } from "react-router";
import { router } from "./routes.tsx";
import { useEffect } from "react";
import "./lib/suppressRechartsWarnings";
import { AuthProvider } from "./context/AuthContext";
import { IndustryProvider } from "./context/IndustryContext";
import { Toaster } from "./components/ui/sonner";

export default function App() {
  useEffect(() => {
    document.title = "TijarahPro - Accounting & Billing Software";
  }, []);

  return (
    <AuthProvider>
      <IndustryProvider>
        <RouterProvider router={router} />
        <Toaster />
      </IndustryProvider>
    </AuthProvider>
  );
}