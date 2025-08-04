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
        // No automatic redirect to login on sign out, user can stay on current page
      }
      // Removed the initial session redirect for unauthenticated users
    });

    return () => subscription.unsubscribe();
  }, [navigate, location.pathname]);

  // Keep this effect to redirect authenticated users away from the login page
  useEffect(() => {
    if (!isLoading && session && location.pathname === '/login') {
      navigate('/');
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