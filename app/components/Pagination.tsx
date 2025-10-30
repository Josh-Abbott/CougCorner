"use client";

import Link from "next/link";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    baseUrl: string; // threads or threads/${threadId}
}

export default function Pagination({currentPage, totalPages, baseUrl,}: PaginationProps) {
    if (totalPages <= 1) return null;

    const createPageLink = (page: number) => `${baseUrl}?page=${page}`;

    const getPageNumbers = () => {
        const pages: (number | string)[] = [];

        pages.push(1);

        if (currentPage > 3) {
            pages.push("...");
        }

        // Pages around current page
        const start = Math.max(2, currentPage - 1);
        const end = Math.min(totalPages - 1, currentPage + 1);
        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        if (currentPage < totalPages - 2) {
            pages.push("...");
        }

        if (totalPages > 1) {
            pages.push(totalPages);
        }

        return pages;
    };

    const pages = getPageNumbers();

    return (
        <div className="flex justify-center items-center space-x-2 mt-6">
            {/* Prev Button */}
            {currentPage > 1 && (
                <Link
                    href={createPageLink(currentPage - 1)}
                    className="px-3 py-1 border rounded hover:bg-gray-100"
                >
                    Previous
                </Link>
            )}

            {/* Page Numbers */}
            {pages.map((page, idx) =>
                typeof page === "number" ? (
                    <Link
                        key={idx}
                        href={createPageLink(page)}
                        className={`px-4 py-2 border rounded transition ${page === currentPage
                                ? "bg-blue-600 text-white"
                                : "bg-white hover:bg-gray-100"
                            }`}
                    >
                        {page}
                    </Link>
                ) : (
                    <span key={idx} className="px-4 py-2 text-gray-500">
                        {page}
                    </span>
                )
            )}

            {/* Next Button */}
            {currentPage < totalPages && (
                <Link
                    href={createPageLink(currentPage + 1)}
                    className="px-3 py-1 border rounded hover:bg-gray-100"
                >
                    Next
                </Link>
            )}
        </div>
    );
}
