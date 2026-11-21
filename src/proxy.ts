import { getToken } from "next-auth/jwt";
import { NextResponse, type NextRequest } from "next/server";
export async function proxy(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET });
  const authPage = ["/login", "/register"].includes(request.nextUrl.pathname);
  if (token && authPage) return NextResponse.redirect(new URL("/", request.url));
  if (!token && !authPage) return NextResponse.redirect(new URL("/login", request.url));
  return NextResponse.next();
}
export const config = { matcher: ["/cart", "/wishlist", "/checkOut", "/profile", "/allorders", "/orders", "/login", "/register"] };
