import { useMemo, useEffect, useState } from "react";
import { GroceryItem } from "@/types";
import { fetchProductPricesFromSupabase, stores } from "@/lib/data"; // Updated import path
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PriceComparisonProps {
  items: GroceryItem[];
}

interface ProcessedData {
  [itemName: string]: {
    [storeId: string]: {
      price: number;
      productName: string;
    };
  };
}

const PriceComparison = ({ items }: PriceComparisonProps) => {
  const [comparisonData, setComparisonData] = useState<ProductPrice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPrices = async () => {
      setIsLoading(true);
      const data = await fetchProductPricesFromSupabase(items);
      setComparisonData(data);
      setIsLoading(false);
    };
    loadPrices();
  }, [items]);

  const processedData: ProcessedData = useMemo(() => {
    const data: ProcessedData = {};
    items.forEach(item => {
      data[item.name] = {};
    });
    comparisonData.forEach(priceInfo => {
      if (data[priceInfo.itemName]) {
        data[priceInfo.itemName][priceInfo.storeId] = {
          price: priceInfo.price,
          productName: priceInfo.productName,
        };
      }
    });
    return data;
  }, [items, comparisonData]);

  const storeTotals = useMemo(() => {
    const totals: { [storeId: string]: number } = {};
    stores.forEach(store => totals[store.id] = 0);

    Object.values(processedData).forEach(itemPrices => {
      Object.entries(itemPrices).forEach(([storeId, priceInfo]) => {
        totals[storeId] += priceInfo.price;
      });
    });
    return totals;
  }, [processedData]);

  const cheapestStoreId = useMemo(() => {
    if (items.length === 0) return null;
    const validStoreTotals = Object.entries(storeTotals).filter(([, total]) => total > 0);
    if (validStoreTotals.length === 0) return null;

    return validStoreTotals.reduce((cheapest, [storeId, total]) => {
      if (total < storeTotals[cheapest]) {
        return storeId;
      }
      return cheapest;
    }, validStoreTotals[0][0]);
  }, [storeTotals, items]);

  if (isLoading) {
    return (
      <Card className="h-full flex items-center justify-center">
        <CardContent className="text-center">
          <p className="text-muted-foreground">Loading price comparisons...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Price Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-bold">Item</TableHead>
              {stores.map(store => (
                <TableHead key={store.id} className="text-right font-bold">{store.name}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map(item => {
              const itemPrices = processedData[item.name] || {};
              const pricesForThisItem = Object.values(itemPrices).map(p => p.price);
              const cheapestPrice = pricesForThisItem.length > 0 ? Math.min(...pricesForThisItem) : null;

              return (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  {stores.map(store => {
                    const priceInfo = itemPrices[store.id];
                    const isCheapest = priceInfo && cheapestPrice !== null && priceInfo.price === cheapestPrice;
                    return (
                      <TableCell key={store.id} className="text-right">
                        {priceInfo ? (
                          <div className={cn(isCheapest && "text-green-600 font-bold")}>
                            ${priceInfo.price.toFixed(2)}
                            <p className="text-xs text-muted-foreground truncate" title={priceInfo.productName}>{priceInfo.productName}</p>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
          <TableFooter>
            <TableRow className="bg-secondary/50">
              <TableCell className="font-bold text-lg">Total</TableCell>
              {stores.map(store => (
                <TableCell key={store.id} className="text-right font-bold text-lg">
                  <div className={cn(store.id === cheapestStoreId && "text-green-600")}>
                    ${storeTotals[store.id]?.toFixed(2)}
                    {store.id === cheapestStoreId && <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800">Cheapest</Badge>}
                  </div>
                </TableCell>
              ))}
            </TableRow>
          </TableFooter>
        </Table>
      </CardContent>
    </Card>
  );
};

export default PriceComparison;