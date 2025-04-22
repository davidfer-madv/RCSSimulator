import { createContext, ReactNode, useContext, useState, useEffect } from "react";
import {
  useQuery,
  useMutation,
  QueryClient
} from "@tanstack/react-query";
import { User as SelectUser, InsertUser } from "@shared/schema";
import { apiRequest, queryClient } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// Define the shape of our authentication context
type AuthContextType = {
  user: SelectUser | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: any;
  registerMutation: any;
  logoutMutation: any;
};

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: false,
  error: null,
  loginMutation: { isLoading: false },
  registerMutation: { isLoading: false },
  logoutMutation: { isLoading: false }
});

type LoginData = Pick<InsertUser, "username" | "password">;

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
        const response = await fetch('/api/user');
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

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginData) => {
      setIsLoading(true);
      const res = await apiRequest("POST", "/api/login", credentials);
      const userData = await res.json();
      setUser(userData);
      queryClient.setQueryData(["/api/user"], userData);
      return userData;
    },
    onSuccess: (userData: SelectUser) => {
      toast({
        title: "Login successful",
        description: `Welcome back, ${userData.name || userData.username}!`,
      });
      setIsLoading(false);
    },
    onError: (err: Error) => {
      setError(err);
      toast({
        title: "Login failed",
        description: err.message,
        variant: "destructive",
      });
      setIsLoading(false);
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: async (userData: InsertUser) => {
      try {
        console.log("Registering with data:", userData);
        setIsLoading(true);
        const res = await apiRequest("POST", "/api/register", userData);
        console.log("Registration response:", res);
        const newUser = await res.json();
        console.log("New user data:", newUser);
        setUser(newUser);
        queryClient.setQueryData(["/api/user"], newUser);
        return newUser;
      } catch (error) {
        console.error("Registration error:", error);
        throw error;
      }
    },
    onSuccess: (userData: SelectUser) => {
      console.log("Registration success:", userData);
      toast({
        title: "Registration successful",
        description: "Your account has been created successfully.",
      });
      setIsLoading(false);
    },
    onError: (err: any) => {
      console.error("Registration onError handler:", err);
      setError(err);
      toast({
        title: "Registration failed",
        description: err.message || "Failed to create account",
        variant: "destructive",
      });
      setIsLoading(false);
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      setIsLoading(true);
      await apiRequest("POST", "/api/logout");
      setUser(null);
      queryClient.setQueryData(["/api/user"], null);
    },
    onSuccess: () => {
      toast({
        title: "Logged out",
        description: "You have been logged out successfully.",
      });
      setIsLoading(false);
    },
    onError: (err: Error) => {
      setError(err);
      toast({
        title: "Logout failed",
        description: err.message,
        variant: "destructive",
      });
      setIsLoading(false);
    },
  });

  // The value passed to the provider
  const value = {
    user,
    isLoading,
    error,
    loginMutation,
    registerMutation,
    logoutMutation
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook for using the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
