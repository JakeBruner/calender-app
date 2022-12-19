import type NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string;
      name: string;
      role: "ADMIN" | "USER" | "LIMBO";
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    name: string;
    email: string;
    image: string;
    role: "ADMIN" | "USER" | "LIMBO";
  }
}
