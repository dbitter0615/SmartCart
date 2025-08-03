import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PlusCircle, Trash2 } from "lucide-react";

// Placeholder data
const groceryItems = [
  { id: 1, name: "Organic Apples", quantity: 2 },
  { id: 2, name: "Whole Milk (1 Gallon)", quantity: 1 },
  { id: 3, name: "Sourdough Bread", quantity: 1 },
];

const GroceryList = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Grocery List</CardTitle>
        <CardDescription>Add items to start comparing prices.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input placeholder="e.g., Eggs" />
            <Button aria-label="Add item">
              <PlusCircle className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-2 pt-4">
            {groceryItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-2 rounded-md bg-secondary/50"
              >
                <span className="text-sm font-medium">
                  {item.name} (x{item.quantity})
                </span>
                <Button variant="ghost" size="icon" aria-label="Remove item">
                  <Trash2 className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
            ))}
            {groceryItems.length === 0 && (
              <p className="text-sm text-center text-muted-foreground pt-4">
                Your list is empty.
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GroceryList;