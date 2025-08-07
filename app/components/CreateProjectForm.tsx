"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { createProject } from "../slices/projectSlice";

const projectSchema = z.object({
  name: z.string().min(2, "Project name must be at least 2 characters"),
  description: z.string().optional(),
  status: z.enum(["todo", "in-progress", "done"]),
  tags: z.string().optional(),
});
type ProjectForm = z.infer<typeof projectSchema>;

export default function CreateProjectForm() {
  const { token } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProjectForm>({
    resolver: zodResolver(projectSchema),
  });

  const reduxError = useSelector((state: RootState) => state.project.error);

  const onSubmit = async (data: ProjectForm) => {
    if (!token) return;

    const resultAction = await dispatch(
      createProject({
        data: {
          ...data,
          tags: data.tags
            ? data.tags
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean)
            : [],
        },
        token,
      })
    );

    if (createProject.fulfilled.match(resultAction)) {
      router.push("/user/myprojects");
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

      {reduxError && <p className="text-red-500 text-sm">{reduxError}</p>}

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
