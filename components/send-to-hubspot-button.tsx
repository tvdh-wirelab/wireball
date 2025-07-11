"use client"

import { Button } from "@/components/ui/button"
import { Loader2, Send } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface SendToHubSpotButtonProps {
  onClick: () => void
  isLoading: boolean
  disabled: boolean
}

export function SendToHubSpotButton({ onClick, isLoading, disabled }: SendToHubSpotButtonProps) {
  const { toast } = useToast()

  const handleClick = async () => {
    if (disabled) {
      toast({
        title: "Cannot send estimate",
        description: "Please add at least one item to the estimate.",
        variant: "destructive",
      })
      return
    }
    onClick()
  }

  return (
    <Button onClick={handleClick} disabled={isLoading || disabled} className="w-full mt-4" size="lg">
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Sending to HubSpot...
        </>
      ) : (
        <>
          <Send className="mr-2 h-4 w-4" />
          Send to HubSpot
        </>
      )}
    </Button>
  )
}
