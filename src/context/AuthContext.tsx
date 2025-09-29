"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ClubOwner } from '../types';
import { toast } from 'sonner';

type AuthContextValue = {
  user: ClubOwner | null;
  token: string | null;
  isLoading: boolean;
  isHydrating: boolean;
  hasStoredAuthData: boolean;
  login: (data: { email: string; password: string }) => Promise<void>;
  signup: (data: { name: string; email: string; phone: string; password: string; user_role: string }) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Avoid reading localStorage during render to prevent hydration mismatch.
  const [user, setUser] = useState<ClubOwner | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start with loading true
  const [isHydrating, setIsHydrating] = useState(true); // Track hydration state
  const [hasStoredAuthData, setHasStoredAuthData] = useState(false); // Track if we have stored auth data

  useEffect(() => {
    // Only save/remove user data after hydration is complete to prevent clearing stored data
    if (!isHydrating) {
      console.log('💾 AuthContext - Saving user to localStorage:', !!user);
      if (user) localStorage.setItem('clubOwner', JSON.stringify(user));
      else localStorage.removeItem('clubOwner');
    } else {
      console.log('⏳ AuthContext - Skipping localStorage user save during hydration');
    }
  }, [user, isHydrating]);

  useEffect(() => {
    // Only save/remove token after hydration is complete to prevent clearing stored data
    if (!isHydrating) {
      console.log('💾 AuthContext - Saving token to localStorage:', !!token);
      if (token) {
        localStorage.setItem('authToken', token);
      } else {
        localStorage.removeItem('authToken');
      }
    } else {
      console.log('⏳ AuthContext - Skipping localStorage token save during hydration');
    }
  }, [token, isHydrating]);

  // On mount, hydrate auth state from localStorage (client-only) and refresh profile from backend
  useEffect(() => {
    (async () => {
      try {
        console.log('🔄 AuthContext - Starting hydration process...');

        const storedToken = localStorage.getItem('authToken');
        const storedUser = localStorage.getItem('clubOwner');

        console.log('🔍 AuthContext - Checking localStorage:');
        console.log('   - authToken exists:', !!storedToken);
        console.log('   - clubOwner exists:', !!storedUser);

        if (storedToken) {
          console.log('   - authToken length:', storedToken.length);
          console.log('   - authToken preview:', storedToken.substring(0, 20) + '...');
        }

        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            console.log('   - clubOwner parsed successfully:', !!parsedUser);
            console.log('   - clubOwner email:', parsedUser.email);
          } catch (parseError) {
            console.error('   - clubOwner parse error:', parseError);
          }
        }

        if (storedToken && storedUser) {
          // Set initial state from localStorage immediately
          setToken(storedToken);
          setUser(JSON.parse(storedUser) as ClubOwner);
          setHasStoredAuthData(true); // Mark that we have stored auth data
          console.log('✅ AuthContext - Initial state restored from localStorage');

          try {
            // Add timeout to prevent hanging
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

            console.log('🌐 AuthContext - Making API call to /api/auth/me');
            const res = await fetch('/api/auth/me', {
              headers: { Authorization: `Bearer ${storedToken}` },
              signal: controller.signal
            });
            clearTimeout(timeoutId);
            console.log('📡 AuthContext - /api/auth/me response status:', res.status);

            if (res.ok) {
              const body = await res.json();
              const u = body?.data?.user;
              if (u) {
                console.log('✅ AuthContext - User refreshed from backend');
                setUser({
                  id: u.id,
                  name: u.name || '',
                  email: u.email || '',
                  phone: u.phone || '',
                  date_of_birth: u.date_of_birth || null,
                  gender: u.gender || null,
                  profile_image_url: u.profile_image_url || null,
                  user_role: u.user_role || 'owner',
                  is_trainer: u.is_trainer || false,
                  is_verified: u.is_verified || false,
                  is_active: u.is_active ?? true,
                  join_date: u.join_date || new Date().toISOString(),
                  last_login: u.last_login || new Date().toISOString(),
                  created_at: u.created_at || new Date().toISOString(),
                  updated_at: u.updated_at || new Date().toISOString()
                });
              } else {
                console.log('AuthContext - No user data in response, clearing auth state');
                // Backend didn't return user data, clear authentication
                setUser(null);
                setToken(null);
                setHasStoredAuthData(false); // Clear stored auth data flag
                localStorage.removeItem('authToken');
                localStorage.removeItem('clubOwner');
              }
            } else if (res.status === 401 || res.status === 403) {
              console.log('AuthContext - Token invalid/expired, clearing auth state');
              // Token is invalid, clear authentication
              setUser(null);
              setToken(null);
              setHasStoredAuthData(false); // Clear stored auth data flag
              localStorage.removeItem('authToken');
              localStorage.removeItem('clubOwner');
              toast.error('Session expired. Please log in again.');
            } else {
              console.log('AuthContext - Auth refresh failed with status:', res.status, 'keeping localStorage data');
              // For other errors (network issues, server errors), keep the localStorage data
              // This allows offline functionality and prevents logout on temporary issues
              // Don't clear hasStoredAuthData here so user can continue using the app
            }
          } catch (fetchError) {
            if (fetchError instanceof Error && fetchError.name === 'AbortError') {
              console.log('AuthContext - Auth refresh timed out, keeping localStorage data');
            } else {
              console.error('AuthContext - Network error during auth refresh:', fetchError);
            }
            // Network error or timeout, keep localStorage data for offline functionality
            // Don't clear hasStoredAuthData so user can continue using the app
            console.log('AuthContext - Keeping localStorage data due to network error/timeout');
          }
        } else {
          console.log('❌ AuthContext - No stored auth data found in localStorage');
          console.log('   - This means user needs to login again');
          // No stored data, ensure clean state
          setUser(null);
          setToken(null);
          setHasStoredAuthData(false); // Ensure flag is false
        }
      } catch (error) {
        console.error('💥 AuthContext - Error during hydration:', error);
        // Clear everything on hydration error
        setUser(null);
        setToken(null);
        localStorage.removeItem('authToken');
        localStorage.removeItem('clubOwner');
      } finally {
        // Always set loading states to false when hydration is complete
        setIsLoading(false);
        setIsHydrating(false);
        console.log('🏁 AuthContext - Hydration complete');
        console.log('   - isHydrating:', false);
        console.log('   - hasStoredAuthData:', hasStoredAuthData);
        console.log('   - user exists:', !!user);
        console.log('   - token exists:', !!token);
      }
    })();
  }, []);

  const login = async (data: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      console.log('🔐 AuthContext - Starting login for:', data.email);
      const res = await fetch('/api/auth/login', { method: 'POST', body: JSON.stringify({ ...data, device_name: 'web' }) });
      const body = await res.json();
      console.log('📡 AuthContext - Login response:', { status: res.status, ok: res.ok, hasToken: !!body?.data?.token });

      if (res.ok && body?.data?.token) {
        const t = body.data.token;
        const u = body.data.user;
        console.log('✅ AuthContext - Login successful');
        console.log('   - Token received (length):', t.length);
        console.log('   - User received:', { id: u.id, email: u.email, name: u.name });

        setToken(t);
        console.log('💾 AuthContext - Token stored in state');

        // Force localStorage save immediately
        localStorage.setItem('authToken', t);
        console.log('💾 AuthContext - Token saved to localStorage');

        setUser({
          id: u.id,
          name: u.name || u.email || '',
          email: u.email || '',
          phone: u.phone || '',
          date_of_birth: u.date_of_birth || null,
          gender: u.gender || null,
          profile_image_url: u.profile_image_url || null,
          user_role: u.user_role || 'owner',
          is_trainer: u.is_trainer || false,
          is_verified: u.is_verified || false,
          is_active: u.is_active ?? true,
          join_date: u.join_date || new Date().toISOString(),
          last_login: u.last_login || new Date().toISOString(),
          created_at: u.created_at || new Date().toISOString(),
          updated_at: u.updated_at || new Date().toISOString()
        });
        console.log('💾 AuthContext - User data saved to state and localStorage');

        toast.success(`Welcome ${u.name || u.email}`);
      } else {
        console.log('❌ AuthContext - Login failed:', body?.message || 'Unknown error');
        toast.error(body?.message || 'Login failed');
      }
    } catch (e) {
      toast.error('Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (data: { name: string; email: string; phone: string; password: string; user_role: string }) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/register', { method: 'POST', body: JSON.stringify({ ...data, password_confirmation: data.password }) });
      const body = await res.json();
      if (res.ok && body?.data?.token) {
        const t = body.data.token;
        const u = body.data.user;
        setToken(t);
        setUser({
          id: u.id,
          name: u.name || '',
          email: u.email || '',
          phone: u.phone || '',
          date_of_birth: u.date_of_birth || null,
          gender: u.gender || null,
          profile_image_url: u.profile_image_url || null,
          user_role: u.user_role || 'owner',
          is_trainer: u.is_trainer || false,
          is_verified: u.is_verified || false,
          is_active: u.is_active ?? true,
          join_date: u.join_date || new Date().toISOString(),
          last_login: u.last_login || new Date().toISOString(),
          created_at: u.created_at || new Date().toISOString(),
          updated_at: u.updated_at || new Date().toISOString()
        });
        toast.success(`Welcome ${u.name}`);
      } else {
        toast.error(body?.message || 'Signup failed');
      }
    } catch (e) {
      toast.error('Signup failed');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    if (token) fetch('/api/auth/logout', { method: 'POST', headers: { Authorization: `Bearer ${token}` } }).catch(() => {});
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('clubOwner');
    localStorage.removeItem('clubData');
    localStorage.removeItem('clubNotifications');
    localStorage.removeItem('clubFinancialData');
    localStorage.removeItem('clubEvents');
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, isHydrating, hasStoredAuthData, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
