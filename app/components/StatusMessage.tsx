export default function StatusMessage({
    success,
    message,
}: {
    success: boolean;
    message: string;
}) {
    if (!message) return null;

    return (
        <div
            className={`px-4 py-3 rounded border ${success
                ? "bg-green-50 border-green-400 text-green-700"
                : "bg-red-50 border-red-400 text-red-700"
                }`}
            role="alert"
        >
            <span className="block sm:inline">{message}</span>
        </div>
    );
}
