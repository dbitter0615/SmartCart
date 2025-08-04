import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();

    if (!url) {
      return new Response(JSON.stringify({ error: 'URL is required' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    // --- MOCK RECIPE EXTRACTION ---
    // In a real application, you would fetch the URL and parse its content
    // using a library or a dedicated recipe parsing API.
    // For demonstration, we'll return a mock recipe based on the URL.
    console.log(`Attempting to extract recipe from: ${url}`);

    const mockRecipe = {
      title: `Mock Recipe from ${new URL(url).hostname}`,
      ingredients: [
        "1 cup flour",
        "1/2 cup sugar",
        "1 egg",
        "1/4 cup milk",
        "1 tsp baking powder",
      ],
      instructions: "Mix all ingredients. Bake at 350F for 30 minutes. Enjoy!",
      url: url,
    };

    return new Response(JSON.stringify(mockRecipe), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error("Error in extract-recipe function:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});