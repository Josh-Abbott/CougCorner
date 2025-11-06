"use client";

import { useState } from "react";
import StatusMessage from "@/app/components/StatusMessage";

export default function ReplyForm({
    threadId,
    onReplyPosted,
}: {
    threadId: string;
    onReplyPosted?: () => void;
}) {
    const [content, setContent] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [status, setStatus] = useState<{ success: boolean; message: string }>({
        success: false,
        message: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) {
            setStatus({ success: false, message: "Reply content cannot be empty." });
            return;
        }

        setSubmitting(true);
        setStatus({ success: false, message: "" }); // clear

        try {
            const res = await fetch("/api/posts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ thread_id: threadId, content }),
            });

            const data = await res.json();

            if (!res.ok) {
                if (res.status === 401) {
                    setStatus({ success: false, message: "You must be signed in to post a reply." });
                } else if (res.status === 400) {
                    setStatus({ success: false, message: data.error || "Invalid request. Please check your input." });
                } else {
                    setStatus({ success: false, message: data.error || "Failed to post reply. Please try again." });
                }
                return;
            }

            onReplyPosted?.();
            setContent("");
        } catch (err) {
            console.error("Unexpected error posting reply:", err);
            setStatus({ success: false, message: "Something went wrong while posting your reply." });
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

            <StatusMessage success={status.success} message={status.message} />
        </form>
    );
}
