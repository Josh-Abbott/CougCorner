"use client";

import { useEffect, useState } from "react";
import ReplyList from "@/app/components/ReplyList";
import ReplyForm from "@/app/components/ReplyForm";
import Pagination from "@/app/components/Pagination";
import type { Post } from "@/types/forum";

interface ReplySectionProps {
    threadId: string;
    initialPosts: Post[];
    isAuthenticated: boolean;
    totalPages: number;
    initialPage: number;
}

export default function ReplySection({threadId, initialPosts, isAuthenticated, totalPages: initialTotalPages, initialPage,}: ReplySectionProps) {
    const [posts, setPosts] = useState<Post[]>(initialPosts);
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [totalPages, setTotalPages] = useState(initialTotalPages);
    const [loading, setLoading] = useState(false);

    // Fetch replies dynamically (for when switching pages)
    const fetchReplies = async (page: number) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/posts/${threadId}?page=${page}`);
            if (!res.ok) throw new Error("Failed to fetch replies");

            const data = await res.json();
            setPosts(data.posts);
            setTotalPages(data.totalPages);
            setCurrentPage(page);
        } catch (err) {
            console.error(err);
            alert("Failed to load replies.");
        } finally {
            setLoading(false);
        }
    };

    // Refetch after a new reply is added
    const handleReplyAdded = async () => {
        await fetchReplies(totalPages);
    };

    useEffect(() => {
        setPosts(initialPosts);
        setTotalPages(initialTotalPages);
        setCurrentPage(initialPage);
    }, [initialPosts, initialTotalPages, initialPage]);

    return (
        <div>
            {loading ? (
                <p className="text-gray-500 text-sm">Loading...</p>
            ) : (
                <ReplyList posts={posts} />
            )}

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                baseUrl={`/threads/${threadId}`}
            />

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
