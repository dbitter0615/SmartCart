import { useState } from "react";
import Header from "@/components/Header";
import GroceryList from "@/components/GroceryList";
import { MadeWithDyad } from "@/components/made-with-dyad";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GroceryItem } from "@/types";

// Placeholder data
const initialGroceryItems: GroceryItem[] = [
  { id: 1, name: "Organic Apples" },
  { id: 2, name: "Whole Milk (1 Gallon)" },
  { id: 3, name: "Sourdough Bread" },
];

const Index = () => {
  const [items, setItems] = useState<GroceryItem[]>(initialGroceryItems);

  const handleAddItem = (itemName: string) => {
    if (itemName.trim() === "") return;
    const newItem: GroceryItem = {
      id: Date.now(),
      name: itemName.trim(),
    };
    setItems((prevItems) => [...prevItems, newItem]);
  };

  const handleRemoveItem = (id: number) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      <Header />
      <main className="p-4 md:p-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <GroceryList
              items={items}
              onAddItem={handleAddItem}
              onRemoveItem={handleRemoveItem}
            />
          </div>
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Price Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                {items.length > 0 ? (
                  <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg h-96">
                    <h2 className="text-xl font-semibold mb-2">
                      Ready to Compare!
                    </h2>
                    <p className="text-muted-foreground">
                      Price comparison results for your {items.length} item(s)
                      will appear here.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg h-96">
                    <h2 className="text-xl font-semibold mb-2">
                      Your SmartCart is Empty
                    </h2>
                    <p className="text-muted-foreground">
                      Add items to your grocery list to see price comparisons
                      from your favorite stores.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <MadeWithDyad />
    </div>
  );
};

export default Index;