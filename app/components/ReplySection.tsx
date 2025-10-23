"use client";

import { useState, useMemo } from "react";
import ReplyList from "@/app/components/ReplyList";
import ReplyForm from "@/app/components/ReplyForm";
import type { Post } from "@/types/forum";

export default function ReplySection({threadId, initialPosts, isAuthenticated,}: {threadId: string; initialPosts: Post[]; isAuthenticated: boolean;}) 
{
    const serverPosts = initialPosts;

    const [optimisticPosts, setOptimisticPosts] = useState<Post[]>([]);

    const posts = useMemo(
        () => [...serverPosts, ...optimisticPosts],
        [serverPosts, optimisticPosts]
    );

    const handleReplyAdded = (newReply: Post) => {
        setOptimisticPosts((prev) => [...prev, newReply]);
    };

    return (
        <div>
            <ReplyList posts={posts} />

            {isAuthenticated ? (
                <ReplyForm threadId={threadId} onReplyAdded={handleReplyAdded} />
            ) : (
                <p className="text-gray-500 mt-4">
                Sign in to reply to this thread.
                </p>
            )}
        </div>
    );
}


