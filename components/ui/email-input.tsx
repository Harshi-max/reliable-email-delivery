"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { CheckCircle, XCircle, Mail, AlertCircle } from "lucide-react"

interface EmailInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  errorMessage?: string
  successMessage?: string
  showValidation?: boolean
  onValidationChange?: (isValid: boolean) => void
}

export function EmailInput({
  label = "Email Address",
  errorMessage = "Please enter a valid email address",
  successMessage = "Valid email format",
  showValidation = true,
  onValidationChange,
  className,
  value,
  onChange,
  ...props
}: EmailInputProps) {
  const [email, setEmail] = useState<string>(value?.toString() || "")
  const [isTouched, setIsTouched] = useState(false)
  const [isValidating, setIsValidating] = useState(false)

  // Email validation regex
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const isEmailValid = email.length > 0 ? isValidEmail(email) : false
  const showError = isTouched && email.length > 0 && !isEmailValid
  const showSuccess = isTouched && email.length > 0 && isEmailValid

  useEffect(() => {
    if (onValidationChange) {
      setIsValidating(true)
      const timer = setTimeout(() => {
        onValidationChange(isEmailValid)
        setIsValidating(false)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [email, isEmailValid, onValidationChange])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setEmail(newValue)
    setIsTouched(true)
    if (onChange) {
      onChange(e)
    }
  }

  const handleBlur = () => {
    setIsTouched(true)
  }

  const getDomainFromEmail = (email: string): string => {
    const parts = email.split('@')
    return parts.length === 2 ? parts[1] : ''
  }

  const getCommonDomains = () => [
    'gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 
    'icloud.com', 'protonmail.com', 'company.com', 'example.com'
  ]

  const suggestCorrection = (): string | null => {
    if (email.length < 3 || email.includes('@')) return null
    
    const domain = getDomainFromEmail(email)
    if (!domain) return null

    const commonDomains = getCommonDomains()
    const suggestions = commonDomains.filter(d => 
      d.startsWith(domain) || domain.startsWith(d.substring(0, 3))
    )

    return suggestions.length > 0 
      ? `Did you mean: ${email.split('@')[0]}@${suggestions[0]}?`
      : null
  }

  const suggestion = suggestCorrection()

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="email" className="text-sm font-medium">
          {label}
        </Label>
        {showValidation && email.length > 0 && (
          <div className="flex items-center gap-1">
            {isValidating ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
            ) : showSuccess ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : showError ? (
              <XCircle className="h-4 w-4 text-red-500" />
            ) : null}
            <span className={cn(
              "text-xs font-medium",
              showSuccess && "text-green-600",
              showError && "text-red-600",
              !showSuccess && !showError && "text-gray-500"
            )}>
              {showSuccess ? "Valid" : showError ? "Invalid" : "Checking..."}
            </span>
          </div>
        )}
      </div>

      <div className="relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
          <Mail className={cn(
            "h-4 w-4",
            showSuccess ? "text-green-500" : 
            showError ? "text-red-500" : 
            "text-gray-400"
          )} />
        </div>
        
        <Input
          id="email"
          type="email"
          value={value || email}
          onChange={handleChange}
          onBlur={handleBlur}
          className={cn(
            "pl-10 pr-10 h-11",
            showSuccess && "border-green-500 bg-green-50/50 focus:ring-green-500 focus:border-green-500",
            showError && "border-red-500 bg-red-50/50 focus:ring-red-500 focus:border-red-500",
            className
          )}
          placeholder="user@example.com"
          aria-invalid={showError}
          aria-describedby={showError ? "email-error" : showSuccess ? "email-success" : undefined}
          {...props}
        />

        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          {showSuccess && !isValidating && (
            <CheckCircle className="h-4 w-4 text-green-500" />
          )}
          {showError && !isValidating && (
            <XCircle className="h-4 w-4 text-red-500" />
          )}
        </div>
      </div>

      {showValidation && (
        <div className="space-y-1">
          {showError && (
            <div id="email-error" className="flex items-start gap-2 p-2 bg-red-50 border border-red-200 rounded">
              <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-red-700 font-medium">{errorMessage}</p>
                {suggestion && (
                  <p className="text-xs text-red-600 mt-1">{suggestion}</p>
                )}
                <p className="text-xs text-red-600 mt-1">
                  Format: username@domain.com
                </p>
              </div>
            </div>
          )}

          {showSuccess && (
            <div id="email-success" className="flex items-start gap-2 p-2 bg-green-50 border border-green-200 rounded">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-green-700 font-medium">{successMessage}</p>
                <p className="text-xs text-green-600 mt-1">
                  Domain: {getDomainFromEmail(email)}
                </p>
              </div>
            </div>
          )}

          {!showError && !showSuccess && email.length > 0 && (
            <div className="text-xs text-gray-500 space-y-1">
              <div className="flex items-center gap-2">
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  email.includes('@') ? "bg-green-500" : "bg-gray-300"
                )} />
                <span>Contains @ symbol</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  getDomainFromEmail(email).includes('.') ? "bg-green-500" : "bg-gray-300"
                )} />
                <span>Has domain with dot (.)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  email.length >= 6 ? "bg-green-500" : "bg-gray-300"
                )} />
                <span>Minimum 6 characters</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}