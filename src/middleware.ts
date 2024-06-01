import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import * as jose from "jose";
import { JOSEError } from "jose/errors";

export async function middleware(request: NextRequest) {
  const gotoLogin = NextResponse.redirect(
    new URL(
      "/account/login?redirect=" + encodeURIComponent(request.url),
      request.url,
    ),
  );
  if (!request.cookies.has("jwt")) {
    return gotoLogin;
  }
  const jwt = request.cookies.get("jwt")!.value;
  const secret = new TextEncoder().encode(process.env.SECRET);
  try {
    await jose.jwtVerify(jwt, secret, {
      issuer: "urn:example:issuer",
      audience: "urn:example:audience",
    });
  } catch (error) {
    if (error instanceof JOSEError) {
      return gotoLogin;
    }
    throw error;
  }
  console.log("-----");
}

export const config = {
  matcher: ["/"],
};
