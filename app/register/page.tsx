"use client";
import { useState } from "react";

import StatusMessage from "@/app/components/StatusMessage";

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<{ success: boolean; message: string }>({
        success: true,
        message: "",
    });

    async function handleRegister(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setStatus({ success: true, message: "" });

        // Inline validation before sending request
        if (!username.trim()) {
            setStatus({ success: false, message: "Username is required." });
            setLoading(false);
            return;
        }
        if (!email.includes("@")) {
            setStatus({ success: false, message: "Please enter a valid email address." });
            setLoading(false);
            return;
        }
        if (password.length < 6) {
            setStatus({ success: false, message: "Password must be at least 6 characters long." });
            setLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, username }),
            });

            const data = await res.json();

            if (!data.success) {
                setStatus({ success: false, message: "Failed to register." });
            } else {
                setStatus({ success: true, message: "Account created! Redirecting to login..." });
                setEmail("");
                setPassword("");
                setUsername("");

                // Redirect to login after 2 seconds
                setTimeout(() => {
                    window.location.href = "/login";
                }, 2000);
            }
        } catch (err) {
            setStatus({ success: false, message: "Something went wrong. Please try again." });
        } finally {
            setLoading(false);
        }
    }

    return (
        <section className="p-6 bg-white shadow rounded max-w-md mx-auto mt-10">
            <h1 className="text-xl font-bold mb-4">Register</h1>
            <form onSubmit={handleRegister} className="space-y-4">
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    className="w-full border p-2 rounded"
                />
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="w-full border p-2 rounded"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full border p-2 rounded"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
                >
                    {loading ? "Registering..." : "Register"}
                </button>
            </form>

            <div className="mt-4">
                <StatusMessage success={status.success} message={status.message} />
            </div>
        </section>
    );
}

