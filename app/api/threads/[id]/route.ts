import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
    const { id: threadId } = await context.params;

    // Fetch the thread and its posts
    const { data: thread, error: threadError } = await supabase
        .from("threads")
        .select(`
            id,
            title,
            body,
            author_id,
            created_at,
            posts (
                id,
                content,
                author_id,
                created_at
            )
        `)
        .eq("id", threadId)
        .single();

    if (threadError) {
        console.error("Error fetching thread:", threadError);
        return NextResponse.json({ error: threadError.message }, { status: 500 });
    }

    // Fetch thread author's username
    const { data: threadAuthor, error: threadAuthorError } = await supabase
        .from("users")
        .select("username")
        .eq("id", thread.author_id)
        .single();

    if (threadAuthorError) {
        console.error("Error fetching thread author username:", threadAuthorError);
    }

    // Fetch all post authors' usernames
    const postAuthorIds = [...new Set(thread.posts.map((p: any) => p.author_id))];
    const { data: postAuthors, error: postAuthorsError } = await supabase
        .from("users")
        .select("id, username")
        .in("id", postAuthorIds);

    if (postAuthorsError) {
        console.error("Error fetching post author usernames:", postAuthorsError);
    }

    const authorMap = Object.fromEntries(
        (postAuthors || []).map((u: any) => [u.id, u.username])
    );

    const postsWithUsernames = thread.posts.map((p: any) => ({
        ...p,
        username: authorMap[p.author_id] || "Unknown",
    }));

    // Return all of the stuff
    return NextResponse.json({
        ...thread,
        username: threadAuthor?.username || "Unknown",
        posts: postsWithUsernames,
    });
}
