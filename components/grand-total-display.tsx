import { Card, CardContent } from "@/components/ui/card"

interface GrandTotalDisplayProps {
  total: number
}

export function GrandTotalDisplay({ total }: GrandTotalDisplayProps) {
  return (
    <Card className="mt-4">
      <CardContent className="flex items-center justify-between p-4">
        <h2 className="text-xl font-bold">Grand Total:</h2>
        <span className="text-2xl font-extrabold text-primary">€{total.toFixed(2)}</span>
      </CardContent>
    </Card>
  )
}
