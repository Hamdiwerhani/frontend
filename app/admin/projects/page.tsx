// ✅ FRONTEND: Updated AllProjectsPage to fetch shared + owned projects
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

export default function AllProjectsPage() {
  const { token } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState<any[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchProjects = async () => {
      try {
        const res = await fetch("http://localhost:5005/projects/admin/all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Access denied or failed to load projects.");
        }

        const data = await res.json();
        setProjects(data.data);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchProjects();
  }, [token]);

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">My Projects</h1>
      <ul className="space-y-4">
        {projects.map((project) => (
          <li key={project._id} className="border p-4 rounded shadow">
            <h2 className="text-xl font-semibold">{project.name}</h2>
            <p className="text-gray-700">{project.description}</p>
            <p className="text-sm">
              <strong>Status:</strong> {project.status}
            </p>
            <p className="text-sm">
              <strong>Owner:</strong> {project.owner?.name} (
              {project.owner?.email})
            </p>
            {project.sharedWith?.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-gray-500">Shared With:</p>
                {project.sharedWith.map((entry: any) => (
                  <p key={entry.user._id} className="text-xs">
                    {entry.user.email} ({entry.permissions.join(", ")})
                  </p>
                ))}
              </div>
            )}

            <div className="flex space-x-4 mt-4">
              <button
                onClick={() =>
                  router.push(`/admin/projects/${project._id}/edit`)
                }
                className="text-sm text-blue-600 hover:underline"
              >
                Edit / Transfer Ownership
              </button>

              <button
                onClick={() =>
                  router.push(`/admin/projects/${project._id}/share`)
                }
                className="text-sm text-blue-600 hover:underline"
              >
                Share
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
