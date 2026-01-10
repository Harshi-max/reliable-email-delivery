"use client"

import { useState, useCallback } from "react"
import { DragDropContext } from "@hello-pangea/dnd"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Send } from "lucide-react"
import Link from "next/link"
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
  const [components, setComponents] = useState<EmailComponent[]>([])
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null)
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop")
  const [emailSubject, setEmailSubject] = useState("")
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
        return { fontSize: "16px", color: "#333333", padding: "16px", textAlign: "left" as const }
      case "image":
        return { width: "100%", height: "200px", padding: "10px" }
      case "button":
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
        return { padding: "20px", textAlign: "center" as const }
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
  }

  const handleSendEmail = async () => {
    if (isSending) return   // ✅ guard added

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

      const html = `<div style="max-width:600px;margin:0 auto">${componentHTML}</div>`

      const response = await fetch("/api/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: emailRecipient,
          subject: emailSubject,
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

  const loadTemplate = (templateComponents: EmailComponent[]) => {
    setComponents(templateComponents)
    setSelectedComponent(null)
  }

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
