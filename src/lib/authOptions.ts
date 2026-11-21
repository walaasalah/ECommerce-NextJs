import { SignInUser } from "@/services/Auth.services";
import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        const res = await SignInUser({
          email: credentials.email,
          password: credentials.password,
        });

        if (res.message === "success") {
          return res;
        } else {
          throw new Error(res.message || "Incorrect email or password");
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user.user;
        token.token = user.token;
      }
      return token;
    },
    //return token from server,return session data

    session({ session, token }) {
      if (token) {
        session.user = token.user;
      }
      return session;
    },
  },
};
