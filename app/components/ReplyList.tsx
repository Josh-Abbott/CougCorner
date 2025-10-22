"use client";

import type { Post } from "@/types/forum";

export default function ReplyList({ posts }: { posts: Post[] }) {
  if (!posts.length)
    return <p className="text-gray-500 text-sm">No replies yet.</p>;

  return (
    <div className="space-y-3 mb-6">
      {posts.map((post) => (
        <div key={post.id} className="border rounded p-3">
          <p className="text-gray-800 whitespace-pre-wrap">{post.content}</p>
          <p className="text-xs text-gray-500 mt-1">
            by {post.author_id} on {new Date(post.created_at).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}
