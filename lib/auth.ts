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
                    throw new Error("Please provide both an email and password.");
                }

                try {
                    // Sign in with Supabase Auth
                    const { data, error } = await supabase.auth.signInWithPassword({
                        email: credentials.email,
                        password: credentials.password,
                    });

                    if (error || !data.user) {
                        // Better error mapping
                        const errMsg = error?.message?.toLowerCase() ?? "";

                        if (errMsg.includes("invalid login credentials")) {
                            throw new Error("Incorrect email or password. Please try again.");
                        } else if (errMsg.includes("email not confirmed")) {
                            throw new Error("Please verify your email before logging in.");
                        } else if (errMsg.includes("too many requests")) {
                            throw new Error("Too many login attempts. Please wait a moment.");
                        } else {
                            throw new Error("Invalid email or password.");
                        }
                    }

                    // Fetch username from your `users` table
                    const { data: profile, error: profileError } = await supabase
                        .from("users")
                        .select("username")
                        .eq("id", data.user.id)
                        .maybeSingle();

                    if (profileError) {
                        console.error("Error fetching user profile:", profileError.message);
                    }

                    // Return a user object that can be stored in the session
                    return {
                        id: data.user.id,
                        email: data.user.email ?? "",
                        username: profile?.username ?? null,
                    };
                } catch (err) {
                    console.error("Authorize error:", err);
                    // Re-throw, now with a better error message
                    throw new Error(
                        err instanceof Error
                            ? err.message
                            : "An unexpected error occurred. Please try again."
                    );
                }
            }

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


