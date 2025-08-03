import { useMemo } from "react";
import { GroceryItem } from "@/types";
import { fetchPriceComparisons, stores } from "@/data/mock";
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
  const comparisonData = useMemo(() => fetchPriceComparisons(items), [items]);

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
    return Object.entries(storeTotals).reduce((cheapest, [storeId, total]) => {
      if (total < storeTotals[cheapest]) {
        return storeId;
      }
      return cheapest;
    }, stores[0].id);
  }, [storeTotals, items]);

  const findCheapestPriceForItem = (itemPrices: ProcessedData[string]) => {
    if (!itemPrices || Object.keys(itemPrices).length === 0) return null;
    const prices = Object.values(itemPrices).map(p => p.price);
    return Math.min(...prices);
  };

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
              const cheapestPrice = findCheapestPriceForItem(itemPrices);
              return (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  {stores.map(store => {
                    const priceInfo = itemPrices[store.id];
                    const isCheapest = priceInfo && priceInfo.price === cheapestPrice;
                    return (
                      <TableCell key={store.id} className="text-right">
                        {priceInfo ? (
                          <div className={cn(isCheapest && "text-green-600 font-bold")}>
                            ${priceInfo.price.toFixed(2)}
                            <p className="text-xs text-muted-foreground truncate" title={priceInfo.productName}>{priceInfo.productName}</p>
                          </div>
                        ) : (
                          "-"
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