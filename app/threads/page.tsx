import Link from "next/link";

async function ThreadsPage() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/threads/list`,
    {
      next: { tags: ["threads"] },
    }
  );

  if (!res.ok) {
    return (
      <section className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4">Threads</h1>
        <p className="text-red-600">Error loading threads</p>
      </section>
    );
  }

  const threads: { id: string; title: string; created_at: string }[] =
    await res.json();

  return (
    <section className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Threads</h1>
        <Link
          href="/threads/new"
          className="bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 transition"
        >
          New
        </Link>
      </div>

      {threads.length > 0 ? (
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

export default ThreadsPage;