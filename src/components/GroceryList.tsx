import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { PlusCircle, Trash2 } from "lucide-react";
import { GroceryItem } from "@/types";

interface GroceryListProps {
  items: GroceryItem[];
  onAddItem: (name: string) => void;
  onRemoveItem: (id: number) => void;
}

const GroceryList = ({ items, onAddItem, onRemoveItem }: GroceryListProps) => {
  const [newItemName, setNewItemName] = useState("");
  const [compareAll, setCompareAll] = useState(true);

  const handleAddItemClick = () => {
    onAddItem(newItemName);
    setNewItemName("");
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleAddItemClick();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Grocery List</CardTitle>
        <CardDescription>Add or remove items from your list.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="e.g., White Bread"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <Button aria-label="Add item" onClick={handleAddItemClick}>
              <PlusCircle className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Switch
              id="compare-all-switch"
              checked={compareAll}
              onCheckedChange={setCompareAll}
            />
            <Label
              htmlFor="compare-all-switch"
              className="text-sm cursor-pointer"
            >
              Compare All (Generic + Name Brand)
            </Label>
          </div>

          <div className="space-y-2 pt-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-2 rounded-md bg-secondary/50"
              >
                <span className="text-sm font-medium">{item.name}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Remove item"
                  onClick={() => onRemoveItem(item.id)}
                >
                  <Trash2 className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
            ))}
            {items.length === 0 && (
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