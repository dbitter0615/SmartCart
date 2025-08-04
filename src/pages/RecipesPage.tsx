import React, { useState } from 'react';
import Header from '@/components/Header';
import { MadeWithDyad } from '@/components/made-with-dyad';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/contexts/SessionContext';
import { supabase } from '@/integrations/supabase/client';
import { showSuccess, showError, showLoading, dismissToast } from '@/utils/toast';
import { Recipe } from '@/types';
import { Loader2, Save } from 'lucide-react';

const RecipesPage = () => {
  const navigate = useNavigate();
  const { session, user } = useSession();

  const [recipeUrl, setRecipeUrl] = useState<string>('');
  const [extractedRecipe, setExtractedRecipe] = useState<Recipe | null>(null);
  const [isExtracting, setIsExtracting] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleExtractRecipe = async () => {
    if (!recipeUrl.trim()) {
      showError("Please enter a URL to extract a recipe.");
      return;
    }

    setIsExtracting(true);
    setExtractedRecipe(null);
    const loadingToastId = showLoading("Extracting recipe...");

    try {
      // Invoke the Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('extract-recipe', {
        body: { url: recipeUrl },
      });

      if (error) {
        throw error;
      }

      if (data) {
        setExtractedRecipe(data as Recipe);
        showSuccess("Recipe extracted successfully!");
      } else {
        showError("Failed to extract recipe. Please try another URL.");
      }
    } catch (error: any) {
      console.error("Error extracting recipe:", error);
      showError(`Error extracting recipe: ${error.message || "Unknown error"}`);
    } finally {
      setIsExtracting(false);
      dismissToast(loadingToastId);
    }
  };

  const handleSaveRecipe = async () => {
    if (!extractedRecipe || !user) {
      showError("No recipe to save or you are not logged in.");
      return;
    }

    setIsSaving(true);
    const loadingToastId = showLoading("Saving recipe...");

    try {
      const { error } = await supabase
        .from('recipes')
        .insert({
          user_id: user.id,
          url: extractedRecipe.url,
          title: extractedRecipe.title,
          ingredients: extractedRecipe.ingredients,
          instructions: extractedRecipe.instructions,
        });

      if (error) {
        throw error;
      }

      showSuccess("Recipe saved successfully!");
      setExtractedRecipe(null); // Clear the extracted recipe after saving
      setRecipeUrl(''); // Clear the URL input
    } catch (error: any) {
      console.error("Error saving recipe:", error);
      showError(`Failed to save recipe: ${error.message || "Unknown error"}`);
    } finally {
      setIsSaving(false);
      dismissToast(loadingToastId);
    }
  };

  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      <Header />
      <main className="p-4 md:p-8 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">My Recipes</h1>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Extract Recipe from URL</CardTitle>
            <CardDescription>Paste a recipe URL to get ingredients and instructions.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="e.g., https://www.allrecipes.com/recipe/..."
                value={recipeUrl}
                onChange={(e) => setRecipeUrl(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleExtractRecipe()}
                disabled={isExtracting}
              />
              <Button onClick={handleExtractRecipe} disabled={isExtracting}>
                {isExtracting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Extract
              </Button>
            </div>
          </CardContent>
        </Card>

        {extractedRecipe && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{extractedRecipe.title || "Extracted Recipe"}</CardTitle>
              <CardDescription>From: <a href={extractedRecipe.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{extractedRecipe.url}</a></CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Ingredients:</h3>
                  {extractedRecipe.ingredients && extractedRecipe.ingredients.length > 0 ? (
                    <ul className="list-disc list-inside space-y-1">
                      {extractedRecipe.ingredients.map((ingredient, index) => (
                        <li key={index}>{ingredient}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground">No ingredients found.</p>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Instructions:</h3>
                  {extractedRecipe.instructions ? (
                    <p className="whitespace-pre-wrap">{extractedRecipe.instructions}</p>
                  ) : (
                    <p className="text-muted-foreground">No instructions found.</p>
                  )}
                </div>
              </div>
              {session && (
                <Button onClick={handleSaveRecipe} disabled={isSaving} className="mt-6">
                  {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  Save Recipe
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {!session && (
          <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg h-96">
            <h2 className="text-xl font-semibold mb-2">
              No recipes saved yet!
            </h2>
            <p className="text-muted-foreground mb-4">
              This is where you'll find all your saved recipes.
            </p>
            <div className="mt-4 p-4 bg-secondary/50 rounded-lg border border-dashed">
              <p className="text-sm text-muted-foreground mb-2">
                Want to save your recipes or carts for later?
              </p>
              <Button onClick={handleLoginClick}>
                Login to save your SmartCart!
              </Button>
            </div>
          </div>
        )}

        {session && !extractedRecipe && (
          <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg h-96">
            <h2 className="text-xl font-semibold mb-2">
              Your saved recipes will appear here.
            </h2>
            <p className="text-muted-foreground">
              Extract a recipe above or add one manually.
            </p>
          </div>
        )}
      </main>
      <MadeWithDyad />
    </div>
  );
};

export default RecipesPage;