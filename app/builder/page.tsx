"use client"

import { useState, useCallback } from "react"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
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
} from "lucide-react"
import { ArrowLeft, Send } from "lucide-react"
import Link from "next/link"
import toast, { Toaster } from "react-hot-toast"
import CopyButton from "@/components/ui/copy-button"

interface EmailComponent {
  id: string
  type: "text" | "image" | "button" | "social" | "divider"
  content: string
  styles: { [key: string]: any }
}
import { DragComponents } from "@/components/EmailTemplateBuilder/DragComponents"
import { PropertiesPanel } from "@/components/EmailTemplateBuilder/PropertiesPanel"
import { LivePreview } from "@/components/EmailTemplateBuilder/LivePreview"
import { TemplateGallery } from "@/components/EmailTemplateBuilder/TemplateGallery"
interface EmailComponent {
  id: string
  type: "text" | "image" | "button" | "social" | "divider"
  content: string
  styles: { [key: string]: any }
}
import { EmailComponent } from "@/components/EmailTemplateBuilder/Builder"
import { useToast } from "@/components/ui/use-toast"

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
  const [emailRecipient, setEmailRecipient] = useState("")
  const [isSending, setIsSending] = useState(false)

  const { toast } = useToast()

  const handleDragEnd = useCallback((result: any) => {
    if (!result.destination) return

    const { source, destination, draggableId } = result

    if (source.droppableId === "components" && destination.droppableId === "canvas") {
      const componentType = draggableId as EmailComponent["type"]
      const newComponent: EmailComponent = {
        id: `${componentType}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: componentType,
        content: getDefaultContent(componentType),
        styles: getDefaultStyles(componentType)
      }

      const newComponents = [...components]
      newComponents.splice(destination.index, 0, newComponent)
      setComponents(newComponents)
      setSelectedComponent(newComponent.id)
      
      toast.success(`Added ${componentType} component`, {
        duration: 2000,
        position: "bottom-right",
      })
    } 
    else if (source.droppableId === "canvas" && destination.droppableId === "canvas") {
    } else if (source.droppableId === "canvas" && destination.droppableId === "canvas") {
      if (source.index === destination.index) return

      const newComponents = Array.from(components)
      const [reorderedItem] = newComponents.splice(source.index, 1)
      newComponents.splice(destination.index, 0, reorderedItem)
      setComponents(newComponents)
    }
  }, [components])

  const getDefaultContent = (type: EmailComponent["type"]): string => {
    switch (type) {
      case "text": return "Your text content here..."
      case "image": return ""
      case "button": return "Click Me"
      case "social": return "Follow us on social media"
      case "divider": return ""
      default: return ""
    }
  }

  const getDefaultStyles = (type: EmailComponent["type"]) => {
    switch (type) {
      case "text":
        return { fontSize: "16px", color: "#333333", padding: "16px", textAlign: "left" }
      case "image":
        return { width: "100%", height: "200px", padding: "10px", src: "https://via.placeholder.com/600x200", alt: "Image" }
      case "button":
        return { backgroundColor: "#007bff", color: "#ffffff", padding: "12px 24px", borderRadius: "6px", textAlign: "center", fontSize: "16px", fontWeight: "bold", href: "#" }
        return {
          backgroundColor: "#007bff",
          color: "#ffffff",
          padding: "12px 24px",
          borderRadius: "6px",
          textAlign: "center" as const,
          fontSize: "16px",
          fontWeight: "bold" as const
        }
      case "social":
        return { padding: "20px", textAlign: "center", fontSize: "16px", color: "#374151", facebookUrl: "https://facebook.com", twitterUrl: "https://twitter.com", instagramUrl: "https://instagram.com", linkedinUrl: "https://linkedin.com", youtubeUrl: "https://youtube.com" }
      case "divider":
        return { height: "2px", backgroundColor: "#e0e0e0", padding: "10px 0" }
      default:
        return {}
    }
  }

  const updateComponent = (id: string, updates: Partial<EmailComponent>) => {
    setComponents(prev =>
      prev.map(comp => (comp.id === id ? { ...comp, ...updates } : comp))
    )
  }

  const deleteComponent = (id: string) => {
    setComponents(prev => prev.filter(comp => comp.id !== id))
    setSelectedComponent(null)
    toast.success("Component deleted", {
      duration: 2000,
      position: "bottom-right",
    })
  }

  const duplicateComponent = (id: string) => {
    const component = components.find(c => c.id === id)
    if (!component) return
    
    const newComponent = {
      ...component,
      id: `${component.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }
    
    const index = components.findIndex(c => c.id === id)
    const newComponents = [...components]
    newComponents.splice(index + 1, 0, newComponent)
    setComponents(newComponents)
    setSelectedComponent(newComponent.id)
    
    toast.success("Component duplicated", {
      duration: 2000,
      position: "bottom-right",
    })
  }

  const handleSendEmail = async () => {
    if (!emailRecipient) {
      toast.error("Please enter recipient email", {
        duration: 3000,
        position: "bottom-right",
      })
      return
    }
    
    if (!emailRecipient || !emailSubject) {
      toast({
        title: "Missing fields",
        description: "Recipient email and subject are required.",
        variant: "destructive",
      })
      return
    }

    setIsSending(true)

    try {
      const componentHTML = components.map(comp => {
        const styles = Object.entries(comp.styles)
          .filter(([key]) => !key.includes("Url") && key !== "src" && key !== "alt" && key !== "href")
          .map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value}`)
          .join("; ")

        switch (comp.type) {
          case "text":
            return `<div style="${styles}">${comp.content}</div>`
          case "image":
            return `<img src="${comp.styles.src || 'https://via.placeholder.com/400x200'}" style="${styles}" />`
          case "button":
            return `<a href="${comp.styles.href || '#'}" style="display:inline-block;${styles}">${comp.content}</a>`
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
      const html = `<div style="max-width:600px;margin:0 auto">${componentHTML}</div>`

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

      if (response.ok) {
        toast.success("✅ Email sent successfully!", {
          duration: 4000,
          position: "bottom-right",
        })
        setEmailRecipient("")
      } else {
        const error = await response.json()
        toast.error(`❌ Failed: ${error.error}`, {
          duration: 4000,
          position: "bottom-right",
        })
      }
    } catch (error) {
      toast.error("❌ Network error", {
        duration: 4000,
        position: "bottom-right",
          html
        })
      })

      if (!response.ok) {
        const err = await response.json()
        throw new Error(err?.error || "Failed to send email")
      }

      toast({
        title: "Email sent successfully",
        description: "Your email was delivered successfully.",
      })

      setEmailRecipient("")
      setEmailSubject("")
    } catch (error: any) {
      toast({
        title: "Email sending failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSending(false)
    }
  }

  const selectedComponentData = selectedComponent 
    ? components.find(c => c.id === selectedComponent) 
    : null

  const handleCopyHTML = () => {
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
          return `<div style="${styles}">${comp.content}</div>`
        case "divider":
          return `<hr style="${styles}" />`
        default:
          return ""
      }
    }).join("\n")

    navigator.clipboard.writeText(componentHTML)
    toast.success("HTML copied to clipboard!", {
      duration: 2000,
      position: "bottom-right",
      icon: "📋",
    })
  }

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email)
    toast.success("Email copied to clipboard!", {
      duration: 2000,
      position: "bottom-right",
      icon: "📧",
    })
  }

  const loadTemplate = (templateComponents: EmailComponent[]) => {
    setComponents(templateComponents)
    setSelectedComponent(null)
    toast.success("Template loaded!", {
      duration: 2000,
      position: "bottom-right",
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Toaster
        toastOptions={{
          className: "dark:bg-gray-800 dark:text-white",
        }}
      />
      
      <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="dark:hover:bg-gray-700">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-purple-500" />
                <h1 className="text-xl font-bold dark:text-white">Email Builder</h1>
                <Badge variant="outline" className="ml-2">
                  {components.length} components
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <Button
                  variant={previewMode === "desktop" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setPreviewMode("desktop")}
                  className="dark:hover:bg-gray-600"
                >
                  <Monitor className="h-4 w-4" />
                </Button>
                <Button
                  variant={previewMode === "mobile" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setPreviewMode("mobile")}
                  className="dark:hover:bg-gray-600"
                >
                  <Smartphone className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Input
                    placeholder="📧 Email"
                    value={emailRecipient}
                    onChange={(e) => setEmailRecipient(e.target.value)}
                    className="w-40 dark:bg-gray-700 dark:border-gray-600"
                  />
                  {emailRecipient && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                      onClick={() => handleCopyEmail(emailRecipient)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  )}
                </div>
                <Input
                  placeholder="📝 Subject"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="w-40 dark:bg-gray-700 dark:border-gray-600"
                />
                <Button
                  onClick={handleCopyHTML}
                  variant="outline"
                  className="dark:border-gray-600 dark:hover:bg-gray-700"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy HTML
                </Button>
                <Button
                  onClick={handleSendEmail}
                  disabled={!emailRecipient || isSending}
                  className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                >
                  {isSending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        <DragDropContext onDragEnd={handleDragEnd}>
          {/* Left Sidebar - Components */}
          <div className="w-80 bg-white dark:bg-gray-800 border-r dark:border-gray-700 overflow-y-auto">
            <div className="p-4">
              <Tabs defaultValue="components" className="w-full">
                <TabsList className="grid w-full grid-cols-3 dark:bg-gray-700">
                  <TabsTrigger value="components" className="dark:data-[state=active]:bg-gray-600">
                    <Layers className="h-4 w-4 mr-2" />
                    Components
                  </TabsTrigger>
                  <TabsTrigger value="templates" className="dark:data-[state=active]:bg-gray-600">
                    <Palette className="h-4 w-4 mr-2" />
                    Templates
                  </TabsTrigger>
                  <TabsTrigger value="properties" className="dark:data-[state=active]:bg-gray-600">
                    <Type className="h-4 w-4 mr-2" />
                    Properties
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="components" className="mt-4">
                  <Card className="dark:bg-gray-900 dark:border-gray-700">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Drag & Drop Components</CardTitle>
                      <CardDescription className="dark:text-gray-400">
                        Drag components to the canvas
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Droppable droppableId="components" isDropDisabled={true}>
                        {(provided) => (
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="space-y-3"
                          >
                            {[
                              { id: "text", icon: <Type className="h-4 w-4" />, label: "Text", desc: "Add text content" },
                              { id: "image", icon: <Image className="h-4 w-4" />, label: "Image", desc: "Insert images" },
                              { id: "button", icon: <MousePointerClick className="h-4 w-4" />, label: "Button", desc: "Call-to-action buttons" },
                              { id: "social", icon: <Users className="h-4 w-4" />, label: "Social", desc: "Social media links" },
                              { id: "divider", icon: <Minus className="h-4 w-4" />, label: "Divider", desc: "Horizontal lines" },
                            ].map((item, index) => (
                              <Draggable key={item.id} draggableId={item.id} index={index}>
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className={`p-3 border rounded-lg cursor-move transition-all ${
                                      snapshot.isDragging
                                        ? "bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700"
                                        : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600"
                                    }`}
                                  >
                                    <div className="flex items-center gap-3">
                                      <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded">
                                        {item.icon}
                                      </div>
                                      <div>
                                        <p className="font-medium text-sm dark:text-white">{item.label}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{item.desc}</p>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="templates" className="mt-4">
                  <Card className="dark:bg-gray-900 dark:border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-sm">Email Templates</CardTitle>
                      <CardDescription className="dark:text-gray-400">
                        Pre-designed templates
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button
                        variant="outline"
                        className="w-full justify-start h-auto py-3 dark:border-gray-600 dark:hover:bg-gray-700"
                        onClick={() => loadTemplate([
                          {
                            id: "welcome-header",
                            type: "text",
                            content: "Welcome to Our Service!",
                            styles: { fontSize: "28px", color: "#333333", padding: "24px", textAlign: "center", fontWeight: "bold" }
                          },
                          {
                            id: "welcome-image",
                            type: "image",
                            content: "",
                            styles: { width: "100%", height: "250px", padding: "0", src: "https://via.placeholder.com/600x250", alt: "Welcome Image" }
                          },
                          {
                            id: "welcome-message",
                            type: "text",
                            content: "Thank you for joining us. We're excited to have you on board!",
                            styles: { fontSize: "16px", color: "#666666", padding: "20px", textAlign: "center", lineHeight: "1.6" }
                          },
                          {
                            id: "welcome-button",
                            type: "button",
                            content: "Get Started",
                            styles: { backgroundColor: "#007bff", color: "#ffffff", padding: "14px 32px", borderRadius: "6px", textAlign: "center", fontSize: "16px", fontWeight: "bold", href: "#", margin: "0 auto", display: "block", width: "fit-content" }
                          }
                        ])}
                      >
                        <div className="text-left">
                          <p className="font-medium">Welcome Email</p>
                          <p className="text-xs text-gray-500">Perfect for onboarding</p>
                        </div>
                      </Button>
                      
                      <Button
                        variant="outline"
                        className="w-full justify-start h-auto py-3 dark:border-gray-600 dark:hover:bg-gray-700"
                        onClick={() => loadTemplate([
                          {
                            id: "newsletter-header",
                            type: "text",
                            content: "Weekly Newsletter",
                            styles: { fontSize: "24px", color: "#333333", padding: "20px", textAlign: "center", fontWeight: "bold" }
                          },
                          {
                            id: "newsletter-divider",
                            type: "divider",
                            content: "",
                            styles: { height: "1px", backgroundColor: "#e0e0e0", padding: "10px 0" }
                          },
                          {
                            id: "newsletter-content",
                            type: "text",
                            content: "Here are this week's updates and insights...",
                            styles: { fontSize: "14px", color: "#555555", padding: "16px", textAlign: "left", lineHeight: "1.6" }
                          },
                          {
                            id: "newsletter-social",
                            type: "social",
                            content: "Follow us for more updates",
                            styles: { padding: "20px", textAlign: "center", fontSize: "14px", color: "#374151" }
                          }
                        ])}
                      >
                        <div className="text-left">
                          <p className="font-medium">Newsletter</p>
                          <p className="text-xs text-gray-500">Weekly updates template</p>
                        </div>
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="properties" className="mt-4">
                  {selectedComponentData ? (
                    <Card className="dark:bg-gray-900 dark:border-gray-700">
                      <CardHeader>
                        <CardTitle className="text-sm flex items-center justify-between">
                          <span>Properties</span>
                          <Badge variant="outline" className="capitalize">
                            {selectedComponentData.type}
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label htmlFor="content">Content</Label>
                          <Textarea
                            id="content"
                            value={selectedComponentData.content}
                            onChange={(e) => updateComponent(selectedComponentData.id, { content: e.target.value })}
                            className="mt-1 dark:bg-gray-800 dark:border-gray-600"
                            rows={3}
                          />
                        </div>
                        
                        {selectedComponentData.type === "text" && (
                          <>
                            <div>
                              <Label htmlFor="fontSize">Font Size (px)</Label>
                              <Input
                                id="fontSize"
                                type="number"
                                value={parseInt(selectedComponentData.styles.fontSize || "16")}
                                onChange={(e) => updateComponent(selectedComponentData.id, {
                                  styles: { ...selectedComponentData.styles, fontSize: `${e.target.value}px` }
                                })}
                                className="mt-1 dark:bg-gray-800 dark:border-gray-600"
                              />
                            </div>
                            <div>
                              <Label htmlFor="color">Text Color</Label>
                              <Input
                                id="color"
                                type="color"
                                value={selectedComponentData.styles.color || "#333333"}
                                onChange={(e) => updateComponent(selectedComponentData.id, {
                                  styles: { ...selectedComponentData.styles, color: e.target.value }
                                })}
                                className="mt-1 h-10 w-full p-1 dark:bg-gray-800 dark:border-gray-600"
                              />
                            </div>
                          </>
                        )}
                        
                        {selectedComponentData.type === "button" && (
                          <>
                            <div>
                              <Label htmlFor="bgColor">Background Color</Label>
                              <Input
                                id="bgColor"
                                type="color"
                                value={selectedComponentData.styles.backgroundColor || "#007bff"}
                                onChange={(e) => updateComponent(selectedComponentData.id, {
                                  styles: { ...selectedComponentData.styles, backgroundColor: e.target.value }
                                })}
                                className="mt-1 h-10 w-full p-1 dark:bg-gray-800 dark:border-gray-600"
                              />
                            </div>
                            <div>
                              <Label htmlFor="href">Link URL</Label>
                              <Input
                                id="href"
                                value={selectedComponentData.styles.href || "#"}
                                onChange={(e) => updateComponent(selectedComponentData.id, {
                                  styles: { ...selectedComponentData.styles, href: e.target.value }
                                })}
                                className="mt-1 dark:bg-gray-800 dark:border-gray-600"
                              />
                            </div>
                          </>
                        )}
                        
                        <div className="flex gap-2 pt-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => duplicateComponent(selectedComponentData.id)}
                            className="flex-1 dark:border-gray-600 dark:hover:bg-gray-700"
                          >
                            <Copy className="h-4 w-4 mr-2" />
                            Duplicate
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteComponent(selectedComponentData.id)}
                            className="flex-1"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="dark:bg-gray-900 dark:border-gray-700">
                      <CardContent className="py-8 text-center">
                        <Type className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-500 dark:text-gray-400">Select a component to edit its properties</p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Main Canvas */}
          <div className="flex-1 bg-gray-100 dark:bg-gray-900 overflow-auto">
            <div className="p-6">
              <div className={`mx-auto bg-white dark:bg-gray-800 shadow-xl rounded-lg border dark:border-gray-700 transition-all ${
                previewMode === "mobile" ? "max-w-sm" : "max-w-2xl"
              }`}>
                <div className="border-b dark:border-gray-700 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="text-sm font-medium dark:text-gray-300">
                      {previewMode === "mobile" ? "📱 Mobile Preview" : "🖥️ Desktop Preview"}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {components.length} components
                    </div>
                  </div>
                </div>
                
                <Droppable droppableId="canvas">
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={`min-h-[500px] p-4 ${
                        snapshot.isDraggingOver 
                          ? "bg-blue-50/50 dark:bg-blue-900/20" 
                          : "bg-white dark:bg-gray-800"
                      }`}
                    >
                      {components.length === 0 ? (
                        <div className="text-center py-16">
                          <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 mb-4">
                            <Palette className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                            <p className="text-gray-500 dark:text-gray-400 mb-2">Drag components here</p>
                            <p className="text-sm text-gray-400 dark:text-gray-500">Start building your email template</p>
                          </div>
                        </div>
                      ) : (
                        components.map((component, index) => (
                          <Draggable key={component.id} draggableId={component.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`mb-3 relative group ${
                                  snapshot.isDragging ? "opacity-50" : ""
                                }`}
                                onClick={() => setSelectedComponent(component.id)}
                              >
                                <div className={`absolute inset-0 border-2 ${
                                  selectedComponent === component.id
                                    ? "border-blue-500 dark:border-blue-400"
                                    : "border-transparent group-hover:border-gray-300 dark:group-hover:border-gray-600"
                                } rounded-lg pointer-events-none transition-all`}></div>
                                
                                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                  <Button
                                    variant="secondary"
                                    size="sm"
                                    className="h-6 w-6 p-0"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      duplicateComponent(component.id)
                                    }}
                                  >
                                    <Copy className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    className="h-6 w-6 p-0"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      deleteComponent(component.id)
                                    }}
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                                
                                <div className="p-4 bg-white dark:bg-gray-900 rounded-lg">
                                  {component.type === "text" && (
                                    <div
                                      style={{
                                        fontSize: component.styles.fontSize,
                                        color: component.styles.color,
                                        padding: component.styles.padding,
                                        textAlign: component.styles.textAlign,
                                        fontWeight: component.styles.fontWeight,
                                        lineHeight: component.styles.lineHeight,
                                      }}
                                    >
                                      {component.content}
                                    </div>
                                  )}
                                  
                                  {component.type === "image" && (
                                    <img
                                      src={component.styles.src}
                                      alt={component.styles.alt}
                                      style={{
                                        width: component.styles.width,
                                        height: component.styles.height,
                                        padding: component.styles.padding,
                                      }}
                                      className="rounded"
                                    />
                                  )}
                                  
                                  {component.type === "button" && (
                                    <a
                                      href={component.styles.href}
                                      style={{
                                        backgroundColor: component.styles.backgroundColor,
                                        color: component.styles.color,
                                        padding: component.styles.padding,
                                        borderRadius: component.styles.borderRadius,
                                        textAlign: component.styles.textAlign,
                                        fontSize: component.styles.fontSize,
                                        fontWeight: component.styles.fontWeight,
                                        display: component.styles.display,
                                        margin: component.styles.margin,
                                        width: component.styles.width,
                                      }}
                                      className="inline-block no-underline"
                                    >
                                      {component.content}
                                    </a>
                                  )}
                                  
                                  {component.type === "social" && (
                                    <div style={{ padding: component.styles.padding, textAlign: component.styles.textAlign }}>
                                      <div className="flex justify-center gap-3 mb-3">
                                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">f</div>
                                        <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center text-white font-bold">𝕏</div>
                                        <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 via-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">📷</div>
                                        <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center text-white font-bold">in</div>
                                      </div>
                                      <p style={{ fontSize: component.styles.fontSize, color: component.styles.color }}>
                                        {component.content}
                                      </p>
                                    </div>
                                  )}
                                  
                                  {component.type === "divider" && (
                                    <hr style={{
                                      height: component.styles.height,
                                      backgroundColor: component.styles.backgroundColor,
                                      padding: component.styles.padding,
                                      border: 'none',
                                    }} />
                                  )}
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
  const selectedComponentData =
    selectedComponent ? components.find(c => c.id === selectedComponent) : null

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-black border-b shadow-sm px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Button>
          </Link>
          <h1 className="text-xl font-bold">🎨 Email Builder</h1>
        </div>

        <div className="flex items-center gap-3">
          <Input
            placeholder="📧 Email"
            value={emailRecipient}
            onChange={(e) => setEmailRecipient(e.target.value)}
            className="w-40"
          />
          <Input
            placeholder="📝 Subject"
            value={emailSubject}
            onChange={(e) => setEmailSubject(e.target.value)}
            className="w-40"
          />
          <Button
            onClick={handleSendEmail}
            disabled={isSending}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isSending ? "Sending..." : (
              <>
                <Send className="h-4 w-4 mr-2" /> Send
              </>
            )}
          </Button>
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex h-[calc(100vh-80px)]">
          <div className="w-80 bg-white border-r p-4">
            <Tabs defaultValue="components">
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="components">📦</TabsTrigger>
                <TabsTrigger value="templates">📚</TabsTrigger>
                <TabsTrigger value="properties">⚙️</TabsTrigger>
              </TabsList>

              <TabsContent value="components">
                <DragComponents />
              </TabsContent>
              <TabsContent value="templates">
                <TemplateGallery onSelectTemplate={loadTemplate} />
              </TabsContent>
              <TabsContent value="properties">
                <PropertiesPanel
                  component={selectedComponentData}
                  onUpdate={(u) => selectedComponent && updateComponent(selectedComponent, u)}
                  onDelete={() => selectedComponent && deleteComponent(selectedComponent)}
                />
              </TabsContent>
            </Tabs>
          </div>

          <div className="flex-1 bg-gray-100 p-6 overflow-auto">
            <div className="max-w-2xl mx-auto bg-white border rounded-lg shadow">
              <LivePreview
                components={components}
                selectedComponent={selectedComponent}
                onSelectComponent={setSelectedComponent}
                onDeleteComponent={deleteComponent}
                onUpdateComponent={updateComponent}
              />
            </div>
          </div>
        </div>
      </DragDropContext>
    </div>
  )
}
