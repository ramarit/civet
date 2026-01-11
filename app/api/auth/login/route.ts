import { NextRequest, NextResponse } from "next/server";
import { directus } from "@/lib/directus";
import { login } from "@directus/sdk";
import { setAuthToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    console.log("Login attempt for:", email);

    // Login with Directus
    const authResult = await directus.request(
      login({ email, password })
    );

    console.log("Auth result:", authResult);

    // The token is returned in the result
    const token = authResult?.access_token;

    if (!token) {
      console.error("No access token in auth result");
      return NextResponse.json(
        { error: "Authentication failed - no token received" },
        { status: 401 }
      );
    }

    // Set the auth token in HTTP-only cookie
    await setAuthToken(token);

    console.log("Login successful, token set");

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Login error:", error);
    console.error("Error details:", error.errors || error.message);
    return NextResponse.json(
      { error: error.message || "Invalid email or password" },
      { status: 401 }
    );
  }
}
