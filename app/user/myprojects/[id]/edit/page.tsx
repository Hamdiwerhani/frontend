"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/store/store";
import { fetchProjectById, updateProject } from "@/app/slices/projectSlice";

const statusValues = ["todo", "in-progress", "done"] as const;

const projectSchema = z.object({
  name: z.string().min(2, "Project name must be at least 2 characters"),
  description: z.string().optional(),
  status: z
    .enum(statusValues)
    .or(z.literal(""))
    .refine((val): val is (typeof statusValues)[number] => val !== "", {
      message: "Status is required",
    }),
  tags: z.string().optional(),
});

type ProjectForm = z.infer<typeof projectSchema>;

const isValidStatus = (val: unknown): val is ProjectForm["status"] => {
  return [...statusValues, ""].includes(val as ProjectForm["status"]);
};

export default function EditProject() {
  const { id } = useParams();
  const { token } = useAuth();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { project, error, status } = useSelector(
    (state: RootState) => state.project
  );
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProjectForm>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      description: "",
      status: "",
      tags: "",
    },
  });

  useEffect(() => {
    if (id && token) {
      dispatch(fetchProjectById({ id: id as string, token }));
    }
  }, [id, token, dispatch]);

  useEffect(() => {
    if (project) {
      setValue("name", project.name);
      setValue("description", project.description || "");
      setValue("tags", project.tags?.join(", ") || "");
      setValue("status", isValidStatus(project.status) ? project.status : "");
    }
  }, [project, setValue]);

  const onSubmit = async (data: ProjectForm) => {
    if (!token || typeof id !== "string") return;

    const payload = {
      ...data,
      tags: data.tags?.split(",").map((tag) => tag.trim()),
    };

    const resultAction = await dispatch(
      updateProject({ id, data: payload, token })
    );

    if (updateProject.fulfilled.match(resultAction)) {
      router.push("/user/myprojects");
    }
  };

  if (status === "loading") return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Edit Project</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          type="text"
          {...register("name")}
          className="w-full border p-2"
          placeholder="Project name"
        />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}

        <textarea
          {...register("description")}
          className="w-full border p-2"
          placeholder="Description"
        />
        {errors.description && (
          <p className="text-red-500">{errors.description.message}</p>
        )}

        <select {...register("status")} className="w-full border p-2">
          <option value="">Select Status</option>
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
        {errors.status && (
          <p className="text-red-500">{errors.status.message}</p>
        )}

        <input
          type="text"
          {...register("tags")}
          className="w-full border p-2"
          placeholder="Tags (comma separated)"
        />

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
