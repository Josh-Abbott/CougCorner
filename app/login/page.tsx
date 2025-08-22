// app/login/page.tsx

"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useSearchParams } from "next/navigation";

const LoginPage = () => {
  // We still use searchParams to get the error message from NextAuth
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // The handleSubmit function is now much simpler
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    // Let NextAuth handle the redirect. It will automatically redirect 
    // to the 'callbackUrl' on success or reload the page with an error on failure.
    await signIn("credentials", {
      email,
      password,
      callbackUrl: "/", // Redirect to the homepage on successful login
    });
  }

  return (
    <section className="bg-white shadow rounded-lg p-6 max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Display the error message if NextAuth redirected back with one.
          Our backend throws the error, and NextAuth puts it in the URL query params.
        */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">Invalid email or password.</span>
          </div>
        )}
        
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
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
        >
          Login
        </button>
      </form>
    </section>
  );
};

export default LoginPage;