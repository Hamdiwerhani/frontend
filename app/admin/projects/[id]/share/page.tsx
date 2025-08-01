"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useParams } from "next/navigation";

export default function ShareProjectPage() {
  const { token } = useAuth();
  const params = useParams();
  const projectId = params?.id as string;

  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [permission, setPermission] = useState<"view" | "edit">("view");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!token) return;

    const fetchUsers = async () => {
      try {
        const res = await fetch("http://localhost:5005/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to load users");
        const data = await res.json();
        setUsers(data);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchUsers();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await fetch(
        `http://localhost:5005/projects/${projectId}/share`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId: selectedUser,
            permission,
          }),
        }
      );

      if (!res.ok) throw new Error("Failed to share project");

      setSuccess("Project shared successfully!");
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (!projectId) return <p className="text-red-500">Project ID missing.</p>;

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 max-w-md p-4 border rounded"
    >
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}

      <select
        value={selectedUser}
        onChange={(e) => setSelectedUser(e.target.value)}
        required
        className="w-full p-2 border rounded"
      >
        <option value="">Select user to share with</option>
        {users.map((u) => (
          <option key={u._id} value={u._id}>
            {u.name} ({u.email})
          </option>
        ))}
      </select>

      <select
        value={permission}
        onChange={(e) => setPermission(e.target.value as "view" | "edit")}
        className="w-full p-2 border rounded"
      >
        <option value="view">View</option>
        <option value="edit">Edit</option>
      </select>

      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Share Project
      </button>
    </form>
  );
}
