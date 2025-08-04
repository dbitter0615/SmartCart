import React, { createContext, useContext, useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate, useLocation } from 'react-router-dom';
import { showSuccess, showError } from '@/utils/toast';

interface SessionContextType {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const getSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error getting session:", error);
        showError("Failed to retrieve session.");
      }
      setSession(session);
      setUser(session?.user || null);
      setIsLoading(false);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user || null);
      setIsLoading(false);

      if (_event === 'SIGNED_IN' || _event === 'USER_UPDATED') {
        showSuccess("Successfully logged in!");
        if (location.pathname === '/login') {
          navigate('/'); // Redirect to home if logged in and on login page
        }
      } else if (_event === 'SIGNED_OUT') {
        showSuccess("Successfully logged out!");
        navigate('/login'); // Redirect to login page if signed out
      } else if (_event === 'INITIAL_SESSION' && !session) {
        // If no initial session and not on login page, redirect to login
        if (location.pathname !== '/login') {
          navigate('/login');
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, location.pathname]);

  // Handle initial load and subsequent auth state changes for redirects
  useEffect(() => {
    if (!isLoading) {
      if (session && location.pathname === '/login') {
        navigate('/');
      } else if (!session && location.pathname !== '/login') {
        navigate('/login');
      }
    }
  }, [session, isLoading, location.pathname, navigate]);


  return (
    <SessionContext.Provider value={{ session, user, isLoading }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionContextProvider');
  }
  return context;
};