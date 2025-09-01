import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    const token = authHeader.substring(7);

    const response = await fetch(`${process.env.API_URL}/api/v1/gpt/rooms`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Protected route failed:", response.status, errorText);
      return NextResponse.json(
        { error: "Token validation failed" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({ message: data, valid: true });
  } catch (error) {
    console.error("[v0] Protected route error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const { title, id } = await request.json();
    const payload: any = {
      user_prompt: title || "New Chat",
      temperature: 0.7,
      max_tokens: 500,
      top_k: 3,
      similarity_threshold: 0.3,
    };
    if (id) {
      payload.room_id = id;
    }
    const response = await fetch(
      `${process.env.API_URL}/api/v1/gpt/room-query`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify(payload),
      }
    );
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error creating conversation:", response.status, errorText);
      return NextResponse.json(
        { error: "Failed to create conversation" },
        { status: response.status }
      );
    }
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error creating conversation:", error);
    return NextResponse.json(
      { error: "Failed to create conversation" },
      { status: 500 }
    );
  }
}
