"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

const projectSchema = z.object({
  name: z.string().min(2, "Project name must be at least 2 characters"),
  description: z.string().optional(),
  status: z.enum(["todo", "in-progress", "done"]),
  tags: z
    .string()
    .optional()
    .transform((val) => (val ? val.split(",").map((tag) => tag.trim()) : [])),
});

type ProjectForm = z.infer<typeof projectSchema>;

export default function CreateProjectForm() {
  const { token } = useAuth();
  const router = useRouter();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProjectForm>({
    resolver: zodResolver(projectSchema),
  });

  const onSubmit = async (data: ProjectForm) => {
    setError("");
    try {
      await axios.post("http://localhost:5005/projects", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create project");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-md mx-auto space-y-4 p-4 bg-white rounded shadow"
    >
      <h2 className="text-xl font-bold mb-4">Create New Project</h2>

      <div>
        <label htmlFor="name" className="block font-semibold mb-1">
          Project Name
        </label>
        <input
          id="name"
          {...register("name")}
          className="input"
          placeholder="Project name"
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block font-semibold mb-1">
          Description
        </label>
        <textarea
          id="description"
          {...register("description")}
          className="input"
          placeholder="Optional project description"
        />
        {errors.description && (
          <p className="text-red-500 text-sm">{errors.description.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="status" className="block font-semibold mb-1">
          Status
        </label>
        <select id="status" {...register("status")} className="input">
          <option value="">Select status</option>
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
        {errors.status && (
          <p className="text-red-500 text-sm">{errors.status.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="tags" className="block font-semibold mb-1">
          Tags (comma separated)
        </label>
        <input
          id="tags"
          {...register("tags")}
          className="input"
          placeholder="e.g. urgent, frontend, api"
        />
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn btn-primary w-full"
      >
        {isSubmitting ? "Creating..." : "Create Project"}
      </button>
    </form>
  );
}
