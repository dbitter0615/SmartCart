import { Store, GroceryItem, ProductPrice } from "@/types";
import { supabase } from "@/integrations/supabase/client";

export const stores: Store[] = [
  { id: "walmart", name: "Walmart", logo: "/placeholder.svg" },
  { id: "target", name: "Target", logo: "/placeholder.svg" },
  { id: "kroger", name: "Kroger", logo: "/placeholder.svg" },
];

export const fetchProductPricesFromSupabase = async (items: GroceryItem[]): Promise<ProductPrice[]> => {
  if (items.length === 0) {
    return [];
  }

  const itemNames = items.map(item => item.name);

  const { data, error } = await supabase
    .from('product_prices')
    .select('*')
    .in('item_name', itemNames);

  if (error) {
    console.error("Error fetching product prices:", error);
    return [];
  }

  // Map Supabase data to ProductPrice interface
  return data.map(row => ({
    itemName: row.item_name,
    storeId: row.store_id,
    price: parseFloat(row.price), // Ensure price is a number
    productName: row.product_name,
  }));
};

// The mock function is no longer needed as we are fetching from Supabase
// export const fetchPriceComparisons = (items: GroceryItem[]): ProductPrice[] => { ... };