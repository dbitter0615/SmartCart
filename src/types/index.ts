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