import React, { createContext, ReactNode, useContext, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiRequest, queryClient } from '../lib/queryClient';
import { InsertUser, User } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (credentials: { username: string; password: string }) => Promise<void>;
  register: (userData: InsertUser) => Promise<void>;
  logout: () => Promise<void>;
  error: Error | null;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  // Check if user is logged in
  const { isLoading } = useQuery<User>({
    queryKey: ['/api/user'],
    onSuccess: (data) => {
      setUser(data);
    },
    onError: () => {
      setUser(null);
    },
    retry: false,
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (credentials: { username: string; password: string }) => {
      const res = await apiRequest('POST', '/api/login', credentials);
      return await res.json();
    },
    onSuccess: (userData: User) => {
      setUser(userData);
      queryClient.setQueryData(['/api/user'], userData);
      toast({
        title: 'Login successful',
        description: `Welcome back, ${userData.name || userData.username}!`,
      });
    },
    onError: (err: Error) => {
      setError(err);
      toast({
        title: 'Login failed',
        description: err.message,
        variant: 'destructive',
      });
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: async (userData: InsertUser) => {
      const res = await apiRequest('POST', '/api/register', userData);
      return await res.json();
    },
    onSuccess: (userData: User) => {
      setUser(userData);
      queryClient.setQueryData(['/api/user'], userData);
      toast({
        title: 'Registration successful',
        description: 'Your account has been created successfully.',
      });
    },
    onError: (err: Error) => {
      setError(err);
      toast({
        title: 'Registration failed',
        description: err.message,
        variant: 'destructive',
      });
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest('POST', '/api/logout');
    },
    onSuccess: () => {
      setUser(null);
      queryClient.setQueryData(['/api/user'], null);
      toast({
        title: 'Logged out',
        description: 'You have been logged out successfully.',
      });
    },
    onError: (err: Error) => {
      setError(err);
      toast({
        title: 'Logout failed',
        description: err.message,
        variant: 'destructive',
      });
    },
  });

  const login = async (credentials: { username: string; password: string }) => {
    await loginMutation.mutateAsync(credentials);
  };

  const register = async (userData: InsertUser) => {
    await registerMutation.mutateAsync(userData);
  };

  const logout = async () => {
    await logoutMutation.mutateAsync();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}