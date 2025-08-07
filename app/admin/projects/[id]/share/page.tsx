"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/app/store/store";
import { fetchUsers } from "@/app/slices/userSlice";
import { shareProject } from "@/app/slices/projectSlice";

export default function ShareProjectPage() {
  const { token } = useAuth();
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { users } = useSelector((state: RootState) => state.user);
  const { error, status } = useSelector((state: RootState) => state.project);

  const [selectedUser, setSelectedUser] = useState("");
  const [permission, setPermission] = useState<"view" | "edit">("view");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (token) dispatch(fetchUsers(token));
  }, [token, dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess("");
    if (!token || !id) return;
    const resultAction = await dispatch(
      shareProject({
        projectId: id as string,
        userId: selectedUser,
        permission,
        token,
      })
    );
    if (shareProject.fulfilled.match(resultAction)) {
      setSuccess("Project shared successfully!");
    }
  };

  if (status === "loading") return <p>Loading...</p>;
  if (!id) return <p className="text-red-500">Project ID missing.</p>;

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 max-w-md p-4 border rounded"
    >
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}
      <select
        value={selectedUser}
        onChange={(e) => setSelectedUser(e.target.value)}
        required
        className="w-full p-2 border rounded"
      >
        <option value="">Select user to share with</option>
        {users.map((u) => (
          <option key={u._id} value={u._id}>
            {u.name} ({u.email})
          </option>
        ))}
      </select>
      <select
        value={permission}
        onChange={(e) => setPermission(e.target.value as "view" | "edit")}
        className="w-full p-2 border rounded"
      >
        <option value="view">View</option>
        <option value="edit">Edit</option>
      </select>
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Share Project
      </button>
    </form>
  );
}
