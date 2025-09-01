import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log(
      "[v0] Fetching captcha from:",
      `${process.env.API_URL}/api/v1/auth/captcha`
    );

    const response = await fetch(`${process.env.API_URL}/api/v1/auth/captcha`, {
      method: "GET",
      headers: {
        "ngrok-skip-browser-warning": "true",
        "User-Agent": "GPT-Login-App/1.0",
        Accept: "image/png",
      },
    });

    if (!response.ok) {
      console.error(
        "[v0] Captcha API error:",
        response.status,
        response.statusText
      );
      return NextResponse.json(
        { error: `Failed to fetch captcha: ${response.status}` },
        { status: response.status }
      );
    }

    const captchaId = response.headers.get("x-captcha-id");
    console.log("[v0] Captcha ID from API:", captchaId);

    if (!captchaId) {
      return NextResponse.json(
        { error: "Captcha ID not found in response headers" },
        { status: 500 }
      );
    }

    const imageBuffer = await response.arrayBuffer();

    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "x-captcha-id": captchaId,
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  } catch (error) {
    console.error("[v0] Captcha proxy error:", error);
    return NextResponse.json(
      { error: "Failed to fetch captcha" },
      { status: 500 }
    );
  }
}
