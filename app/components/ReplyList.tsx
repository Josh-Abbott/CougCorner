"use client";

import { formatDateToLocal } from "@/utils/formatDate";
import type { Post } from "@/types/forum";

interface ReplyListProps {
    posts: Post[];
}

export default function ReplyList({ posts }: ReplyListProps) {
    if (!posts || posts.length === 0) {
        return <p className="text-gray-500 text-sm">No replies yet.</p>;
    }

    return (
        <ul className="space-y-3">
            {posts.map((post) => (
                <li key={post.id} className="p-3 border rounded bg-gray-50">
                    <p className="text-sm text-gray-800 whitespace-pre-wrap">{post.content}</p>

                    <p className="text-xs text-gray-500 mt-2">
                        by{" "}
                        <span className="font-medium text-gray-700">
                            {post.username || "Unknown"}
                        </span>{" "}
                        on {formatDateToLocal(post.created_at)}
                    </p>
                </li>
            ))}
        </ul>
    );
}