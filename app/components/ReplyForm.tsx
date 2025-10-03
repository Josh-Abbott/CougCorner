"use client";

import { useState } from "react";

type Post = {
  id: string;
  content: string;
  author_id: string;
  created_at: string;
  pending?: boolean;
  failed?: boolean;
};

function ReplyForm({
  threadId,
  initialPosts,
}: {
  threadId: string;
  initialPosts: Post[];
}) {
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [posts, setPosts] = useState<Post[]>(initialPosts ?? []);

  const createTempId = () => `temp-${Date.now()}`;

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setSubmitting(true);

    // optimistic, added at the end to keep order
    const tempId = createTempId();
    const optimistic: Post = {
      id: tempId,
      content,
      author_id: "You",
      created_at: new Date().toISOString(),
      pending: true,
    };
    setPosts((prev) => [...prev, optimistic]);
    setContent("");

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ thread_id: threadId, content }),
      });

      if (!res.ok) throw new Error("Failed to post reply");

      const saved: Post = await res.json();
      // replace optimistic post with real one
      setPosts((prev) => prev.map((p) => (p.id === tempId ? saved : p)));
    } catch (err) {
      // mark optimistic post as failed
      setPosts((prev) =>
        prev.map((p) =>
          p.id === tempId ? { ...p, pending: false, failed: true } : p
        )
      );
    } finally {
      setSubmitting(false);
    }
  };

  const retry = async (tempId: string, content: string) => {
    // flip back to pending
    setPosts((prev) =>
      prev.map((p) =>
        p.id === tempId ? { ...p, pending: true, failed: false } : p
      )
    );

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ thread_id: threadId, content }),
      });

      if (!res.ok) throw new Error("Failed again");

      const saved: Post = await res.json();
      setPosts((prev) => prev.map((p) => (p.id === tempId ? saved : p)));
    } catch {
      setPosts((prev) =>
        prev.map((p) =>
          p.id === tempId ? { ...p, pending: false, failed: true } : p
        )
      );
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleReply} className="space-y-2">
        <textarea
          className="w-full border rounded p-2"
          placeholder="Write your reply..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={submitting}
        />
        <button
          type="submit"
          disabled={submitting || !content.trim()}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {submitting ? "Posting..." : "Reply"}
        </button>
      </form>

      <div className="space-y-3">
        {posts.length === 0 ? (
          <p className="text-gray-500 text-sm">No replies yet.</p>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              className={`p-3 border rounded ${
                post.pending
                  ? "opacity-60 italic"
                  : post.failed
                  ? "bg-red-50 border-red-400"
                  : ""
              }`}
            >
              <p className="text-gray-800 whitespace-pre-wrap">{post.content}</p>
              <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                {post.failed ? (
                  <>
                    <span>Failed to send.</span>
                    <button
                      onClick={() => retry(post.id, post.content)}
                      className="underline text-red-600"
                    >
                      Retry
                    </button>
                  </>
                ) : post.pending ? (
                  <span>Sending…</span>
                ) : (
                  <>
                    <span>by {post.author_id}</span>
                    <span>•</span>
                    <span>{new Date(post.created_at).toLocaleString()}</span>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ReplyForm
