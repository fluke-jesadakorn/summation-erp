// export default function Login() {
//   return NextResponse.redirect("/api/auth/callback/azure-ad");
// }

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // return NextResponse.rewrite(
  //   new URL("/api/auth/callback/azure-ad", request.url)
  // );
  // console.log(request.nextUrl.origin);
  return NextResponse.rewrite(`${request.nextUrl.origin}/api/auth/callback/azure-ad`);
  // return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: "/login/:path*",
};
