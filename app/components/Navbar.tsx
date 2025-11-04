"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

function Navbar() {
    const { data: session, status } = useSession();

    // include loading state as a precaution
    if (status === "loading") {
        return (
            <nav className="bg-white shadow-md">
                <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
                    <Link href="/" className="text-xl font-bold text-blue-600">
                        CougCorner
                    </Link>
                    <div className="text-gray-400">Loading...</div>
                </div>
            </nav>
        );
    }

    const username = session?.user?.username;

    return (
        <nav className="bg-white shadow-md">
            <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
                <Link href="/" className="text-xl font-bold text-blue-600">
                    CougCorner
                </Link>

                <div className="space-x-4">
                    <Link href="/threads" className="hover:text-blue-500">
                        Threads
                    </Link>

                    {session ? (
                        <>
                            <span className="text-gray-600">
                                {username
                                    ? `Hello, ${username}`
                                    : "Hello!"}
                            </span>
                            <button
                                onClick={() => signOut()}
                                className="text-red-500 hover:underline"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="hover:text-blue-500">
                                Login
                            </Link>
                            <Link href="/register" className="hover:text-blue-500">
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
