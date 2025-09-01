import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const conversationId = params.id

    // In a real implementation, fetch messages from database
    const messages = [
      {
        id: "1",
        content: "Hello! I'm your GPT assistant. How can I help you today?",
        role: "assistant",
        timestamp: new Date().toISOString(),
        conversationId,
      },
    ]

    return NextResponse.json({ messages })
  } catch (error) {
    console.error("Error fetching messages:", error)
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const conversationId = params.id
    const { content, role } = await request.json()

    const newMessage = {
      id: Date.now().toString(),
      content,
      role,
      timestamp: new Date().toISOString(),
      conversationId,
    }

    // In a real implementation, save to database and potentially call AI service
    if (role === "user") {
      // Simulate AI response
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        content: `I understand you're asking about "${content}". This is a simulated response from your GPT assistant.`,
        role: "assistant",
        timestamp: new Date().toISOString(),
        conversationId,
      }

      return NextResponse.json({
        messages: [newMessage, aiResponse],
      })
    }

    return NextResponse.json({ message: newMessage })
  } catch (error) {
    console.error("Error creating message:", error)
    return NextResponse.json({ error: "Failed to create message" }, { status: 500 })
  }
}
