"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import StatusMessage from "@/app/components/StatusMessage";

export default function ThreadForm() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<{ success: boolean; message: string } | null>(null);
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setStatus(null);

        try {
            const res = await fetch("/api/threads", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, content }),
            });

            const data = await res.json();
            setLoading(false);

            if (!res.ok) {
                setStatus({ success: false, message: data.message || "Failed to create thread." });
                return;
            }

            setStatus({ success: true, message: data.message });
            setTitle("");
            setContent("");

            setTimeout(() => router.push(`/threads/${data.thread.id}`), 1000);
        } catch (err) {
            console.error("Error creating thread:", err);
            setStatus({ success: false, message: "Unexpected error creating thread." });
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-4 p-4">
            <h1 className="text-2xl font-bold mb-2">Create Thread</h1>

            {status && (
                <StatusMessage success={status.success} message={status.message} />
            )}

            <div>
                <label className="block mb-1 font-medium">Title</label>
                <input
                    type="text"
                    className="w-full p-2 border rounded"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
            </div>

            <div>
                <label className="block mb-1 font-medium">Body</label>
                <textarea
                    className="w-full p-2 border rounded"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
                {loading ? "Creating..." : "Create Thread"}
            </button>
        </form>
    );
}
