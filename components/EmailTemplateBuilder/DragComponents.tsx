"use client"

import { Droppable, Draggable } from "@hello-pangea/dnd"
import { Card, CardContent } from "@/components/ui/card"
import { Type, Image, MousePointer, Share2, Minus } from "lucide-react"

const components = [
  { id: "text", name: "Text Block", icon: Type, emoji: "📝", description: "Add headings & paragraphs", color: "bg-blue-50 border-blue-200" },
  { id: "image", name: "Image", icon: Image, emoji: "🖼️", description: "Add photos & graphics", color: "bg-green-50 border-green-200" },
  { id: "button", name: "Button", icon: MousePointer, emoji: "🔗", description: "Call-to-action links", color: "bg-purple-50 border-purple-200" },
  { id: "social", name: "Social Media", icon: Share2, emoji: "🌐", description: "Social media icons", color: "bg-pink-50 border-pink-200" },
  { id: "divider", name: "Divider", icon: Minus, emoji: "➖", description: "Section separators", color: "bg-gray-50 border-gray-200" }
]

export function DragComponents() {
  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="font-bold text-lg text-gray-800 mb-2">📦 Components</h3>
        <p className="text-xs text-gray-500">Drag & drop to build your email</p>
      </div>
      
      <Droppable droppableId="components" isDropDisabled={true}>
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
            {components.map((component, index) => (
              <Draggable key={component.id} draggableId={component.id} index={index}>
                {(provided, snapshot) => (
                  <Card
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`cursor-grab active:cursor-grabbing transition-all duration-200 border-2 ${
                      snapshot.isDragging 
                        ? "shadow-2xl rotate-3 scale-105 z-50 bg-white" 
                        : `hover:shadow-lg hover:scale-102 ${component.color}`
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{component.emoji}</div>
                        <div className="flex-1">
                          <p className="font-semibold text-sm text-gray-800">{component.name}</p>
                          <p className="text-xs text-gray-500 mt-1">{component.description}</p>
                        </div>
                        <div className="opacity-30">
                          <component.icon className="h-4 w-4" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      
      <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <div className="text-center">
          <div className="text-lg mb-1">💡</div>
          <p className="text-xs text-blue-700 font-medium">Pro Tip</p>
          <p className="text-xs text-blue-600 mt-1">Click components in the canvas to edit their properties</p>
        </div>
      </div>
    </div>
  )
}