import { createClient } from "@supabase/supabase-js";
import ReplyForm from "@/app/components/ReplyForm";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function ThreadPage({
  params,
}: {
  params: { id: string };
}) {
  const { id: threadId } = params;

  const { data: thread } = await supabase
    .from("threads")
    .select("id, title, body, author_id, created_at")
    .eq("id", threadId)
    .single();

  const { data: posts } = await supabase
    .from("posts")
    .select("id, content, author_id, created_at")
    .eq("thread_id", threadId)
    .order("created_at", { ascending: true });

  if (!thread) return <p>Thread not found</p>;

  return (
    <section className="bg-white shadow rounded-lg p-6">
      <h1 className="text-2xl font-bold mb-2">{thread.title}</h1>
      <p className="text-sm text-gray-500 mb-4">
        by {thread.author_id} on {new Date(thread.created_at).toLocaleString()}
      </p>
      <div className="mb-6 p-3 border rounded bg-gray-50">
        <p className="text-gray-800 whitespace-pre-wrap">{thread.body}</p>
      </div>

      <h2 className="text-lg font-semibold mb-2">Replies</h2>

      <ReplyForm threadId={thread.id} initialPosts={posts ?? []} />
    </section>
  );
}

export default ThreadPage