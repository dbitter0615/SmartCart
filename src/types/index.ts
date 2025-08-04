export interface GroceryItem {
  id: number;
  name: string;
}

export interface Store {
  id: string;
  name: string;
  logo: string; // URL to logo
}

export interface ProductPrice {
  itemName: string;
  storeId: string;
  price: number;
  productName: string; // e.g., "WonderBread Classic White"
}

export interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
}

export interface Recipe {
  id?: string; // Optional, as it might not exist until saved to DB
  created_at?: string; // Optional, as it might not exist until saved to DB
  user_id?: string | null; // Optional, and nullable for unsaved recipes
  url: string;
  title: string | null;
  ingredients: string[] | null;
  instructions: string | null;
}