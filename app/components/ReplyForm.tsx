"use client";

import { useState } from "react";

export default function ReplyForm({threadId,onReplyPosted,}: {threadId: string;onReplyPosted?: () => void;}) {
    const [content, setContent] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;

        setSubmitting(true);
        try {
            const res = await fetch("/api/posts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ thread_id: threadId, content }),
            });

            if (!res.ok) throw new Error("Failed to post reply");

            // success → trigger a refresh via parent
            onReplyPosted?.();
            setContent("");
        } catch (err) {
            console.error(err);
            alert("Failed to post reply.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-2 mt-4">
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
    );
}

