"use client";
import { useState } from "react";
import { useAuth } from "./context/AuthContext";
import { useDispatch, useSelector } from "react-redux";

import { fetchProjectsByTag } from "./slices/projectSlice";
import { AppDispatch, RootState } from "./store/store";

export default function Home() {
  const { token } = useAuth();
  const [tag, setTag] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const { projects, status, error } = useSelector(
    (state: RootState) => state.project
  );

  const handleSearch = () => {
    if (token && tag) {
      dispatch(fetchProjectsByTag({ tag, token }));
    }
  };

  return (
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
          onClick={handleSearch}
          disabled={status === "loading" || !tag}
        >
          {status === "loading" ? "Loading..." : "Search"}
        </button>
      </div>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <ul>
        {projects.length === 0 && status !== "loading" && (
          <li>No projects found.</li>
        )}
        {projects.map((project) => (
          <li key={project._id} className="border-b py-2">
            <div className="font-semibold">{project.name}</div>
            <div className="text-sm text-gray-600">{project.description}</div>
            <div className="text-xs text-gray-400">
              Tags: {project.tags?.join(", ")}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
