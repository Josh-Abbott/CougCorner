import { createClient } from "@supabase/supabase-js";
import ReplySection from "@/app/components/ReplySection";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { formatDateToLocal } from "@/utils/formatDate";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function ThreadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: threadId } = await params;
  const session = await getServerSession(authOptions);

  const { data: thread } = await supabase
    .from("threads")
    .select("id, title, body, author_id, created_at")
    .eq("id", threadId)
    .single();

  if (!thread) return <p>Thread not found</p>;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/${threadId}`,
    { next: { tags: [`posts-${threadId}`] } }
  );

  if (!res.ok) {
    return <p className="text-red-600 text-sm">Error loading replies.</p>;
  }

  const posts = await res.json();

  return (
    <section className="bg-white shadow rounded-lg p-6">
      <h1 className="text-2xl font-bold mb-2">{thread.title}</h1>
      <p className="text-sm text-gray-500 mb-4">
        by {thread.author_id} on {formatDateToLocal(thread.created_at)}
      </p>

      <div className="mb-6 p-3 border rounded bg-gray-50">
        <p className="text-gray-800 whitespace-pre-wrap">{thread.body}</p>
      </div>

      <h2 className="text-lg font-semibold mb-2">Replies</h2>

      <ReplySection
        threadId={thread.id}
        initialPosts={posts ?? []}
        isAuthenticated={!!session}
      />
    </section>
  );
}