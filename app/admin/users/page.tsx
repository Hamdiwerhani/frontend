"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, deleteUser } from "@/app/slices/userSlice";
import RoleProtectedRoute from "@/app/context/RoleProtectedRoute";
import { AppDispatch, RootState } from "@/app/store/store";
import AlertPopup from "@/app/components/AlertPopup";

export default function AdminUserListPage() {
  const [popup, setPopup] = useState<{
    open: boolean;
    message: string;
    type: "error" | "success";
  }>({
    open: false,
    message: "",
    type: "error",
  });
  const { token } = useAuth();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { users, error, status } = useSelector(
    (state: RootState) => state.user
  );

  useEffect(() => {
    if (token) dispatch(fetchUsers(token));
  }, [token, dispatch]);

  const handleDelete = (id: string) => {
    if (token) dispatch(deleteUser({ id, token }));
    setPopup({
      open: true,
      message: "User deleted successfully!",
      type: "success",
    });
  };

  return (
    <RoleProtectedRoute allowedRoles={["admin"]}>
      <AlertPopup
        message={popup.open ? popup.message : ""}
        onClose={() => setPopup({ ...popup, open: false })}
        type={popup.type}
      />
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">All Users</h1>
        {status === "loading" && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        <ul className="space-y-2">
          {users.map((u) => (
            <li key={u._id} className="p-3 border rounded shadow">
              <p>
                <strong>Name:</strong> {u.name}
              </p>
              <p>
                <strong>Email:</strong> {u.email}
              </p>
              <p>
                <strong>Role:</strong> {u.role}
              </p>
              <p>
                <strong>Joined:</strong>{" "}
                {new Date(u.createdAt).toLocaleDateString()}
              </p>
              <button
                className="text-blue-600 mr-4"
                onClick={() => router.push(`/admin/users/${u._id}`)}
              >
                View
              </button>
              <button
                className="text-blue-600 mr-4"
                onClick={() => router.push(`/admin/users/${u._id}/edit`)}
              >
                Edit
              </button>
              <button
                className="text-red-600"
                onClick={() => handleDelete(u._id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </RoleProtectedRoute>
  );
}
