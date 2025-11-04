import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const PAGE_SIZE = 5;

export async function GET(req: Request,props: { params: Promise<{ threadId: string }> }) {
    const { threadId } = await props.params;

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);

    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    const { data: posts, error, count } = await supabase
        .from("posts")
        .select("id, content, author_id, created_at", { count: "exact" })
        .eq("thread_id", threadId)
        .order("created_at", { ascending: true })
        .range(from, to);

    if (error) {
        console.error("Error fetching posts:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!posts || posts.length === 0) {
        return NextResponse.json({ posts: [], totalPages: 0 });
    }

    const authorIds = [...new Set(posts.map((p) => p.author_id))];

    const { data: users, error: userError } = await supabase
        .from("users")
        .select("id, username")
        .in("id", authorIds);

    if (userError) {
        console.error("Error fetching usernames:", userError.message);
        return NextResponse.json({ error: userError.message }, { status: 500 });
    }

    const usernameMap = new Map(users?.map((u) => [u.id, u.username]));

    const enrichedPosts = posts.map((post) => ({
        ...post,
        username: usernameMap.get(post.author_id) || "Unknown",
    }));

    const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE);

    return NextResponse.json({ posts: enrichedPosts, totalPages });
}
