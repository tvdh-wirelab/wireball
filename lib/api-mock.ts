export const HOURLY_RATE = 125 // Fixed hourly rate in euros
// Removed LOCAL_STORAGE_CUSTOM_PRODUCTS_KEY as custom products will not be persisted

export interface Product {
  id: string
  name: string
  category: string
  defaultHours: number
  description?: string // Optional description for custom products
  isCustom?: boolean // Flag to identify custom products
}

export interface EstimateItem {
  productId: string
  name: string
  category: string
  hours: number
  subtotal: number
}

// Removed loadCustomProductsFromLocalStorage and saveCustomProductsToLocalStorage functions

/**
 * Simulates fetching products from HubSpot's product library.
 * Custom products are no longer loaded from local storage.
 */
export async function fetchProductsFromHubSpot(): Promise<Product[]> {
  console.log("Simulating fetching products from HubSpot...")
  return new Promise((resolve) =>
    setTimeout(() => {
      const mockProducts: Product[] = [
        { id: "p1", name: "Website Design (Basic)", category: "Web", defaultHours: 40 },
        { id: "p2", name: "Website Design (Advanced)", category: "Web", defaultHours: 80 },
        { id: "p3", name: "Logo Design", category: "Branding", defaultHours: 15 },
        { id: "p4", name: "Brand Guidelines", category: "Branding", defaultHours: 25 },
        { id: "p5", name: "SEO Optimization", category: "Marketing", defaultHours: 30 },
        { id: "p6", name: "Content Creation (Blog Post)", category: "Marketing", defaultHours: 10 },
        { id: "p7", name: "Social Media Management", category: "Marketing", defaultHours: 20 },
        { id: "p8", name: "E-commerce Development", category: "Web", defaultHours: 120 },
      ]

      // Custom products are no longer loaded from local storage, only mock products are returned
      console.log("Mock products fetched:", mockProducts)
      resolve(mockProducts)
    }, 1500),
  )
}

/**
 * Simulates submitting line items to a HubSpot deal.
 */
export async function sendEstimateToHubSpot(items: EstimateItem[]): Promise<{ success: boolean; message: string }> {
  console.log("Simulating sending estimate to HubSpot:", items)
  return new Promise((resolve) =>
    setTimeout(() => {
      // Simulate a successful or failed submission
      const success = Math.random() > 0.1 // 90% success rate
      if (success) {
        console.log("Estimate sent to HubSpot successfully!")
        resolve({ success: true, message: "Estimate successfully sent to HubSpot!" })
      } else {
        console.error("Failed to send estimate to HubSpot.")
        resolve({ success: false, message: "Failed to send estimate to HubSpot. Please try again." })
      }
    }, 2000),
  )
}
