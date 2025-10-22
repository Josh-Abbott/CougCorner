"use client";

import { useState } from "react";
import ReplyList from "@/app/components/ReplyList";
import ReplyForm from "@/app/components/ReplyForm";
import type { Post } from "@/types/forum";

export default function ReplySection({threadId, initialPosts, isAuthenticated,}: {threadId: string; initialPosts: Post[]; isAuthenticated: boolean;}) 
{
  const [posts, setPosts] = useState<Post[]>(initialPosts);

  const handleReplyAdded = (newReply: Post) => {
    setPosts((prev) => [...prev, newReply]);
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

