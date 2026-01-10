"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingButtonEnhanced } from "@/components/ui/loading-button-enhanced"
import { Mail, Lock, LogIn, Eye, EyeOff } from "lucide-react"
import toast, { Toaster } from "react-hot-toast"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password) {
      toast.error("Please fill in all fields", {
        duration: 3000,
        position: "bottom-right",
      })
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Mock successful login
      const success = true // Replace with actual API response
      
      if (success) {
        toast.success("Login successful!", {
          duration: 3000,
          position: "bottom-right",
        })
        
        // Redirect to dashboard
        setTimeout(() => {
          router.push("/dashboard")
        }, 1000)
      } else {
        throw new Error("Invalid credentials")
      }
    } catch (error) {
      toast.error("Invalid email or password", {
        duration: 4000,
        position: "bottom-right",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <Toaster />
      
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
            <LogIn className="h-6 w-6" />
            Welcome Back
          </CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access the dashboard
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="user@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
            <LoadingButtonEnhanced
              type="submit"
              status={isLoading ? "loading" : "idle"}
              loadingText="Signing in..."
              className="w-full"
              disabled={!email || !password}
            >
              <LogIn className="mr-2 h-4 w-4" />
              Sign In
            </LoadingButtonEnhanced>
            
            <div className="text-center text-sm text-gray-500">
              <p>Demo Credentials:</p>
              <p className="font-mono text-xs mt-1">admin@example.com / password123</p>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}