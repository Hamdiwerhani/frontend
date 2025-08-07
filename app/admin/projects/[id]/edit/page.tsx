"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/store/store";
import { fetchProjectById, transferOwnership } from "@/app/slices/projectSlice";
import { useAuth } from "@/app/context/AuthContext";
import { fetchUsers } from "@/app/slices/userSlice";

export default function EditProjectPage() {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { token } = useAuth();

  const {
    project,
    status: projectStatus,
    error: projectError,
  } = useSelector((state: RootState) => state.project);
  const {
    users,
    status: usersStatus,
    error: usersError,
  } = useSelector((state: RootState) => state.user);

  const [form, setForm] = useState({ newOwnerId: "" });

  useEffect(() => {
    if (id && token) {
      dispatch(fetchProjectById({ id: id as string, token }));
    }
    if (token) {
      dispatch(fetchUsers(token));
    }
  }, [token, id, dispatch]);

  useEffect(() => {
    if (project && project.owner?._id) {
      setForm({ newOwnerId: project.owner._id });
    }
  }, [project]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm({ ...form, newOwnerId: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(
      transferOwnership({
        projectId: id as string,
        newOwnerId: form.newOwnerId,
        token: token!,
      })
    );

    router.push("/admin/projects");
  };

  if (projectStatus === "loading" || usersStatus === "loading")
    return <p>Loading...</p>;
  if (projectError || usersError)
    return <p className="text-red-500">{projectError || usersError}</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Transfer Project Ownership</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          name="newOwnerId"
          value={form.newOwnerId}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="">-- Select New Owner --</option>
          {users.map((u) => (
            <option key={u._id} value={u._id}>
              {u.name} ({u.email})
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Transfer Ownership
        </button>
      </form>
    </div>
  );
}
