"use client"

import { useState, useCallback, useEffect } from "react"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  ArrowLeft,
  Send,
  Smartphone,
  Monitor,
  Type,
  Image,
  MousePointerClick,
  Users,
  Minus,
  Plus,
  Trash2,
  Copy,
  Palette,
  Layers,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react"
import Link from "next/link"
import toast, { Toaster } from "react-hot-toast"
import { CharacterCounter } from "@/components/ui/character-counter"
import { LoadingButtonEnhanced } from "@/components/ui/loading-button-enhanced"
import { EmailInput } from "@/components/ui/email-input"
import { usePreventDoubleClick } from "@/hooks/use-prevent-double-click"

interface EmailComponent {
  id: string
  type: "text" | "image" | "button" | "social" | "divider"
  content: string
  styles: { [key: string]: any }
}

export default function EmailBuilderPage() {
  const [components, setComponents] = useState<EmailComponent[]>([
    {
      id: "text-1",
      type: "text",
      content: "Welcome to our platform!",
      styles: { fontSize: "24px", color: "#333333", padding: "16px", textAlign: "center", fontWeight: "bold" }
    },
    {
      id: "image-1",
      type: "image",
      content: "",
      styles: { width: "100%", height: "200px", padding: "10px", src: "https://via.placeholder.com/600x200", alt: "Hero Image" }
    },
    {
      id: "button-1",
      type: "button",
      content: "Get Started",
      styles: { backgroundColor: "#007bff", color: "#ffffff", padding: "12px 24px", borderRadius: "6px", textAlign: "center", fontSize: "16px", fontWeight: "bold", href: "#" }
    }
  ])
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null)
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop")
  const [emailSubject, setEmailSubject] = useState("Your Beautiful Email Template")
  
  // Email validation state
  const [emailRecipient, setEmailRecipient] = useState("")
  const [isEmailValid, setIsEmailValid] = useState(false)
  const [emailValidationTouched, setEmailValidationTouched] = useState(false)
  
  // Character counter states
  const [subjectCharCount, setSubjectCharCount] = useState(emailSubject.length)
  const [subjectCharLimit] = useState(100)
  const [componentCharCounts, setComponentCharCounts] = useState<{[key: string]: number}>({})

  // Initialize character counts for existing components
  useEffect(() => {
    const counts: {[key: string]: number} = {}
    components.forEach(comp => {
      if (comp.type === "text") {
        counts[comp.id] = comp.content.length
      }
    })
    setComponentCharCounts(counts)
  }, [components])

  // Use button status hook for sending
  const { isLoading: sendIsLoading, handleClick: handleSendEmail } = usePreventDoubleClick({
    action: async () => {
      if (!emailRecipient) {
        throw new Error("Please enter recipient email")
      }
      
      if (!isEmailValid) {
        setEmailValidationTouched(true)
        throw new Error("Please enter a valid email address")
      }
      
      if (subjectCharCount > subjectCharLimit) {
        throw new Error(`Subject exceeds ${subjectCharLimit} characters`)
      }
      
      // Validate component content
      const invalidComponents = components.filter(comp => {
        if (comp.type === "text" && !comp.content.trim()) {
          return true
        }
        return false
      })
      
      if (invalidComponents.length > 0) {
        throw new Error("Please fill all text components")
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const componentHTML = components.map(comp => {
        const styles = Object.entries(comp.styles)
          .filter(([key]) => !key.includes("Url") && key !== "src" && key !== "alt" && key !== "href")
          .map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value}`)
          .join('; ')

        switch (comp.type) {
          case "text":
            return `<div style="${styles}">${comp.content}</div>`
          case "image":
            return `<img src="${comp.styles.src || 'https://via.placeholder.com/400x200'}" alt="${comp.styles.alt || 'Image'}" style="${styles}" />`
          case "button":
            return `<a href="${comp.styles.href || '#'}" style="display: inline-block; text-decoration: none; ${styles}">${comp.content}</a>`
          case "social":
            return `<div style="${styles}"><div style="text-align: center; padding: 20px;"><div style="margin-bottom: 16px;"><a href="${comp.styles.facebookUrl || 'https://facebook.com'}" style="display: inline-block; width: 48px; height: 48px; background-color: #1877f2; border-radius: 50%; text-align: center; line-height: 48px; color: white; text-decoration: none; margin: 0 8px; font-weight: bold; font-size: 18px;">f</a><a href="${comp.styles.twitterUrl || 'https://twitter.com'}" style="display: inline-block; width: 48px; height: 48px; background-color: #1da1f2; border-radius: 50%; text-align: center; line-height: 48px; color: white; text-decoration: none; margin: 0 8px; font-weight: bold; font-size: 18px;">𝕏</a><a href="${comp.styles.instagramUrl || 'https://instagram.com'}" style="display: inline-block; width: 48px; height: 48px; background: linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%); border-radius: 50%; text-align: center; line-height: 48px; color: white; text-decoration: none; margin: 0 8px; font-weight: bold; font-size: 18px;">📷</a><a href="${comp.styles.linkedinUrl || 'https://linkedin.com'}" style="display: inline-block; width: 48px; height: 48px; background-color: #0077b5; border-radius: 50%; text-align: center; line-height: 48px; color: white; text-decoration: none; margin: 0 8px; font-weight: bold; font-size: 14px;">in</a><a href="${comp.styles.youtubeUrl || 'https://youtube.com'}" style="display: inline-block; width: 48px; height: 48px; background-color: #ff0000; border-radius: 50%; text-align: center; line-height: 48px; color: white; text-decoration: none; margin: 0 8px; font-weight: bold; font-size: 18px;">▶</a></div><p style="margin: 0; font-size: ${comp.styles.fontSize || '16px'}; color: ${comp.styles.color || '#374151'}; font-weight: 500;">${comp.content}</p></div></div>`
          case "divider":
            return `<hr style="${styles}" />`
          default:
            return ""
        }
      }).join("")

      const fullHTML = `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${emailSubject}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
        .email-container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    </style>
</head>
<body>
    <div class="email-container">
        ${componentHTML}
    </div>
</body>
</html>`

      const response = await fetch("/api/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: emailRecipient,
          subject: emailSubject,
          body: fullHTML,
          html: fullHTML
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to send email")
      }

      // Clear recipient after successful send
      setEmailRecipient("")
      setIsEmailValid(false)
      setEmailValidationTouched(false)
      
      return response.json()
    },
    successMessage: "✅ Email sent successfully!",
    errorMessage: "❌ Failed to send email",
  })

  const handleDragEnd = useCallback((result: any) => {
    if (!result.destination) return
    const items = Array.from(components)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)
    setComponents(items)
  }, [components])

  const addComponent = useCallback((type: EmailComponent["type"]) => {
    const id = `${type}-${Date.now()}`
    const defaultStyles = {
      text: { fontSize: "16px", color: "#333333", padding: "10px", lineHeight: "1.5" },
      image: { width: "100%", height: "200px", padding: "10px", src: "https://via.placeholder.com/600x200", alt: "Image" },
      button: { backgroundColor: "#007bff", color: "#ffffff", padding: "12px 24px", borderRadius: "6px", textAlign: "center", fontSize: "16px", fontWeight: "bold", href: "#" },
      social: { padding: "20px", fontSize: "16px", color: "#374151", facebookUrl: "https://facebook.com", twitterUrl: "https://twitter.com", instagramUrl: "https://instagram.com", linkedinUrl: "https://linkedin.com", youtubeUrl: "https://youtube.com" },
      divider: { border: "1px solid #e5e7eb", margin: "20px 0", width: "100%" }
    }
    
    const newComponent: EmailComponent = {
      id,
      type,
      content: type === "text" ? "New text content" : 
               type === "button" ? "Click Here" : 
               type === "social" ? "Follow us on social media" : "",
      styles: defaultStyles[type]
    }
    
    setComponents([...components, newComponent])
    setSelectedComponent(id)
    
    if (type === "text") {
      setComponentCharCounts(prev => ({
        ...prev,
        [id]: newComponent.content.length
      }))
    }
    
    toast.success(`Added ${type} component`, { icon: "➕" })
  }, [components])

  const updateComponent = useCallback((id: string, updates: Partial<EmailComponent>) => {
    setComponents(components.map(comp => 
      comp.id === id ? { ...comp, ...updates } : comp
    ))
    
    if (updates.content !== undefined) {
      setComponentCharCounts(prev => ({
        ...prev,
        [id]: updates.content?.length || 0
      }))
    }
  }, [components])

  const updateComponentStyle = useCallback((id: string, key: string, value: string) => {
    setComponents(components.map(comp => 
      comp.id === id ? { ...comp, styles: { ...comp.styles, [key]: value } } : comp
    ))
  }, [components])

  const removeComponent = useCallback((id: string) => {
    setComponents(components.filter(comp => comp.id !== id))
    if (selectedComponent === id) {
      setSelectedComponent(null)
    }
    toast.success("Component removed", { icon: "🗑️" })
  }, [components, selectedComponent])

  const duplicateComponent = useCallback((id: string) => {
    const component = components.find(comp => comp.id === id)
    if (!component) return
    
    const newId = `${component.type}-${Date.now()}`
    const duplicated = { ...component, id: newId }
    setComponents([...components, duplicated])
    setSelectedComponent(newId)
    toast.success("Component duplicated", { icon: "📋" })
  }, [components])

  const selectedComponentData = components.find(comp => comp.id === selectedComponent)

  const isSendDisabled = !emailRecipient || !isEmailValid || subjectCharCount > subjectCharLimit || 
    components.some(comp => comp.type === "text" && !comp.content.trim())

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Toaster
        toastOptions={{
          className: "dark:bg-gray-800 dark:text-white",
          style: {
            background: "var(--background)",
            color: "var(--foreground)",
            border: "1px solid var(--border)",
          },
        }}
      />

      <div className="container mx-auto p-4 md:p-6">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Link href="/">
                <Button variant="ghost" size="sm" className="hover:bg-white/80 dark:hover:bg-gray-800">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              
              <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white animate-pulse">
                <Layers className="h-3 w-3 mr-1" />
                Drag & Drop Builder
              </Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setPreviewMode("desktop")}
                className={previewMode === "desktop" ? "bg-blue-100 dark:bg-blue-900" : ""}
              >
                <Monitor className="h-4 w-4 mr-2" />
                Desktop
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setPreviewMode("mobile")}
                className={previewMode === "mobile" ? "bg-blue-100 dark:bg-blue-900" : ""}
              >
                <Smartphone className="h-4 w-4 mr-2" />
                Mobile
              </Button>
            </div>
          </div>

          <Alert className="mb-6 border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/30">
            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertDescription className="text-green-800 dark:text-green-300">
              <strong>✅ Email Validation Active:</strong> Invalid email addresses will be blocked. Real-time validation with format checking enabled.
            </AlertDescription>
          </Alert>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar - Components */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg dark:bg-gray-900 h-full">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Layers className="h-5 w-5" />
                  Components
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Drag and drop to build your email
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    variant="outline" 
                    className="h-24 flex flex-col items-center justify-center gap-2 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                    onClick={() => addComponent("text")}
                  >
                    <Type className="h-6 w-6 text-blue-500" />
                    <span className="text-sm font-medium">Text</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-24 flex flex-col items-center justify-center gap-2 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                    onClick={() => addComponent("image")}
                  >
                    <Image className="h-6 w-6 text-green-500" />
                    <span className="text-sm font-medium">Image</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-24 flex flex-col items-center justify-center gap-2 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                    onClick={() => addComponent("button")}
                  >
                    <MousePointerClick className="h-6 w-6 text-purple-500" />
                    <span className="text-sm font-medium">Button</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-24 flex flex-col items-center justify-center gap-2 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                    onClick={() => addComponent("social")}
                  >
                    <Users className="h-6 w-6 text-orange-500" />
                    <span className="text-sm font-medium">Social</span>
                  </Button>
                </div>

                <div className="border-t pt-4">
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label htmlFor="subject" className="text-sm font-medium">
                          Email Subject
                        </Label>
                        <div className="flex items-center gap-2">
                          {subjectCharCount > subjectCharLimit && (
                            <AlertCircle className="h-4 w-4 text-red-500" />
                          )}
                          <CharacterCounter 
                            current={subjectCharCount} 
                            max={subjectCharLimit}
                            label="Subject line character count"
                          />
                        </div>
                      </div>
                      <Input
                        id="subject"
                        value={emailSubject}
                        onChange={(e) => {
                          setEmailSubject(e.target.value)
                          setSubjectCharCount(e.target.value.length)
                        }}
                        placeholder="Enter email subject"
                        className="mb-2"
                        maxLength={subjectCharLimit}
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Recommended: Keep under 50 characters for better open rates
                      </p>
                    </div>

                    <div className="space-y-2">
                      <EmailInput
                        label="Recipient Email"
                        value={emailRecipient}
                        onChange={(e) => setEmailRecipient(e.target.value)}
                        showValidation={true}
                        onValidationChange={(isValid) => {
                          setIsEmailValid(isValid)
                          setEmailValidationTouched(true)
                        }}
                        className="h-11"
                        placeholder="recipient@example.com"
                        onCopy={(e) => {
                          const target = e.currentTarget as HTMLInputElement
                          navigator.clipboard.writeText(target.value)
                          toast.success("Email copied to clipboard!", {
                            icon: "📧"
                          })
                        }}
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Enter a valid email address to send the template
                      </p>
                    </div>

                    {/* Validation Status */}
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
                          Validation Status
                        </span>
                        {isEmailValid ? (
                          <Badge className="bg-green-100 text-green-800 border-green-200">
                            Valid
                          </Badge>
                        ) : emailValidationTouched ? (
                          <Badge className="bg-red-100 text-red-800 border-red-200">
                            Invalid
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-gray-500">
                            Pending
                          </Badge>
                        )}
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-blue-700 dark:text-blue-400">Email Format</span>
                          {isEmailValid ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : emailValidationTouched ? (
                            <XCircle className="h-4 w-4 text-red-500" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-yellow-500" />
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-blue-700 dark:text-blue-400">Subject Length</span>
                          <span className={`text-xs font-medium ${subjectCharCount > subjectCharLimit ? 'text-red-600' : 'text-blue-700 dark:text-blue-400'}`}>
                            {subjectCharCount} / {subjectCharLimit}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-blue-700 dark:text-blue-400">Components</span>
                          <span className="text-xs font-medium text-blue-700 dark:text-blue-400">
                            {components.length} items
                          </span>
                        </div>
                      </div>
                    </div>

                    <LoadingButtonEnhanced
                      onClick={handleSendEmail}
                      loadingText="Sending Email..."
                      successText="Email Sent!"
                      errorText="Failed to Send"
                      disabled={isSendDisabled}
                      className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                      autoReset={true}
                      resetDelay={2000}
                      showStatusIcon={true}
                    >
                      <Send className="mr-2 h-4 w-4" />
                      Send Template
                    </LoadingButtonEnhanced>

                    {sendIsLoading && (
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                          <div>
                            <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
                              Sending email...
                            </p>
                            <p className="text-xs text-blue-600 dark:text-blue-400">
                              Please don't close this window
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Middle - Builder Canvas */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-lg dark:bg-gray-900">
              <CardHeader className="border-b">
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Email Builder Canvas
                </CardTitle>
                <CardDescription>
                  Drag components to reorder, click to edit
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <div className={`border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg p-4 min-h-[600px] bg-white dark:bg-gray-800 ${previewMode === "mobile" ? "max-w-md mx-auto" : ""}`}>
                  <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="components">
                      {(provided) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className="space-y-4"
                        >
                          {components.map((component, index) => (
                            <Draggable 
                              key={component.id} 
                              draggableId={component.id} 
                              index={index}
                            >
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`p-4 border rounded-lg cursor-move transition-all hover:shadow-lg ${selectedComponent === component.id ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/30' : 'bg-gray-50 dark:bg-gray-700/50 hover:border-blue-300 dark:hover:border-blue-700'}`}
                                  onClick={() => setSelectedComponent(component.id)}
                                >
                                  <div className="flex items-center justify-between mb-3">
                                    <Badge variant="outline" className="capitalize">
                                      {component.type}
                                    </Badge>
                                    <div className="flex items-center gap-2">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 p-0"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          duplicateComponent(component.id)
                                        }}
                                      >
                                        <Copy className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          removeComponent(component.id)
                                        }}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>

                                  {component.type === "text" && (
                                    <div>
                                      <div className="flex items-center justify-between mb-2">
                                        <Label htmlFor={`content-${component.id}`} className="text-sm font-medium">
                                          Text Content
                                        </Label>
                                        <span className="text-xs text-gray-500">
                                          {componentCharCounts[component.id] || 0} characters
                                        </span>
                                      </div>
                                      <Textarea
                                        id={`content-${component.id}`}
                                        value={component.content}
                                        onChange={(e) => updateComponent(component.id, { content: e.target.value })}
                                        placeholder="Enter your text here..."
                                        className="mb-3"
                                        rows={3}
                                      />
                                      <div className="grid grid-cols-2 gap-2">
                                        <div>
                                          <Label htmlFor={`fontSize-${component.id}`} className="text-xs">
                                            Font Size
                                          </Label>
                                          <div className="flex items-center gap-2">
                                            <Button
                                              variant="outline"
                                              size="sm"
                                              className="h-8 w-8 p-0"
                                              onClick={() => {
                                                const currentSize = parseInt(component.styles.fontSize) || 16
                                                updateComponentStyle(component.id, "fontSize", `${Math.max(8, currentSize - 2)}px`)
                                              }}
                                            >
                                              <Minus className="h-3 w-3" />
                                            </Button>
                                            <Input
                                              id={`fontSize-${component.id}`}
                                              value={component.styles.fontSize}
                                              onChange={(e) => updateComponentStyle(component.id, "fontSize", e.target.value)}
                                              className="h-8 text-center"
                                            />
                                            <Button
                                              variant="outline"
                                              size="sm"
                                              className="h-8 w-8 p-0"
                                              onClick={() => {
                                                const currentSize = parseInt(component.styles.fontSize) || 16
                                                updateComponentStyle(component.id, "fontSize", `${currentSize + 2}px`)
                                              }}
                                            >
                                              <Plus className="h-3 w-3" />
                                            </Button>
                                          </div>
                                        </div>
                                        <div>
                                          <Label htmlFor={`color-${component.id}`} className="text-xs">
                                            Color
                                          </Label>
                                          <Input
                                            id={`color-${component.id}`}
                                            type="color"
                                            value={component.styles.color || "#333333"}
                                            onChange={(e) => updateComponentStyle(component.id, "color", e.target.value)}
                                            className="h-8 p-1"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  {component.type === "image" && (
                                    <div>
                                      <div className="mb-3">
                                        <img
                                          src={component.styles.src}
                                          alt={component.styles.alt}
                                          className="w-full h-auto rounded border"
                                        />
                                      </div>
                                      <div className="grid grid-cols-2 gap-2">
                                        <div>
                                          <Label htmlFor={`src-${component.id}`} className="text-xs">
                                            Image URL
                                          </Label>
                                          <Input
                                            id={`src-${component.id}`}
                                            value={component.styles.src}
                                            onChange={(e) => updateComponentStyle(component.id, "src", e.target.value)}
                                            className="h-8 text-sm"
                                          />
                                        </div>
                                        <div>
                                          <Label htmlFor={`alt-${component.id}`} className="text-xs">
                                            Alt Text
                                          </Label>
                                          <Input
                                            id={`alt-${component.id}`}
                                            value={component.styles.alt}
                                            onChange={(e) => updateComponentStyle(component.id, "alt", e.target.value)}
                                            className="h-8 text-sm"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  {component.type === "button" && (
                                    <div>
                                      <div className="mb-3">
                                        <button
                                          style={{
                                            backgroundColor: component.styles.backgroundColor,
                                            color: component.styles.color,
                                            padding: component.styles.padding,
                                            borderRadius: component.styles.borderRadius,
                                            fontSize: component.styles.fontSize,
                                            fontWeight: component.styles.fontWeight,
                                            border: "none",
                                            cursor: "pointer",
                                            display: "inline-block"
                                          }}
                                        >
                                          {component.content}
                                        </button>
                                      </div>
                                      <div className="grid grid-cols-2 gap-2">
                                        <div>
                                          <Label htmlFor={`button-text-${component.id}`} className="text-xs">
                                            Button Text
                                          </Label>
                                          <Input
                                            id={`button-text-${component.id}`}
                                            value={component.content}
                                            onChange={(e) => updateComponent(component.id, { content: e.target.value })}
                                            className="h-8 text-sm"
                                          />
                                        </div>
                                        <div>
                                          <Label htmlFor={`button-color-${component.id}`} className="text-xs">
                                            Background
                                          </Label>
                                          <Input
                                            id={`button-color-${component.id}`}
                                            type="color"
                                            value={component.styles.backgroundColor}
                                            onChange={(e) => updateComponentStyle(component.id, "backgroundColor", e.target.value)}
                                            className="h-8 p-1"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  {component.type === "social" && (
                                    <div className="text-center">
                                      <p className="mb-3 text-gray-600 dark:text-gray-300">{component.content}</p>
                                      <div className="flex justify-center gap-2 mb-3">
                                        {["facebook", "twitter", "instagram", "linkedin", "youtube"].map((social) => (
                                          <div
                                            key={social}
                                            className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-sm font-bold"
                                          >
                                            {social === "facebook" && "f"}
                                            {social === "twitter" && "𝕏"}
                                            {social === "instagram" && "📷"}
                                            {social === "linkedin" && "in"}
                                            {social === "youtube" && "▶"}
                                          </div>
                                        ))}
                                      </div>
                                      <Input
                                        value={component.content}
                                        onChange={(e) => updateComponent(component.id, { content: e.target.value })}
                                        placeholder="Social media text"
                                        className="h-8 text-sm"
                                      />
                                    </div>
                                  )}

                                  {component.type === "divider" && (
                                    <hr style={component.styles} />
                                  )}
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                          {components.length === 0 && (
                            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                              <Layers className="h-12 w-12 mx-auto mb-4 opacity-50" />
                              <p className="text-lg font-medium mb-2">No components yet</p>
                              <p className="text-sm">Drag components from the sidebar or click buttons to add</p>
                            </div>
                          )}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                </div>
              </CardContent>
            </Card>

            {/* Component Inspector */}
            {selectedComponentData && (
              <Card className="shadow-lg dark:bg-gray-900">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    Component Inspector: {selectedComponentData.type}
                  </CardTitle>
                  <CardDescription>
                    Edit properties for the selected component
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="styles">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="styles">Styles</TabsTrigger>
                      <TabsTrigger value="content">Content</TabsTrigger>
                      <TabsTrigger value="advanced">Advanced</TabsTrigger>
                    </TabsList>
                    <TabsContent value="styles" className="space-y-4 pt-4">
                      {Object.entries(selectedComponentData.styles).map(([key, value]) => (
                        <div key={key} className="space-y-2">
                          <Label htmlFor={key} className="text-sm capitalize">
                            {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                          </Label>
                          <Input
                            id={key}
                            value={value}
                            onChange={(e) => updateComponentStyle(selectedComponentData.id, key, e.target.value)}
                            placeholder={`Enter ${key}`}
                          />
                        </div>
                      ))}
                    </TabsContent>
                    <TabsContent value="content" className="space-y-4 pt-4">
                      {selectedComponentData.type === "text" && (
                        <div>
                          <Label htmlFor="content" className="text-sm">Text Content</Label>
                          <Textarea
                            id="content"
                            value={selectedComponentData.content}
                            onChange={(e) => updateComponent(selectedComponentData.id, { content: e.target.value })}
                            rows={4}
                          />
                        </div>
                      )}
                      {selectedComponentData.type === "button" && (
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="button-text" className="text-sm">Button Text</Label>
                            <Input
                              id="button-text"
                              value={selectedComponentData.content}
                              onChange={(e) => updateComponent(selectedComponentData.id, { content: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label htmlFor="button-link" className="text-sm">Link URL</Label>
                            <Input
                              id="button-link"
                              value={selectedComponentData.styles.href || "#"}
                              onChange={(e) => updateComponentStyle(selectedComponentData.id, "href", e.target.value)}
                            />
                          </div>
                        </div>
                      )}
                    </TabsContent>
                    <TabsContent value="advanced" className="space-y-4 pt-4">
                      <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                              Advanced Settings
                            </p>
                            <p className="text-xs text-yellow-700 dark:text-yellow-400 mt-1">
                              These settings affect email rendering across different clients
                            </p>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}