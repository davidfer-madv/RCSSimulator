import { createContext, ReactNode, useContext, useState, useEffect } from "react";
import { User as SelectUser, InsertUser } from "@shared/schema";
import { apiRequest, queryClient } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// Login data type
type LoginData = Pick<InsertUser, "username" | "password">;

// Define the shape of our authentication context
type AuthContextType = {
  user: SelectUser | null;
  isLoading: boolean;
  error: Error | null;
  login: (credentials: LoginData) => Promise<void>;
  register: (userData: InsertUser) => Promise<void>;
  logout: () => Promise<void>;
};

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: false,
  error: null,
  login: async () => {},
  register: async () => {},
  logout: async () => {}
});

// Provider component that wraps app and makes auth object available
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SelectUser | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  // Fetch current user on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/user', { credentials: 'include' });
        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Login function
  const login = async (credentials: LoginData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Login failed');
      }
      
      const userData = await response.json();
      setUser(userData);
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${userData.name || userData.username}!`,
      });
    } catch (err: any) {
      setError(err);
      toast({
        title: "Login failed",
        description: err.message,
        variant: "destructive",
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (userData: InsertUser) => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log("Registering with data:", { ...userData, password: "***" });
      
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
        credentials: "include"
      });
      
      console.log("Registration response status:", response.status);
      
      if (!response.ok) {
        let errorMessage = "Registration failed";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (e) {
          try {
            const text = await response.text();
            if (text) errorMessage = text;
          } catch (e2) {
            // Ignore error
          }
        }
        throw new Error(errorMessage);
      }
      
      const newUser = await response.json();
      console.log("New user data:", { ...newUser, password: "***" });
      setUser(newUser);
      
      toast({
        title: "Registration successful",
        description: "Your account has been created successfully.",
      });
    } catch (err: any) {
      console.error("Registration error:", err);
      setError(err);
      toast({
        title: "Registration failed",
        description: err.message || "Failed to create account",
        variant: "destructive",
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Logout failed');
      }
      
      setUser(null);
      
      toast({
        title: "Logged out",
        description: "You have been logged out successfully.",
      });
    } catch (err: any) {
      setError(err);
      toast({
        title: "Logout failed",
        description: err.message,
        variant: "destructive",
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // The value passed to the provider
  const value: AuthContextType = {
    user,
    isLoading,
    error,
    login,
    register,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook for using the auth context
export function useAuth() {
  return useContext(AuthContext);
}
