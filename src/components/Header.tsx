import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "@/contexts/SessionContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, Link } from "react-router-dom"; // Import Link

const Header = () => {
  const { session, isLoading, profile } = useSession();
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
      <nav className="flex items-center gap-4">
        <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
          Grocery List
        </Link>
        <Link to="/recipes" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
          Recipes
        </Link>
        {!isLoading && (
          session ? (
            <>
              <span className="text-sm text-muted-foreground hidden sm:inline">
                Hello, {profile?.first_name || "User"}!
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
      </nav>
    </header>
  );
};

export default Header;