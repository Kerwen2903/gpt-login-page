import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    const token = authHeader.substring(7);

    const response = await fetch(
      `${process.env.API_URL}/api/v1/auth/protected`,
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
      console.error("[v0] Protected route failed:", response.status, errorText);
      return NextResponse.json(
        { error: "Token validation failed" },
        { status: response.status }
      );
    }

    const data = await response.text();
    return NextResponse.json({ message: data, valid: true });
  } catch (error) {
    console.error("[v0] Protected route error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
