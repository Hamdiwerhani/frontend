"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import RoleProtectedRoute from "@/app/components/RoleProtectedRoute";

export default function AdminUserListPage() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:5005/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch users");
        return res.json();
      })
      .then(setUsers)
      .catch((err) => setError(err.message));
  }, [token, user]);

  return (
    <RoleProtectedRoute allowedRoles={["admin"]}>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">All Users</h1>

        {error && <p className="text-red-500">{error}</p>}

        <ul className="space-y-2">
          {users.map((u) => (
            <li key={u._id} className="p-3 border rounded shadow">
              <p>
                <strong>Name:</strong> {u.name}
              </p>
              <p>
                <strong>Email:</strong> {u.email}
              </p>
              <p>
                <strong>Role:</strong> {u.role}
              </p>
              <p>
                <strong>Joined:</strong>{" "}
                {new Date(u.createdAt).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </RoleProtectedRoute>
  );
}
