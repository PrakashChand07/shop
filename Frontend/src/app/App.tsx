import { RouterProvider } from "react-router";
import { router } from "./routes.tsx";
import { useEffect } from "react";
import "./lib/suppressRechartsWarnings";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "./components/ui/sonner";

export default function App() {
  useEffect(() => {
    document.title = "TijarahPro - Accounting & Billing Software";
  }, []);

  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster />
    </AuthProvider>
  );
}