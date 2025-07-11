"use client"

import type * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import type { EstimateItem } from "@/lib/api-mock"

interface EstimateSummaryProps {
  estimateItems: EstimateItem[]
  onUpdateHours: (productId: string, hours: number) => void
  onRemoveItem: (productId: string) => void
}

export function EstimateSummary({ estimateItems, onUpdateHours, onRemoveItem }: EstimateSummaryProps) {
  const handleHoursChange = (productId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const hours = Number.parseInt(value, 10)
    if (!isNaN(hours) && hours >= 0) {
      onUpdateHours(productId, hours)
    } else if (value === "") {
      onUpdateHours(productId, 0) // Allow empty string temporarily for user input
    }
  }

  return (
    <Card className="flex flex-col flex-grow">
      {" "}
      {/* Removed h-full, relying on flex-grow */}
      <CardHeader>
        <CardTitle>Estimate Summary</CardTitle>
        <CardDescription>Review and adjust your selected products.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto p-0">
        {" "}
        {/* flex-1 and overflow-auto */}
        {estimateItems.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No items in estimate. Add products from the left panel.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead className="w-[100px] text-right">Hours</TableHead>
                <TableHead className="w-[120px] text-right">Subtotal</TableHead>
                <TableHead className="w-[60px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {estimateItems.map((item) => (
                <TableRow key={item.productId}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="text-right">
                    <Input
                      type="number"
                      value={item.hours}
                      onChange={(e) => handleHoursChange(item.productId, e)}
                      className="w-20 text-right"
                      min="0"
                    />
                  </TableCell>
                  <TableCell className="text-right">€{item.subtotal.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onRemoveItem(item.productId)}
                      className="h-8 w-8"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Remove {item.name}</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
