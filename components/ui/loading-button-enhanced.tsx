"use client"

import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle, XCircle, Clock } from "lucide-react"
import { ReactNode, useState, useEffect } from "react"
import { cn } from "@/lib/utils"

type ButtonStatus = "idle" | "loading" | "success" | "error"

interface LoadingButtonEnhancedProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  status?: ButtonStatus
  loadingText?: string
  successText?: string
  errorText?: string
  children: ReactNode
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  showStatusIcon?: boolean
  autoReset?: boolean
  resetDelay?: number
}

export function LoadingButtonEnhanced({
  status = "idle",
  loadingText = "Processing...",
  successText,
  errorText,
  children,
  className,
  disabled,
  variant = "default",
  size = "default",
  showStatusIcon = true,
  autoReset = true,
  resetDelay = 3000,
  ...props
}: LoadingButtonEnhancedProps) {
  const [internalStatus, setInternalStatus] = useState<ButtonStatus>(status)

  useEffect(() => {
    setInternalStatus(status)
  }, [status])

  useEffect(() => {
    if (autoReset && (internalStatus === "success" || internalStatus === "error")) {
      const timer = setTimeout(() => {
        setInternalStatus("idle")
      }, resetDelay)
      return () => clearTimeout(timer)
    }
  }, [internalStatus, autoReset, resetDelay])

  const isDisabled = internalStatus === "loading" || internalStatus === "success" || disabled

  const getStatusIcon = () => {
    if (!showStatusIcon) return null
    
    switch (internalStatus) {
      case "loading":
        return <Loader2 className={cn(
          "mr-2 h-4 w-4 animate-spin",
          size === "sm" && "h-3 w-3",
          size === "lg" && "h-5 w-5"
        )} />
      case "success":
        return <CheckCircle className={cn(
          "mr-2 h-4 w-4 text-green-500",
          size === "sm" && "h-3 w-3",
          size === "lg" && "h-5 w-5"
        )} />
      case "error":
        return <XCircle className={cn(
          "mr-2 h-4 w-4 text-red-500",
          size === "sm" && "h-3 w-3",
          size === "lg" && "h-5 w-5"
        )} />
      default:
        return null
    }
  }

  const getButtonText = () => {
    switch (internalStatus) {
      case "loading":
        return loadingText
      case "success":
        return successText || children
      case "error":
        return errorText || children
      default:
        return children
    }
  }

  const getVariant = () => {
    if (internalStatus === "success") return "outline"
    if (internalStatus === "error") return "destructive"
    return variant
  }

  return (
    <Button
      variant={getVariant()}
      size={size}
      disabled={isDisabled}
      className={cn(
        "relative transition-all duration-300",
        internalStatus === "loading" && "cursor-not-allowed",
        internalStatus === "success" && "border-green-500 text-green-700 bg-green-50 hover:bg-green-100 hover:text-green-700 dark:border-green-600 dark:text-green-400 dark:bg-green-900/20",
        internalStatus === "error" && "cursor-not-allowed",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-center">
        {getStatusIcon()}
        <span className="whitespace-nowrap">{getButtonText()}</span>
      </div>
    </Button>
  )
}