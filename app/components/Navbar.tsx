import React from 'react'
import Link from "next/link";

function Navbar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-blue-600">
          MyForum
        </Link>
        <div className="space-x-4">
          <Link href="/threads" className="hover:text-blue-500">Threads</Link>
          <Link href="/login" className="hover:text-blue-500">Login</Link>
          <Link href="/register" className="hover:text-blue-500">Register</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar