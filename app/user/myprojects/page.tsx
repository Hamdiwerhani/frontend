"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { searchProjects } from "@/app/slices/projectSlice";
import { AppDispatch, RootState } from "@/app/store/store";

export default function MyProjectsPage() {
  const { token } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const { projects, error, status } = useSelector(
    (state: RootState) => state.project
  );
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (token) {
      dispatch(searchProjects({ query: search, token }));
    }
  }, [token, search, dispatch]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">My Projects</h1>

      <input
        type="text"
        placeholder="Search projects..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 rounded mb-4 w-full"
      />

      {status === "loading" && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <ul className="space-y-4">
        {projects.map((project) => (
          <li key={project._id} className="p-4 border rounded shadow-sm">
            <h2 className="text-xl font-bold">{project.name}</h2>
            <p className="text-gray-600">
              {project.description || "No description"}
            </p>
            <p className="text-sm text-gray-500">Status: {project.status}</p>
            <p className="text-sm text-gray-500">
              Tags: {project.tags?.join(", ")}
            </p>
            <p className="text-sm text-gray-500">
              Owner: {project.owner?.name}
            </p>
            <p className="text-xs text-gray-400">
              Created at: {project.createdAt}
            </p>
            <Link href={`/user/myprojects/${project._id}/edit`}>
              <button>Edit</button>
            </Link>
            <Link href={`/user/myprojects/${project._id}`}>
              <button>Show</button>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
