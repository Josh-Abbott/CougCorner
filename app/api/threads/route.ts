import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidateTag } from "next/cache";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json(
            { success: false, message: "You must be signed in to create a thread." },
            { status: 401 }
        );
    }

    const { title, content } = await req.json();

    if (!title?.trim() || !content?.trim()) {
        return NextResponse.json(
            { success: false, message: "Both title and content are required." },
            { status: 400 }
        );
    }

    // Insert the new thread
    const { data: insertedThread, error: insertError } = await supabase
        .from("threads")
        .insert([{ title, body: content, author_id: session.user.id }])
        .select("id, title, body, author_id, created_at")
        .single();

    if (insertError) {
        console.error("Error inserting thread:", insertError);
        return NextResponse.json(
            { success: false, message: "Failed to create thread. Please try again." },
            { status: 500 }
        );
    }

    // Fetch username for the author
    const { data: user, error: userError } = await supabase
        .from("users")
        .select("username")
        .eq("id", insertedThread.author_id)
        .single();

    if (userError) {
        console.error("Error fetching username:", userError);
        return NextResponse.json(
            { success: false, message: "Thread created, but failed to fetch user info." },
            { status: 500 }
        );
    }

    revalidateTag("threads");

    // Return all of the stuff
    return NextResponse.json({
        success: true,
        message: "Thread created successfully!",
        thread: {
            id: insertedThread.id,
            title: insertedThread.title,
            body: insertedThread.body,
            created_at: insertedThread.created_at,
            author_id: insertedThread.author_id,
            username: user.username,
        },
    });
}

