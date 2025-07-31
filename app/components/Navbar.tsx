"use client";

import Link from "next/link";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="flex items-center justify-between p-4 bg-gray-100 shadow">
      <div className="flex gap-4">
        <Link href="/">Home</Link>

        {user?.role == "admin" && (
          <>
            <Link href="/admin/users">Manage Users</Link>
            <Link href="/admin/settings">Admin Settings</Link>
          </>
        )}

        {user?.role === "manager" && (
          <>
            <Link href="/manager/projects">Project Overview</Link>
          </>
        )}

        {user?.role === "user" && (
          <>
            <Link href="/user/createProject">Create Project</Link>
            <Link href="/user/myprojects">My Projects</Link>
          </>
        )}
      </div>

      <button onClick={logout} className="btn btn-sm btn-outline">
        Logout
      </button>
    </nav>
  );
}
