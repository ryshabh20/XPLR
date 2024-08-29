import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isPublicPath =
    path === "/login" || path === "/register" || path === "/verifyemail";
  const access_token = cookies().get("access_token")?.value;
  const refresh_token = cookies().get("refresh_token")?.value;
  let user;
  try {
    user = access_token
      ? await jwtVerify(
          access_token,
          new TextEncoder().encode(process.env.JWT_SECRET)
        )
      : null;
  } catch (error) {
    user = null;
  }
  if (!isPublicPath && !user && !refresh_token) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }
  if (isPublicPath && user) {
    return NextResponse.redirect(new URL("/", request.nextUrl));
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images).*)"],
};
