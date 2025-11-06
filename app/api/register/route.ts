import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
    try {
        const { email, password, username } = await req.json();

        if (!email || !password || !username) {
            return NextResponse.json(
                { success: false, message: "All fields are required." },
                { status: 400 }
            );
        }

        // Verify if username already exists
        const { data: existingUser, error: checkError } = await supabase
            .from("users")
            .select("id")
            .eq("username", username)
            .maybeSingle();

        if (checkError) {
            console.error("Error checking username:", checkError.message);
            return NextResponse.json(
                { success: false, message: "Error checking username availability." },
                { status: 500 }
            );
        }

        if (existingUser) {
            return NextResponse.json(
                { success: false, message: "Username is already taken." },
                { status: 400 }
            );
        }

        // Create user in Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
        });

        if (authError || !authData.user) {
            console.error("Error creating user in Supabase Auth:", authError?.message);

            // Better error mapping
            let errorMessage = "Failed to create account.";
            const msg = authError?.message?.toLowerCase() || "";

            if (msg.includes("already been registered")) {
                errorMessage = "An account with this email already exists.";
            } else if (msg.includes("password")) {
                errorMessage = "Password does not meet requirements.";
            } else if (msg.includes("email")) {
                errorMessage = "Please enter a valid email address.";
            } else if (msg.includes("invalid login credentials")) {
                errorMessage = "Invalid email or password format.";
            }

            return NextResponse.json(
                { success: false, message: errorMessage },
                { status: 400 }
            );
        }

        const userId = authData.user.id;

        // Insert into users table with username
        const { error: dbError } = await supabase.from("users").insert([
            {
                id: userId,
                email: authData.user.email,
                username,
            },
        ]);

        if (dbError) {
            console.error("Error inserting into users table:", dbError.message);
            await supabase.auth.admin.deleteUser(userId);
            return NextResponse.json(
                { success: false, message: "Failed to save username." },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Account created successfully! You can now log in.",
            user: authData.user,
        });
    } catch (err: any) {
        console.error("Unexpected error:", err);
        return NextResponse.json(
            { success: false, message: "Unexpected server error." },
            { status: 500 }
        );
    }
}
