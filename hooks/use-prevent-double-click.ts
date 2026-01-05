"use client"

import { useState, useCallback } from "react"
import toast from "react-hot-toast"

interface UsePreventDoubleClickOptions {
  action: () => Promise<void> | void
  successMessage?: string
  errorMessage?: string
  disabled?: boolean
}

export function usePreventDoubleClick({
  action,
  successMessage,
  errorMessage = "An error occurred",
  disabled = false
}: UsePreventDoubleClickOptions) {
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = useCallback(async (e?: React.MouseEvent) => {
    if (e) e.preventDefault()
    
    if (isLoading || disabled) return
    
    setIsLoading(true)
    
    try {
      await action()
      if (successMessage) {
        toast.success(successMessage, {
          duration: 3000,
          position: "bottom-right",
        })
      }
    } catch (error) {
      console.error("Action failed:", error)
      toast.error(errorMessage, {
        duration: 4000,
        position: "bottom-right",
      })
    } finally {
      setIsLoading(false)
    }
  }, [action, isLoading, disabled, successMessage, errorMessage])

  return { isLoading, handleClick }
}