"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import RoleProtectedRoute from "@/app/components/RoleProtectedRoute";

export default function EditUserPage() {
  const { token } = useAuth();
  const router = useRouter();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`http://localhost:5005/users/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch user");

        const data = await res.json();
        setForm({
          name: data.name || "",
          email: data.email || "",
          role: data.role || "",
        });
      } catch (err) {
        console.error(err);
        alert("Error fetching user.");
      } finally {
        setLoading(false);
      }
    };
    if (typeof id === "string" && token) fetchUser();
    console.log("Fetched id from params:", id);
  }, [id, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:5005/users/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      console.log(form);
      if (!res.ok) throw new Error("Failed to update user");

      router.push("/admin/users");
    } catch (err) {
      alert("Error updating user: " + err.message);
    }
  };

  if (loading) {
    return <div className="text-center mt-20 text-gray-600">Loading...</div>;
  }

  return (
    <RoleProtectedRoute allowedRoles={["admin"]}>
      <div className="max-w-xl mx-auto mt-12">
        <h1 className="text-2xl font-bold mb-6">Edit User</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              className="w-full border rounded p-2"
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              className="w-full border rounded p-2"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Role</label>
            <select
              className="w-full border rounded p-2"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              required
            >
              <option value="">Select role</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="user">User</option>
            </select>
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Save Changes
          </button>
        </form>
      </div>
    </RoleProtectedRoute>
  );
}
