"use client";

import { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

export default function Home() {
  const { token } = useAuth();
  const [tag, setTag] = useState("");
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchProjects = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `http://localhost:5005/projects/by-tag/${encodeURIComponent(tag)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch projects");
      const data = await res.json();
      setProjects(data);
    } catch (err: any) {
      setError(err.message || "Unknown error");
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthProvider>
      <ProtectedRoute>
        <div className="max-w-xl mx-auto mt-10">
          <h1 className="text-3xl font-bold underline mb-6">hamdi</h1>
          <div className="flex gap-2 mb-4">
            <input
              className="border px-2 py-1 flex-1"
              placeholder="Enter tag (category)..."
              value={tag}
              onChange={(e) => setTag(e.target.value)}
            />
            <button
              className="bg-blue-600 text-white px-4 py-1 rounded"
              onClick={fetchProjects}
              disabled={loading || !tag}
            >
              {loading ? "Loading..." : "Search"}
            </button>
          </div>
          {error && <div className="text-red-600 mb-2">{error}</div>}
          <ul>
            {projects.length === 0 && !loading && <li>No projects found.</li>}
            {projects.map((project) => (
              <li key={project._id} className="border-b py-2">
                <div className="font-semibold">{project.name}</div>
                <div className="text-sm text-gray-600">
                  {project.description}
                </div>
                <div className="text-xs text-gray-400">
                  Tags: {project.tags?.join(", ")}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </ProtectedRoute>
    </AuthProvider>
  );
}
