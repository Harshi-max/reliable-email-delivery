"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, Settings, Palette, Type, Link, Image } from "lucide-react"
import { EmailComponent } from "./Builder"

interface PropertiesPanelProps {
  component: EmailComponent | null
  onUpdate: (updates: Partial<EmailComponent>) => void
  onDelete: () => void
}

export function PropertiesPanel({ component, onUpdate, onDelete }: PropertiesPanelProps) {
  if (!component) {
    return (
      <div className="text-center py-12">
        <div className="mb-4">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Settings className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="font-semibold text-gray-700 mb-2">🎨 Style Panel</h3>
          <p className="text-gray-500 text-sm mb-4">Select a component to customize its appearance</p>
          <div className="text-xs text-gray-400 bg-gray-50 p-3 rounded-lg">
            💡 <strong>Pro Tip:</strong> Double-click any text to edit directly in the canvas
          </div>
        </div>
      </div>
    )
  }

  const updateContent = (content: string) => {
    onUpdate({ content })
  }

  const updateStyle = (key: string, value: string) => {
    onUpdate({
      styles: {
        ...component.styles,
        [key]: value
      }
    })
  }

  const getComponentIcon = () => {
    switch (component.type) {
      case "text": return { icon: Type, emoji: "📝", color: "text-blue-600" }
      case "image": return { icon: Image, emoji: "🖼️", color: "text-green-600" }
      case "button": return { icon: Link, emoji: "🔗", color: "text-purple-600" }
      case "social": return { icon: Link, emoji: "🌐", color: "text-pink-600" }
      case "divider": return { icon: Type, emoji: "➖", color: "text-gray-600" }
      default: return { icon: Settings, emoji: "⚙️", color: "text-gray-600" }
    }
  }

  const { icon: Icon, emoji, color } = getComponentIcon()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border">
        <div className="flex items-center gap-3">
          <div className="text-xl">{emoji}</div>
          <div>
            <h3 className="font-bold text-sm text-gray-800 capitalize">{component.type} Properties</h3>
            <p className="text-xs text-gray-500">Customize your component</p>
          </div>
        </div>
        <Button variant="destructive" size="sm" onClick={onDelete} className="h-8 w-8 p-0">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <Card className="border-2">
        <CardContent className="p-4 space-y-4">
          {/* Quick Edit Note */}
          {(component.type === "text" || component.type === "button" || component.type === "social") && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs">
              📝 <strong>Quick Edit:</strong> Double-click the component in canvas to edit text directly
            </div>
          )}

          {/* Content Section - Only for non-editable inline components */}
          {component.type === "image" && (
            <div className="space-y-3">
              <div>
                <Label className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                  <Image className="h-3 w-3" />
                  Image URL
                </Label>
                <Input
                  value={component.styles.src || ""}
                  onChange={(e) => updateStyle("src", e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs font-semibold text-gray-700">Alt Text</Label>
                <Input
                  value={component.styles.alt || ""}
                  onChange={(e) => updateStyle("alt", e.target.value)}
                  placeholder="Describe your image"
                  className="mt-1"
                />
              </div>
            </div>
          )}

          {/* Button specific fields */}
          {component.type === "button" && (
            <div>
              <Label className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                <Link className="h-3 w-3" />
                Link URL
              </Label>
              <Input
                value={component.styles.href || ""}
                onChange={(e) => updateStyle("href", e.target.value)}
                placeholder="https://example.com"
                className="mt-1"
              />
            </div>
          )}

          {/* Social Media Links */}
          {component.type === "social" && (
            <div className="space-y-3">
              <Label className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                <Link className="h-3 w-3" />
                Social Media Links
              </Label>
              <div className="grid grid-cols-1 gap-2">
                <div>
                  <Label className="text-xs text-gray-600">Facebook URL</Label>
                  <Input
                    value={component.styles.facebookUrl || ""}
                    onChange={(e) => updateStyle("facebookUrl", e.target.value)}
                    placeholder="https://facebook.com/yourpage"
                    className="mt-1 h-8"
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-600">Twitter URL</Label>
                  <Input
                    value={component.styles.twitterUrl || ""}
                    onChange={(e) => updateStyle("twitterUrl", e.target.value)}
                    placeholder="https://twitter.com/yourhandle"
                    className="mt-1 h-8"
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-600">Instagram URL</Label>
                  <Input
                    value={component.styles.instagramUrl || ""}
                    onChange={(e) => updateStyle("instagramUrl", e.target.value)}
                    placeholder="https://instagram.com/yourhandle"
                    className="mt-1 h-8"
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-600">LinkedIn URL</Label>
                  <Input
                    value={component.styles.linkedinUrl || ""}
                    onChange={(e) => updateStyle("linkedinUrl", e.target.value)}
                    placeholder="https://linkedin.com/company/yourcompany"
                    className="mt-1 h-8"
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-600">YouTube URL</Label>
                  <Input
                    value={component.styles.youtubeUrl || ""}
                    onChange={(e) => updateStyle("youtubeUrl", e.target.value)}
                    placeholder="https://youtube.com/yourchannel"
                    className="mt-1 h-8"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Styling Section */}
          <div className="border-t pt-4">
            <Label className="text-xs font-semibold text-gray-700 flex items-center gap-1 mb-3">
              <Palette className="h-3 w-3" />
              Styling
            </Label>
            
            <div className="grid grid-cols-2 gap-3">
              {/* Text Alignment */}
              {component.type !== "divider" && (
                <div className="col-span-2">
                  <Label className="text-xs text-gray-600">Text Align</Label>
                  <Select
                    value={component.styles.textAlign || "left"}
                    onValueChange={(value) => updateStyle("textAlign", value)}
                  >
                    <SelectTrigger className="mt-1 h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="left">Left</SelectItem>
                      <SelectItem value="center">Center</SelectItem>
                      <SelectItem value="right">Right</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Font Size */}
              {(component.type === "text" || component.type === "button") && (
                <div>
                  <Label className="text-xs text-gray-600">Font Size</Label>
                  <Input
                    value={component.styles.fontSize || "16px"}
                    onChange={(e) => updateStyle("fontSize", e.target.value)}
                    className="mt-1 h-8"
                    placeholder="16px"
                  />
                </div>
              )}

              {/* Padding */}
              <div>
                <Label className="text-xs text-gray-600">Padding</Label>
                <Input
                  value={component.styles.padding || "10px"}
                  onChange={(e) => updateStyle("padding", e.target.value)}
                  className="mt-1 h-8"
                  placeholder="10px"
                />
              </div>
            </div>

            {/* Colors */}
            <div className="grid grid-cols-1 gap-3 mt-3">
              <div>
                <Label className="text-xs text-gray-600">Text Color</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    type="color"
                    value={component.styles.color || "#333333"}
                    onChange={(e) => updateStyle("color", e.target.value)}
                    className="w-12 h-8 p-1 rounded"
                  />
                  <Input
                    value={component.styles.color || "#333333"}
                    onChange={(e) => updateStyle("color", e.target.value)}
                    className="flex-1 h-8"
                  />
                </div>
              </div>

              {/* Background Color for buttons and dividers */}
              {(component.type === "button" || component.type === "divider") && (
                <div>
                  <Label className="text-xs text-gray-600">Background Color</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      type="color"
                      value={component.styles.backgroundColor || (component.type === "button" ? "#007bff" : "#e5e7eb")}
                      onChange={(e) => updateStyle("backgroundColor", e.target.value)}
                      className="w-12 h-8 p-1 rounded"
                    />
                    <Input
                      value={component.styles.backgroundColor || (component.type === "button" ? "#007bff" : "#e5e7eb")}
                      onChange={(e) => updateStyle("backgroundColor", e.target.value)}
                      className="flex-1 h-8"
                    />
                  </div>
                </div>
              )}

              {/* Border Radius for buttons */}
              {component.type === "button" && (
                <div>
                  <Label className="text-xs text-gray-600">Border Radius</Label>
                  <Input
                    value={component.styles.borderRadius || "6px"}
                    onChange={(e) => updateStyle("borderRadius", e.target.value)}
                    className="mt-1 h-8"
                    placeholder="6px"
                  />
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}