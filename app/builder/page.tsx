"use client"

import { useState, useCallback } from "react"
import { DragDropContext } from "@hello-pangea/dnd"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Send, Smartphone, Monitor } from "lucide-react"
import Link from "next/link"
import { DragComponents } from "@/components/EmailTemplateBuilder/DragComponents"
import { PropertiesPanel } from "@/components/EmailTemplateBuilder/PropertiesPanel"
import { LivePreview } from "@/components/EmailTemplateBuilder/LivePreview"
import { TemplateGallery } from "@/components/EmailTemplateBuilder/TemplateGallery"
import { EmailComponent } from "@/components/EmailTemplateBuilder/Builder"

export default function EmailBuilderPage() {
  const [components, setComponents] = useState<EmailComponent[]>([])
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null)
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop")
  const [emailSubject, setEmailSubject] = useState("")
  const [emailRecipient, setEmailRecipient] = useState("")
  const [isSending, setIsSending] = useState(false)

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
    } 
    else if (source.droppableId === "canvas" && destination.droppableId === "canvas") {
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
        return { fontSize: "16px", color: "#333333", padding: "16px", textAlign: "left" as const }
      case "image":
        return { width: "100%", height: "200px", padding: "10px" }
      case "button":
        return { backgroundColor: "#007bff", color: "#ffffff", padding: "12px 24px", borderRadius: "6px", textAlign: "center" as const, fontSize: "16px", fontWeight: "bold" as const }
      case "social":
        return { padding: "20px", textAlign: "center" as const }
      case "divider":
        return { height: "2px", backgroundColor: "#e0e0e0", padding: "10px 0" }
      default:
        return {}
    }
  }

  const updateComponent = (id: string, updates: Partial<EmailComponent>) => {
    setComponents(prev => prev.map(comp => 
      comp.id === id ? { ...comp, ...updates } : comp
    ))
  }

  const deleteComponent = (id: string) => {
    setComponents(prev => prev.filter(comp => comp.id !== id))
    setSelectedComponent(null)
  }

  const handleSendEmail = async () => {
    if (!emailRecipient || !emailSubject) return
    
    setIsSending(true)
    try {
      const componentHTML = components.map(comp => {
        const styles = Object.entries(comp.styles)
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

      const html = `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">${componentHTML}</div>`

      const response = await fetch("/api/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: emailRecipient,
          subject: emailSubject,
          body: html,
          html
        })
      })

      if (response.ok) {
        alert("✅ Email sent successfully!")
        setEmailRecipient("")
        setEmailSubject("")
      } else {
        const error = await response.json()
        alert(`❌ Failed: ${error.error}`)
      }
    } catch (error) {
      alert("❌ Network error")
    } finally {
      setIsSending(false)
    }
  }

  const loadTemplate = (templateComponents: EmailComponent[]) => {
    setComponents(templateComponents)
    setSelectedComponent(null)
  }

  const selectedComponentData = selectedComponent 
    ? components.find(c => c.id === selectedComponent) 
    : null

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <h1 className="text-xl font-bold">🎨 Email Builder</h1>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                <Button
                  variant={previewMode === "desktop" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setPreviewMode("desktop")}
                >
                  <Monitor className="h-4 w-4" />
                </Button>
                <Button
                  variant={previewMode === "mobile" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setPreviewMode("mobile")}
                >
                  <Smartphone className="h-4 w-4" />
                </Button>
              </div>
              
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
                disabled={!emailRecipient || !emailSubject || isSending}
                className="bg-blue-600 hover:bg-blue-700"
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

      <div className="flex h-[calc(100vh-80px)]">
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="w-80 bg-white border-r overflow-y-auto">
            <div className="p-4">
              <Tabs defaultValue="components" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="components" className="text-xs">📦</TabsTrigger>
                  <TabsTrigger value="templates" className="text-xs">📚</TabsTrigger>
                  <TabsTrigger value="properties" className="text-xs">⚙️</TabsTrigger>
                </TabsList>
                
                <TabsContent value="components" className="mt-4">
                  <DragComponents />
                </TabsContent>
                
                <TabsContent value="templates" className="mt-4">
                  <TemplateGallery onSelectTemplate={loadTemplate} />
                </TabsContent>
                
                <TabsContent value="properties" className="mt-4">
                  <PropertiesPanel
                    component={selectedComponentData}
                    onUpdate={(updates) => selectedComponent && updateComponent(selectedComponent, updates)}
                    onDelete={() => selectedComponent && deleteComponent(selectedComponent)}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </div>

          <div className="flex-1 bg-gray-100 overflow-auto">
            <div className="p-6">
              <div className={`mx-auto bg-white shadow-xl rounded-lg border transition-all ${
                previewMode === "mobile" ? "max-w-sm" : "max-w-2xl"
              }`}>
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
    </div>
  )
}