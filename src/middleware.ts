import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import * as jose from "jose";
import { JOSEError } from "jose/errors";

export async function middleware(request: NextRequest) {
  if (!request.cookies.has("jwt")) {
    return NextResponse.redirect(
      new URL(
        "/account/login?redirect=" + encodeURIComponent(request.url),
        request.url,
      ),
    );
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
      return NextResponse.redirect(
        new URL(
          "/account/login?redirect=" + encodeURIComponent(request.url),
          request.url,
        ),
      );
    }
    throw error;
  }
}

export const config = {
  matcher: ["/"],
};
