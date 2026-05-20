import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

const secretKey = process.env.JWT_SECRET;
const key = new TextEncoder().encode(secretKey || "default_secret_key_change_me");

function checkSecret() {
  if (!secretKey) {
    console.error("❌ CRITICAL ERROR: JWT_SECRET environment variable is missing.");
    if (process.env.NODE_ENV === "production") {
      throw new Error("JWT_SECRET is required in production. Please set it in Vercel settings.");
    }
  }
}

export async function encrypt(payload: any) {
  checkSecret();
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("2h")
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  checkSecret();
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    return null;
  }
}

export async function getSession() {
  const session = (await cookies()).get("session")?.value;
  if (!session) return null;
  return await decrypt(session);
}

export async function updateSession(request: NextRequest) {
  const session = request.cookies.get("session")?.value;
  if (!session) return;

  // Refresh the session so it doesn't expire
  const parsed = await decrypt(session);
  if (!parsed) return;
  parsed.expires = new Date(Date.now() + 2 * 60 * 60 * 1000);
  const res = NextResponse.next();
  res.cookies.set({
    name: "session",
    value: await encrypt(parsed),
    httpOnly: true,
    expires: parsed.expires,
  });
  return res;
}
