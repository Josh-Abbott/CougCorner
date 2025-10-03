import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const threadId = params.id;

  const { data, error } = await supabase
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

  if (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}