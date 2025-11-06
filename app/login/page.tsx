"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import StatusMessage from "@/app/components/StatusMessage";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [status, setStatus] = useState<{ success: boolean; message: string }>({
        success: true,
        message: "",
    });
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setStatus({ success: true, message: "" });

        try {
            const res = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (!res) {
                setStatus({ success: false, message: "Unexpected error. Please try again." });
                return;
            }

            if (res.error) {
                setStatus({ success: false, message: "Invalid email or password." });
            } else if (res.ok) {
                setStatus({ success: true, message: "Login successful! Redirecting..." });

                setTimeout(() => {
                    router.push("/");
                }, 800);
            }
        } catch (err) {
            console.error("Login error:", err);
            setStatus({ success: false, message: "Something went wrong. Please try again." });
        } finally {
            setLoading(false);
        }
    }

    return (
        <section className="bg-white shadow rounded-lg p-6 max-w-md mx-auto mt-10">
            <h1 className="text-2xl font-bold mb-4">Login</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full disabled:opacity-50"
                >
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>
            <div className="mt-4">
                <StatusMessage success={status.success} message={status.message} />
            </div>
        </section>
    );
}
