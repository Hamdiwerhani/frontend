"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import RoleProtectedRoute from "@/app/components/RoleProtectedRoute";

export default function ViewUserPage() {
  const { id } = useParams();
  const { token } = useAuth();

  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

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
        setUser(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id && token) fetchUser();
  }, [id, token]);

  if (loading) return <div className="text-center mt-8">Loading...</div>;
  if (error) return <div className="text-red-600 mt-8">{error}</div>;

  return (
    <RoleProtectedRoute allowedRoles={["admin"]}>
      <div className="max-w-xl mx-auto mt-12">
        <h1 className="text-2xl font-bold mb-6">User Details</h1>
        <div className="space-y-2 border rounded p-4 shadow">
          <p>
            <strong>Name:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Role:</strong> {user.role}
          </p>
          <p>
            <strong>Created At:</strong>{" "}
            {new Date(user.createdAt).toLocaleString()}
          </p>
          <p>
            <strong>Updated At:</strong>{" "}
            {new Date(user.updatedAt).toLocaleString()}
          </p>
        </div>
      </div>
    </RoleProtectedRoute>
  );
}
