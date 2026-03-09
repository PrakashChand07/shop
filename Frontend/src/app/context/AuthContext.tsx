import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is already logged in on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("anjum_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Get stored users
    const storedUsers = localStorage.getItem("anjum_users");
    const users = storedUsers ? JSON.parse(storedUsers) : [];

    // Find user
    const foundUser = users.find(
      (u: any) => u.email === email && u.password === password
    );

    if (foundUser) {
      const userData: User = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role || "Admin",
      };
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem("anjum_user", JSON.stringify(userData));
      return true;
    }

    // Default demo login
    if (email === "admin@anjumfootwear.com" && password === "admin123") {
      const demoUser: User = {
        id: "demo-001",
        name: "Admin User",
        email: "admin@anjumfootwear.com",
        role: "Admin",
      };
      setUser(demoUser);
      setIsAuthenticated(true);
      localStorage.setItem("anjum_user", JSON.stringify(demoUser));
      return true;
    }

    return false;
  };

  const signup = async (
    name: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Get existing users
    const storedUsers = localStorage.getItem("anjum_users");
    const users = storedUsers ? JSON.parse(storedUsers) : [];

    // Check if email already exists
    if (users.find((u: any) => u.email === email)) {
      return false;
    }

    // Create new user
    const newUser = {
      id: `user-${Date.now()}`,
      name,
      email,
      password, // In production, this should be hashed
      role: "Admin",
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem("anjum_users", JSON.stringify(users));

    // Auto login after signup
    const userData: User = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    };
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem("anjum_user", JSON.stringify(userData));

    return true;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("anjum_user");
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
