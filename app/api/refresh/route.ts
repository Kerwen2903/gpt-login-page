import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { refresh_token } = body;

    if (!refresh_token) {
      return NextResponse.json(
        { error: "Refresh token required" },
        { status: 400 }
      );
    }

    console.log("[v0] Attempting token refresh...");

    const response = await fetch(
      "http://192.168.100.20:8000/api/v1/auth/refresh",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({
          refresh_token: refresh_token,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[v0] Token refresh failed:", response.status, errorText);
      return NextResponse.json(
        { error: "Token refresh failed" },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("Token refresh successful");

    return NextResponse.json({
      access_token: data.access_token,
      refresh_token: data.refresh_token,
    });
  } catch (error) {
    console.error("[v0] Token refresh error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
