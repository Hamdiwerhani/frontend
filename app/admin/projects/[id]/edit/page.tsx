"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

export default function EditProjectPage({
  params,
}: {
  params: { id: string };
}) {
  const { token } = useAuth();
  const router = useRouter();
  const [project, setProject] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ newOwnerId: "" });

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch project details
        const resProject = await fetch(
          `http://localhost:5005/projects/${params.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!resProject.ok) throw new Error("Failed to load project.");
        const proj = await resProject.json();
        setProject(proj);
        setForm({ newOwnerId: proj.owner?._id || "" });

        // Fetch users
        const resUsers = await fetch("http://localhost:5005/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!resUsers.ok) throw new Error("Failed to load users.");
        const allUsers = await resUsers.json();
        setUsers(allUsers);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchData();
  }, [token, params.id, router]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm({ ...form, newOwnerId: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `http://localhost:5005/projects/${params.id}/transfer-owner`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ newOwnerId: form.newOwnerId }),
        }
      );

      if (!res.ok) throw new Error("Transfer failed.");
      router.push("/admin/projects");
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (error) return <p className="text-red-500">{error}</p>;
  if (!project) return <p>Loading project...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Transfer Project Ownership</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          name="newOwnerId"
          value={form.newOwnerId}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="">-- Select New Owner --</option>
          {users.map((u) => (
            <option key={u._id} value={u._id}>
              {u.name} ({u.email})
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Transfer Ownership
        </button>
      </form>
    </div>
  );
}
