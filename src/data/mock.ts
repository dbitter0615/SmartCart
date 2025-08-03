import { Store, GroceryItem, ProductPrice } from "@/types";

export const stores: Store[] = [
  { id: "walmart", name: "Walmart", logo: "/placeholder.svg" },
  { id: "target", name: "Target", logo: "/placeholder.svg" },
  { id: "kroger", name: "Kroger", logo: "/placeholder.svg" },
];

// A simple function to generate a random price
const getRandomPrice = (base: number) => {
  return parseFloat((base + Math.random() * 1.5 - 0.75).toFixed(2));
};

// A simple mapping of generic names to potential brand names and base prices
// Added optional storeId to associate brands with specific stores
const productDatabase: { [key: string]: { brand: string; basePrice: number; storeId?: string }[] } = {
  "organic apples": [
    { brand: "Fresh Gala Apples", basePrice: 2.99 },
  ],
  "whole milk (1 gallon)": [
    { brand: "Great Value Milk", basePrice: 3.80, storeId: "walmart" }, // Walmart brand
    { brand: "Horizon Organic Milk", basePrice: 5.50 }, // Generic, available everywhere
  ],
  "sourdough bread": [
    { brand: "Bakery Fresh Sourdough", basePrice: 4.20 },
    { brand: "Pepperidge Farm Sourdough", basePrice: 4.80 },
  ],
  "white bread": [
    { brand: "WonderBread", basePrice: 2.80 },
    { brand: "Store Brand White Bread", basePrice: 2.20, storeId: "target" }, // Example: Target's store brand
  ],
  "eggs": [
    { brand: "Grade A Large Eggs", basePrice: 3.10 },
    { brand: "Organic Free-Range Eggs", basePrice: 5.20 },
  ],
};

export const fetchPriceComparisons = (items: GroceryItem[]): ProductPrice[] => {
  const results: ProductPrice[] = [];
  
  items.forEach(item => {
    const genericName = item.name.toLowerCase();
    const dbEntryKey = Object.keys(productDatabase).find(key => genericName.includes(key) || key.includes(genericName));
    const dbEntry = dbEntryKey ? productDatabase[dbEntryKey] : [{ brand: item.name, basePrice: Math.random() * 5 + 1 }];

    stores.forEach(store => {
      // Filter products to only include those available at the current store (or generic)
      const availableProducts = dbEntry.filter(product => 
        !product.storeId || product.storeId === store.id
      );

      if (availableProducts.length > 0) {
        // Pick a random product variant from the available ones for this store
        const productVariant = availableProducts[Math.floor(Math.random() * availableProducts.length)];
        results.push({
          itemName: item.name,
          storeId: store.id,
          price: getRandomPrice(productVariant.basePrice),
          productName: productVariant.brand,
        });
      } else {
        // If no specific product found for this store, simulate a generic item
        results.push({
          itemName: item.name,
          storeId: store.id,
          price: getRandomPrice(dbEntry[0].basePrice), // Use base price of first variant as fallback
          productName: `Generic ${item.name}`,
        });
      }
    });
  });

  return results;
};