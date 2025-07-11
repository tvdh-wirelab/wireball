"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Loader2, Brain, PlusCircle } from "lucide-react"
import { useActionState } from "react"
import { generateEstimateFromBrief } from "@/app/actions/estimate-ai"
import { useToast } from "@/hooks/use-toast"
import type { Product } from "@/lib/api-mock"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface AIEstimatorDialogProps {
  onAddProducts: (products: Product[]) => void
}

export function AIEstimatorDialog({ onAddProducts }: AIEstimatorDialogProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [brief, setBrief] = React.useState("")
  const { toast } = useToast()

  // useActionState hook to manage the state and actions for the AI estimate generation
  const [state, formAction, isPending] = useActionState(
    async (_: any, formData: FormData) => {
      const clientBrief = formData.get("brief") as string
      if (!clientBrief.trim()) {
        toast({
          title: "Input Error",
          description: "Please provide a client brief.",
          variant: "destructive",
        })
        return { products: [], error: "Brief cannot be empty." }
      }
      const result = await generateEstimateFromBrief(clientBrief)
      if (result.error) {
        toast({
          title: "AI Error",
          description: result.error,
          variant: "destructive",
        })
      }
      return result
    },
    { products: [], error: undefined }, // Initial state
  )

  // Handler to add all suggested products to the estimate
  const handleAddAll = () => {
    if (state?.products && state.products.length > 0) {
      onAddProducts(state.products)
      toast({
        title: "AI Products Added",
        description: `${state.products.length} products suggested by AI have been added to your estimate.`,
      })
      setIsOpen(false) // Close dialog after adding
      setBrief("") // Clear brief input
    } else {
      toast({
        title: "No Products to Add",
        description: "The AI did not suggest any products.",
        variant: "default",
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full bg-transparent">
          <Brain className="mr-2 h-4 w-4" />
          AI Estimate
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>AI Project Estimator</DialogTitle>
          <DialogDescription>
            Paste your client brief below and let AI suggest products and hours for your estimate.
          </DialogDescription>
        </DialogHeader>
        {/* Form for submitting the brief to the AI action */}
        <form action={formAction} className="grid gap-4 py-4 flex-grow overflow-hidden">
          <div className="grid gap-2">
            <Label htmlFor="brief">Client Brief</Label>
            <Textarea
              id="brief"
              name="brief"
              value={brief}
              onChange={(e) => setBrief(e.target.value)}
              placeholder="e.g., 'We need a new e-commerce website with custom product pages, payment integration, and SEO optimization. We also need a new logo and brand guidelines.'"
              rows={6}
              className="min-h-[120px]"
              disabled={isPending}
              aria-label="Client brief for AI estimation"
            />
          </div>
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Brain className="mr-2 h-4 w-4" />
                Generate Estimate
              </>
            )}
          </Button>
          {/* Display AI suggested products */}
          {state?.products && state.products.length > 0 && (
            <div className="flex flex-col gap-2 mt-4 flex-grow overflow-y-auto pr-2">
              <h3 className="font-semibold text-md">Suggested Products:</h3>
              {state.products.map((product) => (
                <Card key={product.id} className="p-3">
                  <CardContent className="p-0 flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{product.name}</span>
                      <Badge variant="secondary">{product.category}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{product.description || "No description provided."}</p>
                    <p className="text-sm font-semibold">Estimated Hours: {product.defaultHours}h</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          {/* Display AI error messages */}
          {state?.error && (
            <p className="text-red-500 text-sm mt-2" role="alert">
              {state.error}
            </p>
          )}
        </form>
        <DialogFooter>
          <Button
            onClick={handleAddAll}
            disabled={!state?.products || state.products.length === 0 || isPending}
            aria-label="Add all suggested products to estimate"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add All Suggested to Estimate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
