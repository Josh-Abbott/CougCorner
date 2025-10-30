import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const PAGE_SIZE = 5;

export async function GET(req: Request, { params }: { params: { threadId: string } }) {
    const { threadId } = params;
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");

    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    const { data, error, count } = await supabase
        .from("posts")
        .select("id, content, author_id, created_at", { count: "exact" })
        .eq("thread_id", threadId)
        .order("created_at", { ascending: true })
        .range(from, to);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE);

    return NextResponse.json({ posts: data, totalPages });
}