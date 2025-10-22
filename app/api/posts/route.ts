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

  const { thread_id, content } = await req.json();
  if (!thread_id || !content) {
    return NextResponse.json(
      { error: "Missing thread_id or content" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("posts")
    .insert([{ thread_id, author_id: session.user.id, content }])
    .select()
    .single();

  if (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  revalidateTag(`posts-${thread_id}`);

  return NextResponse.json(data);
}