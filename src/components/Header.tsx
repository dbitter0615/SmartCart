import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "@/contexts/SessionContext"; // Import useSession
import { supabase } from "@/integrations/supabase/client"; // Import supabase client
import { useNavigate } from "react-router-dom"; // Import useNavigate

const Header = () => {
  const { session, isLoading, user } = useSession(); // Get session, loading state, and user
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <header className="flex items-center justify-between p-4 border-b bg-card">
      <div className="flex items-center gap-2">
        <ShoppingCart className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">SmartCart</h1>
      </div>
      <div className="flex items-center gap-4">
        {!isLoading && ( // Only render button when session loading is complete
          session ? (
            <>
              <span className="text-sm text-muted-foreground hidden sm:inline">
                {user?.email}
              </span>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <Button variant="outline" onClick={handleLoginClick}>
              Login
            </Button>
          )
        )}
      </div>
    </header>
  );
};

export default Header;