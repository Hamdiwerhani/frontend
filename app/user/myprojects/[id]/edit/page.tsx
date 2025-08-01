"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

export default function EditProject() {
  const { id } = useParams();
  const { token } = useAuth();
  const router = useRouter();
  const [project, setProject] = useState<any>(null);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    description: "",
    status: "",
    tags: "",
  });

  useEffect(() => {
    if (!token) return;

    fetch(`http://localhost:5005/projects/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Access denied");
        return res.json();
      })
      .then((data) => {
        setProject(data);
        setForm({
          name: data.name,
          description: data.description || "",
          status: data.status,
          tags: data.tags?.join(", ") || "",
        });
      })
      .catch((err) => setError(err.message));
  }, [id, token]);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const res = await fetch(`http://localhost:5005/projects/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...form,
        tags: form.tags.split(",").map((t) => t.trim()),
      }),
    });

    if (!res.ok) {
      const { message } = await res.json();
      setError(message || "Update failed");
    } else {
      router.push(`/user/myprojects/${id}`);
    }
  };

  if (error) return <p className="text-red-500">{error}</p>;
  if (!project) return <p>Loading...</p>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Edit Project</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full border p-2"
          placeholder="Project name"
          required
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="w-full border p-2"
          placeholder="Description"
        />
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="w-full border p-2"
          required
        >
          <option value="">Select Status</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
        <input
          type="text"
          name="tags"
          value={form.tags}
          onChange={handleChange}
          className="w-full border p-2"
          placeholder="Tags (comma separated)"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
