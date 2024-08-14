import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getUserInfo } from "../utils/GetUserInfor";

export async function middleware(request: NextRequest) {
  const user = getUserInfo(request);
  console.log("cookies", user);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
