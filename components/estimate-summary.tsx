"use client"

import React from "react"

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
  const handleHoursChange = (productId: string, e: any) => {
    const value = e.target.value
    const hours = Number.parseInt(value, 10)
    if (!isNaN(hours) && hours >= 0) {
      onUpdateHours(productId, hours)
    } else if (value === "") {
      onUpdateHours(productId, 0) // Allow empty string temporarily for user input
    }
  }

  // Group estimate items by category and calculate subtotals
  const groupedEstimateItems = React.useMemo(() => {
    const groups: { [key: string]: { items: EstimateItem[]; totalHours: number; totalCost: number } } = {}
    estimateItems.forEach((item) => {
      if (!groups[item.category]) {
        groups[item.category] = { items: [], totalHours: 0, totalCost: 0 }
      }
      groups[item.category].items.push(item)
      groups[item.category].totalHours += item.hours
      groups[item.category].totalCost += item.subtotal
    })
    return groups
  }, [estimateItems])

  const sortedCategories = React.useMemo(() => Object.keys(groupedEstimateItems).sort(), [groupedEstimateItems])

  return (
    <Card className="flex flex-col flex-grow">
      <CardHeader>
        <CardTitle>Estimate Summary</CardTitle>
        <CardDescription>Review and adjust your selected products.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto p-0">
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
              {sortedCategories.map((category) => (
                <React.Fragment key={category}>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableCell colSpan={4} className="font-semibold text-left py-2">
                      <div className="flex justify-between items-center">
                        <span>{category}</span>
                        <span className="text-sm text-muted-foreground">
                          €{groupedEstimateItems[category].totalCost.toFixed(2)}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                  {groupedEstimateItems[category].items.map((item) => (
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
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
