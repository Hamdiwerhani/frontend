"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

export default function ProjectDetails() {
  const { id } = useParams();
  const { token } = useAuth();
  const router = useRouter();
  const [project, setProject] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }

    fetch(`http://localhost:5005/projects/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Access denied or not found");
        return res.json();
      })
      .then(setProject)
      .catch((err) => setError(err.message));
  }, [id, token]);

  if (error) return <p className="text-red-500">{error}</p>;
  if (!project) return <p>Loading project...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{project.name}</h1>
      <p className="mb-2 text-gray-700">{project.description}</p>
      <p className="text-sm mb-2">
        <strong>Status:</strong> {project.status}
      </p>
      <p className="text-sm mb-2">
        <strong>Owner:</strong> {project.owner?.name} ({project.owner?.email})
      </p>
      {project.tags?.length > 0 && (
        <p className="text-sm text-gray-600">
          <strong>Tags:</strong> {project.tags.join(", ")}
        </p>
      )}
    </div>
  );
}
