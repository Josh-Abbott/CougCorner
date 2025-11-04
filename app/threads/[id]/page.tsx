import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { formatDateToLocal } from "@/utils/formatDate";
import ReplySection from "@/app/components/ReplySection";

export default async function ThreadPage(props: {params: Promise<{ id: string }>;searchParams: Promise<{ page?: string }>;}) {
    const { id: threadId } = await props.params;
    const searchParams = await props.searchParams;

    const currentPage = parseInt(searchParams?.page || "1", 10);
    const session = await getServerSession(authOptions);

    // Paginated replies
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/threads/${threadId}?page=${currentPage}`,
        { cache: "no-store" }
    );

    if (!res.ok) {
        return (
            <p className="text-red-600 text-sm">
                Error loading thread details.
            </p>
        );
    }

    const thread = await res.json();

    if (!thread) return <p>Thread not found</p>;

    return (
        <section className="bg-white shadow rounded-lg p-6">
            <h1 className="text-2xl font-bold mb-2">{thread.title}</h1>

            <p className="text-sm text-gray-500 mb-4">
                by{" "}
                <span className="font-medium text-gray-700">
                    {thread.username || "Unknown"}
                </span>{" "}
                on {formatDateToLocal(thread.created_at)}
            </p>

            <div className="mb-6 p-3 border rounded bg-gray-50">
                <p className="text-gray-800 whitespace-pre-wrap">{thread.body}</p>
            </div>

            <h2 className="text-lg font-semibold mb-2">Replies</h2>

            <ReplySection
                threadId={thread.id}
                initialPosts={thread.posts ?? []}
                isAuthenticated={!!session}
                totalPages={thread.totalPages ?? 1}
                initialPage={currentPage}
            />
        </section>
    );
}


