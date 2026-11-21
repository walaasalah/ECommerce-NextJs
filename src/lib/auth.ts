import { decode } from "next-auth/jwt";
import { cookies } from "next/headers";
export async function GetOurToken() {
  const jar = await cookies();
  const token =
    jar.get("__Secure-next-auth.session-token")?.value ??
    jar.get("next-auth.session-token")?.value;
  if (!token) throw new Error("Please sign in to continue.");
  const decoded = await decode({
    token,
    secret: process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET!,
  });
  if (!decoded?.token)
    throw new Error("Your session has expired. Please sign in again.");
  return decoded.token as string;
}
