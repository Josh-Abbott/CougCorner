import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required.");
        }

        // Sign in with Supabase Auth
        const { data, error } = await supabase.auth.signInWithPassword({
          email: credentials.email,
          password: credentials.password,
        });

        if (error || !data.user) {
          throw new Error(error?.message || "Invalid credentials");
        }

        // Fetch username from your `users` table
        const { data: profile, error: profileError } = await supabase
          .from("users")
          .select("username")
          .eq("id", data.user.id)
          .maybeSingle();

        if (profileError) {
          console.error("Error fetching username:", profileError.message);
        }

        // Return a User object that matches NextAuth's expected shape
        return {
          id: data.user.id,
          email: data.user.email ?? "", // ensure it's always a string
          username: profile?.username ?? null,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
  },

  callbacks: {
    async jwt({ token, user }) {
      // Save user info into JWT when logging in
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.username = (user as any).username ?? null; // cast so TS is happy
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.username = token.username as string | null;
      }
      return session;
    },
  },
};


