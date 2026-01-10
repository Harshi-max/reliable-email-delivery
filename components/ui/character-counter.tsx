"use client"

import { cn } from "@/lib/utils"
import { AlertCircle, CheckCircle, Info } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface CharacterCounterProps {
  current: number
  max: number
  className?: string
  label?: string
  showLimit?: boolean
  showTooltip?: boolean
}

export function CharacterCounter({ 
  current, 
  max, 
  className,
  label = "Character count",
  showLimit = true,
  showTooltip = true
}: CharacterCounterProps) {
  const isExceeded = current > max
  const isNearLimit = current >= max * 0.9 && !isExceeded
  const isOptimal = current >= max * 0.3 && current <= max * 0.9
  
  const getIcon = () => {
    if (isExceeded) return <AlertCircle className="h-3 w-3 text-red-500" />
    if (isNearLimit) return <AlertCircle className="h-3 w-3 text-yellow-500" />
    if (isOptimal) return <CheckCircle className="h-3 w-3 text-green-500" />
    return <Info className="h-3 w-3 text-blue-500" />
  }

  const getColor = () => {
    if (isExceeded) return "text-red-600 dark:text-red-400"
    if (isNearLimit) return "text-yellow-600 dark:text-yellow-400"
    if (isOptimal) return "text-green-600 dark:text-green-400"
    return "text-gray-600 dark:text-gray-400"
  }

  const getProgressColor = () => {
    if (isExceeded) return "bg-red-500 dark:bg-red-600"
    if (isNearLimit) return "bg-yellow-500 dark:bg-yellow-600"
    if (isOptimal) return "bg-green-500 dark:bg-green-600"
    return "bg-blue-500 dark:bg-blue-600"
  }

  const getRecommendations = () => {
    if (label.includes("Subject")) {
      return [
        "✓ Ideal: 6-10 words",
        "✓ Use action words",
        "✓ Avoid spam triggers",
        "✗ Don't use all caps"
      ]
    }
    if (label.includes("Body")) {
      return [
        "✓ Use short paragraphs",
        "✓ Include clear call-to-action",
        "✓ Add personalization",
        "✓ Mobile-friendly formatting"
      ]
    }
    return []
  }

  const counterContent = (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex items-center gap-1">
        {showTooltip && getIcon()}
        <span className={cn("text-xs font-medium tabular-nums", getColor())}>
          {current}
          {showLimit && ` / ${max}`}
        </span>
      </div>
      <div className="w-16 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div 
          className={cn("h-full transition-all duration-300", getProgressColor())}
          style={{ width: `${Math.min((current / max) * 100, 100)}%` }}
        />
      </div>
      {isExceeded && (
        <span className="text-xs font-medium text-red-600 dark:text-red-400">
          Limit exceeded
        </span>
      )}
    </div>
  )

  if (!showTooltip) {
    return counterContent
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="cursor-help">
            {counterContent}
          </div>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs p-4">
          <div className="space-y-3">
            <div>
              <p className="font-medium mb-1">{label}</p>
              <div className="flex items-center justify-between">
                <span className={cn("text-sm font-medium", getColor())}>
                  {current} of {max} characters
                </span>
                <span className="text-xs text-gray-500">
                  {Math.round((current / max) * 100)}%
                </span>
              </div>
            </div>
            
            <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className={cn("h-full transition-all duration-300", getProgressColor())}
                style={{ width: `${Math.min((current / max) * 100, 100)}%` }}
              />
            </div>
            
            {isExceeded ? (
              <div className="p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
                <p className="text-red-700 dark:text-red-300 text-sm font-medium">
                  ⚠️ Limit exceeded by {current - max} characters
                </p>
                <p className="text-red-600 dark:text-red-400 text-xs mt-1">
                  Consider shortening your text
                </p>
              </div>
            ) : isNearLimit ? (
              <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded">
                <p className="text-yellow-700 dark:text-yellow-300 text-sm font-medium">
                  ⚠️ Approaching limit
                </p>
                <p className="text-yellow-600 dark:text-yellow-400 text-xs mt-1">
                  {max - current} characters remaining
                </p>
              </div>
            ) : isOptimal ? (
              <div className="p-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded">
                <p className="text-green-700 dark:text-green-300 text-sm font-medium">
                  ✓ Optimal length
                </p>
                <p className="text-green-600 dark:text-green-400 text-xs mt-1">
                  {max - current} characters remaining
                </p>
              </div>
            ) : (
              <div className="p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded">
                <p className="text-blue-700 dark:text-blue-300 text-sm font-medium">
                  ℹ️ Room available
                </p>
                <p className="text-blue-600 dark:text-blue-400 text-xs mt-1">
                  {max - current} characters remaining
                </p>
              </div>
            )}
            
            {getRecommendations().length > 0 && (
              <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Best practices:
                </p>
                <ul className="space-y-1">
                  {getRecommendations().map((rec, index) => (
                    <li key={index} className="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-1">
                      {rec.startsWith("✓") ? (
                        <span className="text-green-500">✓</span>
                      ) : (
                        <span className="text-red-500">✗</span>
                      )}
                      {rec.slice(1)}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}