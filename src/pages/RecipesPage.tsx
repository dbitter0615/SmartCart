import React from 'react';
import Header from '@/components/Header';
import { MadeWithDyad } from '@/components/made-with-dyad';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/contexts/SessionContext';

const RecipesPage = () => {
  const navigate = useNavigate();
  const { session } = useSession();

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      <Header />
      <main className="p-4 md:p-8 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">My Recipes</h1>
        <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg h-96">
          <h2 className="text-xl font-semibold mb-2">
            No recipes saved yet!
          </h2>
          <p className="text-muted-foreground mb-4">
            This is where you'll find all your saved recipes.
          </p>
          {!session && (
            <div className="mt-4 p-4 bg-secondary/50 rounded-lg border border-dashed">
              <p className="text-sm text-muted-foreground mb-2">
                Want to save your recipes or carts for later?
              </p>
              <Button onClick={handleLoginClick}>
                Login to save your SmartCart!
              </Button>
            </div>
          )}
        </div>
      </main>
      <MadeWithDyad />
    </div>
  );
};

export default RecipesPage;