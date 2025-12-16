import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, signIn as supabaseSignIn, signUp as supabaseSignUp, signOut as supabaseSignOut } from './supabase';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, pass: string) => Promise<{ error: any }>;
  signUp: (email: string, pass: string) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if we are in "Mock Mode" (missing credentials)
  const isMockMode = true; // !import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL.includes('your_supabase_url');

  useEffect(() => {
    const initAuth = async () => {
      if (isMockMode) {
        // Load mock user from storage
        const storedUser = localStorage.getItem('truthguard_mock_user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } else {
        // Real Supabase Auth
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (_event, session) => {
            setUser(session?.user ?? null);
          }
        );
        return () => subscription.unsubscribe();
      }
      setLoading(false);
    };

    initAuth();
  }, [isMockMode]);

  const signIn = async (email: string, pass: string) => {
    if (isMockMode) {
      // Mock Login
      await new Promise(resolve => setTimeout(resolve, 0)); // Simulate delay
      if (email.includes('@')) {
        const mockUser: any = { id: 'mock-user-id', email };
        localStorage.setItem('truthguard_mock_user', JSON.stringify(mockUser));
        setUser(mockUser);
        return { error: null };
      }
      return { error: { message: "Invalid email" } };
    } else {
      return supabaseSignIn(email, pass);
    }
  };

  const signUp = async (email: string, pass: string) => {
    if (isMockMode) {
      // Mock Signup
      await new Promise(resolve => setTimeout(resolve, 0));
      const mockUser: any = { id: 'mock-user-id', email };
      localStorage.setItem('truthguard_mock_user', JSON.stringify(mockUser));
      setUser(mockUser);
      return { error: null };
    } else {
      return supabaseSignUp(email, pass);
    }
  };

  const signOut = async () => {
    if (isMockMode) {
      localStorage.removeItem('truthguard_mock_user');
      setUser(null);
      return { error: null };
    } else {
      return supabaseSignOut();
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};