"use client"

import { useState } from "react"
import { Droppable, Draggable } from "@hello-pangea/dnd"
import { EmailComponent } from "./Builder"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"

interface LivePreviewProps {
  components: EmailComponent[]
  selectedComponent: string | null
  onSelectComponent: (id: string) => void
  onDeleteComponent: (id: string) => void
  onUpdateComponent: (id: string, updates: Partial<EmailComponent>) => void
}

export function LivePreview({ components, selectedComponent, onSelectComponent, onDeleteComponent, onUpdateComponent }: LivePreviewProps) {
  const [editingComponent, setEditingComponent] = useState<string | null>(null)
  const [editValue, setEditValue] = useState("")

  const handleDoubleClick = (component: EmailComponent) => {
    if (component.type === "text" || component.type === "button" || component.type === "social") {
      setEditingComponent(component.id)
      setEditValue(component.content)
    }
  }

  const handleSaveEdit = (componentId: string) => {
    onUpdateComponent(componentId, { content: editValue })
    setEditingComponent(null)
    setEditValue("")
  }

  const handleCancelEdit = () => {
    setEditingComponent(null)
    setEditValue("")
  }

  const renderEditableContent = (component: EmailComponent) => {
    if (editingComponent === component.id) {
      if (component.type === "text") {
        return (
          <Textarea
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={() => handleSaveEdit(component.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.ctrlKey) {
                handleSaveEdit(component.id)
              }
              if (e.key === "Escape") {
                handleCancelEdit()
              }
            }}
            autoFocus
            className="w-full resize-none border-2 border-blue-500 rounded"
            style={{
              fontSize: component.styles.fontSize || "16px",
              color: component.styles.color || "#333333",
              fontWeight: component.styles.fontWeight || "normal",
              textAlign: component.styles.textAlign || "left",
              backgroundColor: "white",
              padding: component.styles.padding || "16px",
              minHeight: "80px",
              lineHeight: "1.6",
              fontFamily: "inherit"
            }}
            rows={Math.max(3, editValue.split('\n').length)}
          />
        )
      } else {
        return (
          <Input
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={() => handleSaveEdit(component.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSaveEdit(component.id)
              }
              if (e.key === "Escape") {
                handleCancelEdit()
              }
            }}
            autoFocus
            className="w-full border-2 border-blue-500 rounded"
            style={{
              fontSize: component.styles.fontSize || "16px",
              color: component.styles.color || "#333333",
              fontWeight: component.styles.fontWeight || "bold",
              textAlign: component.styles.textAlign || "center",
              backgroundColor: component.styles.backgroundColor || "#007bff",
              padding: component.styles.padding || "12px 24px",
              minHeight: "44px",
              fontFamily: "inherit"
            }}
          />
        )
      }
    }
    return null
  }

  const formatTextContent = (content: string) => {
    return content.split('\n').map((line, index) => (
      <div key={index} style={{ lineHeight: "1.6", marginBottom: index < content.split('\n').length - 1 ? "8px" : "0" }}>
        {line || "\u00A0"}
      </div>
    ))
  }
  const renderComponent = (component: EmailComponent, isDragging: boolean) => {
    const isSelected = selectedComponent === component.id
    const baseStyles = {
      ...component.styles,
      cursor: "pointer",
      border: isSelected ? "2px solid #3b82f6" : "2px solid transparent",
      borderRadius: "4px",
      position: "relative" as const,
      minHeight: "40px",
      display: "flex",
      alignItems: "center",
      opacity: isDragging ? 0.5 : 1
    }

    const handleClick = (e: React.MouseEvent) => {
      e.stopPropagation()
      onSelectComponent(component.id)
    }

    switch (component.type) {
      case "text":
        return (
          <div
            style={{
              ...baseStyles,
              padding: component.styles.padding || "16px",
              lineHeight: "1.6",
              whiteSpace: "pre-wrap"
            }}
            onClick={handleClick}
            onDoubleClick={() => handleDoubleClick(component)}
            className="hover:border-blue-300 transition-all group cursor-text"
            title="Double-click to edit"
          >
            <div className="flex-1">
              {editingComponent === component.id ? (
                renderEditableContent(component)
              ) : (
                <div style={{ 
                  fontSize: component.styles.fontSize || "16px",
                  color: component.styles.color || "#333333",
                  fontWeight: component.styles.fontWeight || "normal",
                  textAlign: component.styles.textAlign || "left"
                }}>
                  {component.content ? formatTextContent(component.content) : (
                    <div className="text-gray-400 italic">📝 Double-click to add text</div>
                  )}
                </div>
              )}
            </div>
            {isSelected && !editingComponent && (
              <div className="absolute -top-2 -right-2 flex gap-1">
                <Button
                  size="sm"
                  variant="destructive"
                  className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDeleteComponent(component.id)
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
                <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">Text</div>
              </div>
            )}
          </div>
        )

      case "image":
        return (
          <div
            style={{ ...baseStyles, flexDirection: "column", minHeight: "120px" }}
            onClick={handleClick}
            className="hover:border-blue-300 transition-all group bg-gray-50"
          >
            {component.styles.src ? (
              <img
                src={component.styles.src}
                alt={component.styles.alt || "Image"}
                className="max-w-full h-auto rounded"
                style={{ maxHeight: "200px" }}
              />
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <div className="text-4xl mb-2">🖼️</div>
                  <div className="text-sm">Click to add image</div>
                </div>
              </div>
            )}
            {isSelected && (
              <div className="absolute -top-2 -right-2 flex gap-1">
                <Button
                  size="sm"
                  variant="destructive"
                  className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDeleteComponent(component.id)
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
                <div className="bg-green-500 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">Image</div>
              </div>
            )}
          </div>
        )

      case "button":
        return (
          <div style={{ textAlign: component.styles.textAlign || "center", padding: "10px" }}>
            {editingComponent === component.id ? (
              <div style={{
                display: "inline-block",
                minWidth: "120px",
                minHeight: "44px"
              }}>
                {renderEditableContent(component)}
              </div>
            ) : (
              <div
                style={{
                  ...baseStyles,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textDecoration: "none",
                  minWidth: "120px",
                  minHeight: "44px",
                  cursor: "pointer"
                }}
                onClick={handleClick}
                onDoubleClick={() => handleDoubleClick(component)}
                className="hover:border-blue-300 transition-all group"
                title="Double-click to edit"
              >
                <span className="mr-2">🔗</span>
                <span style={{
                  fontSize: component.styles.fontSize || "16px",
                  fontWeight: component.styles.fontWeight || "bold"
                }}>
                  {component.content || "Click Me"}
                </span>
                {isSelected && !editingComponent && (
                  <div className="absolute -top-2 -right-2 flex gap-1">
                    <Button
                      size="sm"
                      variant="destructive"
                      className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation()
                        onDeleteComponent(component.id)
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                    <div className="bg-purple-500 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">Button</div>
                  </div>
                )}
              </div>
            )}
          </div>
        )

      case "social":
        return (
          <div
            style={baseStyles}
            onClick={handleClick}
            onDoubleClick={() => handleDoubleClick(component)}
            className="hover:border-blue-300 transition-all group cursor-pointer"
            title="Double-click to edit"
          >
            <div className="flex-1 p-4">
              <div className="flex justify-center gap-4 mb-4">
                <a href="#" className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg hover:bg-blue-700 transition-colors shadow-lg">
                  f
                </a>
                <a href="#" className="w-12 h-12 bg-sky-500 rounded-full flex items-center justify-center text-white font-bold text-lg hover:bg-sky-600 transition-colors shadow-lg">
                  𝕏
                </a>
                <a href="#" className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg">
                  📷
                </a>
                <a href="#" className="w-12 h-12 bg-blue-700 rounded-full flex items-center justify-center text-white font-bold text-lg hover:bg-blue-800 transition-colors shadow-lg">
                  in
                </a>
                <a href="#" className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-lg hover:bg-red-700 transition-colors shadow-lg">
                  ▶
                </a>
              </div>
              {editingComponent === component.id ? (
                <div className="text-center" style={{ minHeight: "28px" }}>
                  {renderEditableContent(component)}
                </div>
              ) : (
                <p className="text-center font-medium" style={{
                  fontSize: component.styles.fontSize || "16px",
                  color: component.styles.color || "#374151",
                  minHeight: "28px",
                  lineHeight: "1.6"
                }}>
                  {component.content || "🌐 Follow us on social media"}
                </p>
              )}
            </div>
            {isSelected && !editingComponent && (
              <div className="absolute -top-2 -right-2 flex gap-1">
                <Button
                  size="sm"
                  variant="destructive"
                  className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDeleteComponent(component.id)
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
                <div className="bg-pink-500 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">Social</div>
              </div>
            )}
          </div>
        )

      case "divider":
        return (
          <div
            style={{ padding: component.styles.padding || "20px 10px" }}
            onClick={handleClick}
            className="hover:bg-blue-50 transition-all group"
          >
            <hr
              style={{
                height: component.styles.height || "2px",
                backgroundColor: component.styles.backgroundColor || "#e5e7eb",
                border: "none",
                margin: 0,
                borderRadius: "1px",
                outline: isSelected ? "2px solid #3b82f6" : "none"
              }}
            />
            {isSelected && (
              <div className="absolute top-0 right-0 flex gap-1">
                <Button
                  size="sm"
                  variant="destructive"
                  className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDeleteComponent(component.id)
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
                <div className="bg-gray-500 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">➖ Divider</div>
              </div>
            )}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-96 p-6 bg-white">
      <Droppable droppableId="canvas">
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={`min-h-full rounded-lg transition-all ${
              snapshot.isDraggingOver 
                ? "bg-blue-50 border-2 border-dashed border-blue-400 shadow-inner" 
                : "border-2 border-dashed border-gray-200"
            }`}
            onClick={() => onSelectComponent("")}
          >
            {components.length === 0 && (
              <div className="text-center py-20 text-gray-400">
                <div className="text-6xl mb-4">📧</div>
                <p className="text-xl mb-2 font-medium">Start Building Your Email</p>
                <p className="text-sm">Drag components from the sidebar to create your template</p>
              </div>
            )}
            
            {components.map((component, index) => (
              <Draggable key={component.id} draggableId={component.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`mb-2 ${
                      snapshot.isDragging ? "shadow-2xl rotate-1 z-50" : "hover:shadow-md"
                    } transition-all duration-200`}
                    style={{
                      ...provided.draggableProps.style,
                      transform: snapshot.isDragging 
                        ? `${provided.draggableProps.style?.transform} rotate(2deg)` 
                        : provided.draggableProps.style?.transform
                    }}
                  >
                    {renderComponent(component, snapshot.isDragging)}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  )
}