import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // Join with users to get the username for each thread
    const { data: threads, error, count } = await supabase
        .from("threads")
        .select(`
            id,
            title,
            created_at,
            author_id,
            users!inner(username)
        `, { count: "exact" }) // total count for pagination, exact
        .order("created_at", { ascending: false })
        .range(from, to);

    if (error) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Map threads to include username at top level
    const formattedThreads = threads.map((t: any) => ({
        id: t.id,
        title: t.title,
        created_at: t.created_at,
        author_id: t.author_id,
        username: t.users.username,
    }));

    return NextResponse.json({
        threads: formattedThreads,
        total: count,
        page,
        limit,
    });
}


