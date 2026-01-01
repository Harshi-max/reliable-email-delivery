"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, Eye, Download } from "lucide-react"
import { prebuiltTemplates, EmailTemplate } from "@/lib/templates"
import { EmailComponent } from "./Builder"

interface TemplateGalleryProps {
  onSelectTemplate: (components: EmailComponent[]) => void
}

export function TemplateGallery({ onSelectTemplate }: TemplateGalleryProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  const categories = ["All", ...Array.from(new Set(prebuiltTemplates.map(t => t.category)))]
  
  const filteredTemplates = prebuiltTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All" || template.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleUseTemplate = (template: EmailTemplate) => {
    onSelectTemplate(template.components)
  }

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="font-bold text-lg text-gray-800 mb-2">📚 Template Gallery</h3>
        <p className="text-xs text-gray-500">Choose from professional email templates</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search templates..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 h-9"
        />
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
            className="h-7 text-xs"
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Templates Grid */}
      <ScrollArea className="h-96">
        <div className="space-y-3">
          {filteredTemplates.map(template => (
            <Card key={template.id} className="border-2 hover:border-blue-300 transition-all cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">{template.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-sm text-gray-800 truncate">{template.name}</h4>
                      <Badge variant="secondary" className="text-xs">{template.category}</Badge>
                    </div>
                    <p className="text-xs text-gray-600 mb-3 line-clamp-2">{template.description}</p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleUseTemplate(template)}
                        className="h-7 text-xs bg-blue-600 hover:bg-blue-700"
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Use Template
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Preview
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-8">
          <div className="text-4xl mb-2">🔍</div>
          <p className="text-gray-500 text-sm">No templates found</p>
          <p className="text-gray-400 text-xs">Try adjusting your search or category filter</p>
        </div>
      )}
    </div>
  )
}