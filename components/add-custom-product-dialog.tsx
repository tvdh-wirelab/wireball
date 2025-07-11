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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { PlusCircle, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { Product } from "@/lib/api-mock"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AddCustomProductDialogProps {
  onAddCustomProduct: (product: Product) => void
}

const CATEGORIES = ["Web", "Branding", "Marketing", "Consulting", "Other"]

export function AddCustomProductDialog({ onAddCustomProduct }: AddCustomProductDialogProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [name, setName] = React.useState("")
  const [category, setCategory] = React.useState("")
  const [defaultHours, setDefaultHours] = React.useState(0)
  const [description, setDescription] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !category || defaultHours < 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields (Name, Category, Hours). Hours must be non-negative.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    // Simulate API call or processing time
    await new Promise((resolve) => setTimeout(resolve, 500))

    const newProduct: Product = {
      id: `custom-${Date.now()}`, // Unique ID for custom product
      name,
      category,
      defaultHours,
      description: description || undefined,
      isCustom: true,
    }

    onAddCustomProduct(newProduct)

    toast({
      title: "Custom Product Added",
      description: `${name} has been added to your product library.`,
    })

    // Reset form and close dialog
    setName("")
    setCategory("")
    setDefaultHours(0)
    setDescription("")
    setIsLoading(false)
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full bg-transparent">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Custom Product
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Custom Product</DialogTitle>
          <DialogDescription>Define a new product to include in your estimates.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="category">Category</Label>
            <Select onValueChange={setCategory} value={category} required>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="hours">Hours</Label>
            <Input
              id="hours"
              type="number"
              value={defaultHours}
              onChange={(e) => setDefaultHours(Number(e.target.value))}
              min="0"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Product"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
