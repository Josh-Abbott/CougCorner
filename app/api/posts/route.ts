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
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "You must be signed in to post a reply." },
                { status: 401 }
            );
        }

        const { thread_id, content } = await req.json();
        if (!thread_id || !content?.trim()) {
            return NextResponse.json(
                { error: "Missing or invalid thread ID or content." },
                { status: 400 }
            );
        }

        const { data, error } = await supabase
            .from("posts")
            .insert([{ thread_id, author_id: session.user.id, content }])
            .select()
            .single();

        if (error) {
            console.error("Error inserting reply:", error);
            return NextResponse.json(
                { error: "Database insert failed: " + error.message },
                { status: 500 }
            );
        }

        revalidateTag(`posts-${thread_id}`);
        return NextResponse.json(data);
    } catch (err) {
        console.error("Unexpected error in POST /api/posts:", err);
        return NextResponse.json(
            { error: "Unexpected server error." },
            { status: 500 }
        );
    }
}
