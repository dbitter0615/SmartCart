import Header from "@/components/Header";
import GroceryList from "@/components/GroceryList";
import { MadeWithDyad } from "@/components/made-with-dyad";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Index = () => {
  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      <Header />
      <main className="p-4 md:p-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <GroceryList />
          </div>
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Price Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg h-96">
                  <h2 className="text-xl font-semibold mb-2">
                    Your SmartCart is Empty
                  </h2>
                  <p className="text-muted-foreground">
                    Add items to your grocery list to see price comparisons from
                    your favorite stores.
                  </p>
                </div>
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