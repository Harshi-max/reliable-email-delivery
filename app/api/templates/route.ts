import { type NextRequest, NextResponse } from "next/server"

// In-memory storage for demo purposes
// In production, you'd use a database
let templates: Array<{
  id: string
  name: string
  components: any[]
  createdAt: string
  updatedAt: string
}> = []

export async function GET() {
  return NextResponse.json({ templates })
}

export async function POST(request: NextRequest) {
  try {
    const { name, components } = await request.json()

    if (!name || !components) {
      return NextResponse.json(
        { error: "Missing required fields: name, components" },
        { status: 400 }
      )
    }

    const template = {
      id: `template-${Date.now()}`,
      name,
      components,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    templates.push(template)

    return NextResponse.json({ template })
  } catch (error) {
    console.error("Failed to save template:", error)
    return NextResponse.json(
      { error: "Failed to save template" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json(
        { error: "Template ID is required" },
        { status: 400 }
      )
    }

    templates = templates.filter(t => t.id !== id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to delete template:", error)
    return NextResponse.json(
      { error: "Failed to delete template" },
      { status: 500 }
    )
  }
}