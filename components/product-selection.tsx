"use client"
import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search, HelpCircle } from "lucide-react" // Import HelpCircle icon
import type { Product } from "@/lib/api-mock"
import { Skeleton } from "@/components/ui/skeleton"
import { HOURLY_RATE } from "@/lib/api-mock" // Import HOURLY_RATE
import { AddCustomProductDialog } from "./add-custom-product-dialog" // Import the new component
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip" // Import Tooltip components

interface ProductSelectionProps {
  products: Product[]
  onAddProduct: (product: Product) => void
  isLoading: boolean
  addedProductIds: Set<string>
  onUpdateProductDefaultHours: (productId: string, hours: number) => void
  onAddCustomProduct: (product: Product) => void // New prop for custom products
}

export function ProductSelection({
  products,
  onAddProduct,
  isLoading,
  addedProductIds,
  onUpdateProductDefaultHours,
  onAddCustomProduct, // Destructure new prop
}: ProductSelectionProps) {
  const [searchTerm, setSearchTerm] = React.useState("")

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Group products by category
  const groupedProducts = React.useMemo(() => {
    const groups: { [key: string]: Product[] } = {}
    filteredProducts.forEach((product) => {
      if (!groups[product.category]) {
        groups[product.category] = []
      }
      groups[product.category].push(product)
    })
    return groups
  }, [filteredProducts])

  const sortedCategories = React.useMemo(() => Object.keys(groupedProducts).sort(), [groupedProducts])

  const handleDefaultHoursChange = (productId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const hours = Number.parseInt(value, 10)
    // Only update if it's a valid number or empty string (to allow clearing)
    if (!isNaN(hours) && hours >= 0) {
      onUpdateProductDefaultHours(productId, hours)
    } else if (value === "") {
      onUpdateProductDefaultHours(productId, 0) // Treat empty as 0 hours
    }
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Product Library</CardTitle>
        <CardDescription>Select products to add to your estimate.</CardDescription>
        <div className="relative mt-4">
          <Label htmlFor="search-products" className="sr-only">
            Search products
          </Label>
          <Input
            id="search-products"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
        <div className="mt-4">
          <AddCustomProductDialog onAddCustomProduct={onAddCustomProduct} />
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto p-4 grid gap-4 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col space-y-3">
              <Skeleton className="h-[120px] w-full rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[80%]" />
                <Skeleton className="h-4 w-[60%]" />
              </div>
            </div>
          ))
        ) : filteredProducts.length === 0 ? (
          <p className="text-muted-foreground col-span-full text-center py-8">No products found.</p>
        ) : (
          <TooltipProvider delayDuration={0}>
            {" "}
            {/* Wrap with TooltipProvider */}
            {sortedCategories.map((category) => (
              <React.Fragment key={category}>
                <h3 className="text-lg font-semibold mt-4 mb-2 col-span-full">{category}</h3>
                {groupedProducts[category].map((product) => {
                  const isAdded = addedProductIds.has(product.id)
                  return (
                    <Card key={product.id} className="flex flex-col">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {" "}
                            {/* Flex container for title and icon */}
                            <CardTitle className="text-lg">{product.name}</CardTitle>
                            {product.description && ( // Conditionally render icon if description exists
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-6 w-6">
                                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                                    <span className="sr-only">Show description for {product.name}</span>
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs">
                                  <p>{product.description}</p>
                                </TooltipContent>
                              </Tooltip>
                            )}
                          </div>
                          <Badge variant="secondary">{product.category}</Badge>
                        </div>
                        <CardDescription className="text-sm">€{HOURLY_RATE} / hour</CardDescription>
                      </CardHeader>
                      <CardContent className="flex-1 flex flex-col sm:flex-row items-end sm:items-center justify-end gap-2 pt-0">
                        <div className="relative flex items-center">
                          <Label htmlFor={`hours-${product.id}`} className="sr-only">
                            Default hours
                          </Label>
                          <Input
                            id={`hours-${product.id}`}
                            type="number"
                            value={product.defaultHours}
                            onChange={(e) => handleDefaultHoursChange(product.id, e)}
                            className="w-20 h-9 text-right pr-6" // Adjusted width and added padding-right
                            min="0"
                            aria-label={`Default hours for ${product.name}`}
                          />
                          <span className="absolute right-2 text-muted-foreground text-sm">h</span>
                        </div>
                        <Button
                          className="bg-[rgba(255,255,121,1)] text-[rgba(35,35,35,1)] hover:bg-[rgba(220,220,100,1)]"
                          onClick={() => onAddProduct(product)}
                          size="sm"
                          disabled={isAdded}
                          variant={isAdded ? "outline" : "default"}
                        >
                          {isAdded ? "Added" : "Add to Estimate"}
                        </Button>
                      </CardContent>
                    </Card>
                  )
                })}
              </React.Fragment>
            ))}
          </TooltipProvider>
        )}
      </CardContent>
    </Card>
  )
}
