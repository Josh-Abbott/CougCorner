import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function ThreadsPage() {
  const { data: threads, error } = await supabase
    .from("threads")
    .select("id, title, created_at")
    .order("created_at", { ascending: false })

  if (error) {
    console.error(error);
    return (
      <section className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4">Threads</h1>
        <p className="text-red-600">Error loading threads</p>
      </section>
    );
  }

  const thread = threads?.[0];

  return (
    <section className="bg-white shadow rounded-lg p-6">
      <h1 className="text-2xl font-bold mb-4">Threads</h1>
      {threads && threads.length > 0 ? (
        <ul className="space-y-3">
          {threads.map((thread) => (
            <li key={thread.id}>
              <Link
                href={`/threads/${thread.id}`}
                className="block p-4 border rounded hover:bg-gray-50 transition"
              >
                <h2 className="text-lg font-semibold">{thread.title}</h2>
                <p className="text-sm text-gray-500">
                  Created at {new Date(thread.created_at).toLocaleString()}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600">No threads yet — create one!</p>
      )}
    </section>
  );
}

export default ThreadsPage