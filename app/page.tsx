"use client"

import * as React from "react"
import {
  type Product,
  type EstimateItem,
  fetchProductsFromHubSpot,
  sendEstimateToHubSpot,
  HOURLY_RATE,
} from "@/lib/api-mock"
import { ProductSelection } from "@/components/product-selection"
import { EstimateSummary } from "@/components/estimate-summary"
import { GrandTotalDisplay } from "@/components/grand-total-display"
import { SendToHubSpotButton } from "@/components/send-to-hubspot-button"
import { useToast } from "@/hooks/use-toast"

export default function ProjectCostEstimator() {
  const [availableProducts, setAvailableProducts] = React.useState<Product[]>([])
  const [estimateItems, setEstimateItems] = React.useState<EstimateItem[]>([])
  const [isFetchingProducts, setIsFetchingProducts] = React.useState(true)
  const [isSendingEstimate, setIsSendingEstimate] = React.useState(false)
  const { toast } = useToast()

  React.useEffect(() => {
    const loadAllProducts = async () => {
      setIsFetchingProducts(true)
      try {
        const mockProducts = await fetchProductsFromHubSpot()
        setAvailableProducts(mockProducts)
      } catch (error) {
        console.error("Failed to fetch products:", error)
        toast({
          title: "Error",
          description: "Failed to load products. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsFetchingProducts(false)
      }
    }
    loadAllProducts()
  }, [toast])

  const addProductToEstimate = (product: Product) => {
    setEstimateItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.productId === product.id)
      if (existingItem) {
        toast({
          title: "Product already added",
          description: `${product.name} is already in your estimate.`,
          variant: "default",
        })
        return prevItems
      }
      const newHours = product.defaultHours > 0 ? product.defaultHours : 1 // Ensure at least 1 hour if default is 0 or less
      return [
        ...prevItems,
        {
          productId: product.id,
          name: product.name,
          category: product.category,
          hours: newHours,
          subtotal: HOURLY_RATE * newHours, // Use fixed hourly rate
        },
      ]
    })
    toast({
      title: "Product Added",
      description: `${product.name} added to estimate.`,
    })
  }

  const updateEstimateItemHours = (productId: string, hours: number) => {
    setEstimateItems((prevItems) =>
      prevItems.map(
        (item) => (item.productId === productId ? { ...item, hours: hours, subtotal: HOURLY_RATE * hours } : item), // Use fixed hourly rate
      ),
    )
  }

  const updateProductDefaultHours = (productId: string, newHours: number) => {
    setAvailableProducts((prevProducts) => {
      const updatedProducts = prevProducts.map((product) =>
        product.id === productId ? { ...product, defaultHours: newHours } : product,
      )
      return updatedProducts
    })
  }

  const removeEstimateItem = (productId: string) => {
    setEstimateItems((prevItems) => prevItems.filter((item) => item.productId !== productId))
    toast({
      title: "Product Removed",
      description: "Item removed from estimate.",
    })
  }

  const handleAddCustomProduct = (newProduct: Product) => {
    setAvailableProducts((prevProducts) => {
      const updatedProducts = [...prevProducts, newProduct]
      return updatedProducts
    })
    // Automatically add the newly created custom product to the estimate
    addProductToEstimate(newProduct)
  }

  // New handler for products suggested by AI
  const handleAddProductsFromAI = (aiProducts: Product[]) => {
    aiProducts.forEach((product) => {
      // Treat AI-suggested products like custom products, adding them to availableProducts
      // and then to the estimate. The `handleAddCustomProduct` already does this.
      handleAddCustomProduct(product)
    })
  }

  const grandTotal = estimateItems.reduce((sum, item) => sum + item.subtotal, 0)

  const handleSendToHubSpot = async () => {
    setIsSendingEstimate(true)
    try {
      const result = await sendEstimateToHubSpot(estimateItems)
      if (result.success) {
        toast({
          title: "Success!",
          description: result.message,
          variant: "success",
        })
        setEstimateItems([]) // Clear estimate after successful submission
      } else {
        toast({
          title: "Submission Failed",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error sending estimate:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred while sending the estimate.",
        variant: "destructive",
      })
    } finally {
      setIsSendingEstimate(false)
    }
  }

  return (
    <div className="flex flex-1 flex-col p-4 md:p-6">
      <div className="grid gap-6 lg:grid-cols-3">
        {" "}
        {/* Changed to lg:grid-cols-3 */}
        <ProductSelection
          products={availableProducts}
          onAddProduct={addProductToEstimate}
          isLoading={isFetchingProducts}
          addedProductIds={new Set(estimateItems.map((item) => item.productId))}
          onUpdateProductDefaultHours={updateProductDefaultHours}
          onAddCustomProduct={handleAddCustomProduct}
          onAddProductsFromAI={handleAddProductsFromAI}
          className="lg:col-span-2"
        />
        <div className="flex flex-col lg:col-span-1">
          {" "}
          {/* Added col-span-1 */}
          <EstimateSummary
            estimateItems={estimateItems}
            onUpdateHours={updateEstimateItemHours}
            onRemoveItem={removeEstimateItem}
          />
          <GrandTotalDisplay total={grandTotal} />
          <SendToHubSpotButton
            onClick={handleSendToHubSpot}
            isLoading={isSendingEstimate}
            disabled={estimateItems.length === 0}
          />
        </div>
      </div>
    </div>
  )
}
