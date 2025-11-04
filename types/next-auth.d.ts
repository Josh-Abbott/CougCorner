import { DefaultSession, DefaultUser } from "next-auth";
import { JWT as DefaultJWT } from "next-auth/jwt";

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    email: string;
    username?: string | null;
  }
}

declare module "next-auth" {
  interface User extends DefaultUser {
    id: string;
    email: string;
    username?: string | null;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      username?: string | null;
    } & DefaultSession["user"];
  }
}
