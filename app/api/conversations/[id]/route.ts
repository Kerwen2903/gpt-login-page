import { type NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const conversationId = params.id;
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    const token = authHeader.substring(7);

    const response = await fetch(
      `${process.env.API_URL}/api/v1/gpt/room/${conversationId}/messages`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error fetching conversation:", response.status, errorText);
      return NextResponse.json(
        { error: "Token validation failed" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({ conversation: data });
  } catch (error) {
    console.error("Error fetching conversation:", error);
    return NextResponse.json(
      { error: "Failed to fetch conversation" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const conversationId = params.id;

    // In a real implementation, delete from database
    console.log(`Deleting conversation ${conversationId}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting conversation:", error);
    return NextResponse.json(
      { error: "Failed to delete conversation" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const conversationId = params.id;
    const { title } = await request.json();

    // In a real implementation, update in database
    const updatedConversation = {
      id: conversationId,
      title,
      lastMessage: "Updated conversation",
      timestamp: new Date().toISOString(),
      messageCount: 1,
    };

    return NextResponse.json({ conversation: updatedConversation });
  } catch (error) {
    console.error("Error updating conversation:", error);
    return NextResponse.json(
      { error: "Failed to update conversation" },
      { status: 500 }
    );
  }
}
