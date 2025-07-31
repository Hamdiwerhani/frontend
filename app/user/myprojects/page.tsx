"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAuth } from "@/app/context/AuthContext";
import Link from "next/link";

interface Project {
  _id: string;
  name: string;
  description?: string;
  status: string;
  tags?: string[];
  createdAt: string;
  owner: {
    name: string;
  };
}

export default function MyProjectsPage() {
  const { token } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchProjects = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `http://localhost:5005/projects?search=${search}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setProjects(res.data.data);
      } catch (err) {
        console.error("Error fetching projects:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [token, search]);

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

      {loading ? (
        <p>Loading...</p>
      ) : (
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
                Created at: {new Date(project.createdAt).toLocaleString()}
              </p>
              <Link href={`/user/myprojects/${project._id}/edit`}>
                <button>Edit </button>
              </Link>
              <Link href={`/user/myprojects/${project._id}`} key={project._id}>
                <button>Show</button>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
