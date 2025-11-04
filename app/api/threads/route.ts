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
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, content } = await req.json();

    // Insert the new thread
    const { data: insertedThread, error: insertError } = await supabase
        .from("threads")
        .insert([{ title, body: content, author_id: session.user.id }])
        .select("id, title, body, author_id, created_at")
        .single();

    if (insertError) {
        console.error("Error inserting thread:", insertError);
        return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    // Fetch username for the author
    const { data: user, error: userError } = await supabase
        .from("users")
        .select("username")
        .eq("id", insertedThread.author_id)
        .single();

    if (userError) {
        console.error("Error fetching username:", userError);
        return NextResponse.json({ error: userError.message }, { status: 500 });
    }

    revalidateTag("threads");

    // Return all of the stuff
    return NextResponse.json({
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

