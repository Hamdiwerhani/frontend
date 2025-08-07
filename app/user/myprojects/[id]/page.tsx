"use client";

import { useAuth } from "@/app/context/AuthContext";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/store/store";
import { fetchProjectById } from "@/app/slices/projectSlice";
import { useParams } from "next/navigation";
import { useEffect } from "react";

export default function ProjectDetails() {
  const { id } = useParams();
  const { token } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const { project, status, error } = useSelector(
    (state: RootState) => state.project
  );

  useEffect(() => {
    if (token && id && project?._id !== id) {
      dispatch(fetchProjectById({ id: id as string, token }));
    }
  }, [id, token]);

  if (error) return <p className="text-red-500">{error}</p>;
  if (!project) return <p>Loading project...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {status === "loading" && <p>Loading...</p>}
      <h1 className="text-3xl font-bold mb-4">{project.name}</h1>
      <p className="mb-2 text-gray-700">{project.description}</p>
      <p className="text-sm mb-2">
        <strong>Status:</strong> {project.status}
      </p>
      <p className="text-sm mb-2">
        <strong>Owner:</strong> {project.owner?.name ?? "Unknown"} (
        {project.owner?.email ?? "Unknown"})
      </p>
      {Array.isArray(project.tags) && project.tags.length > 0 && (
        <p className="text-sm text-gray-600">
          <strong>Tags:</strong> {project.tags.join(", ")}
        </p>
      )}
    </div>
  );
}
