import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import api from "../api/axios";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  company?: {
    id: string;
    name: string;
    industryType: 'pharmacy' | 'footwear';
  };
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string, companyName: string, industryType: string, phone: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const storedUser = localStorage.getItem("anjum_user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!localStorage.getItem("anjum_token");
  });



  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.success) {
        const userData = {
          id: response.data.data._id,
          name: response.data.data.name,
          email: response.data.data.email,
          role: response.data.data.role,
          company: response.data.data.company
        };
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem("anjum_user", JSON.stringify(userData));
        localStorage.setItem("anjum_token", response.data.data.token);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const signup = async (
    name: string,
    email: string,
    password: string,
    companyName: string,
    industryType: string,
    phone: string
  ): Promise<boolean> => {
    try {
      const response = await api.post('/company/register', {
        companyName,
        companyEmail: email, // Using same email for company
        industryType,
        phone,
        adminName: name,
        adminEmail: email,
        adminPassword: password
      });

      if (response.data.success) {
        // Automatically login after signup
        return await login(email, password);
      }
      return false;
    } catch (error) {
      console.error("Signup error:", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("anjum_user");
    localStorage.removeItem("anjum_token");
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
