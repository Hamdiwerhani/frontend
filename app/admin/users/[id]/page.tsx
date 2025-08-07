"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import RoleProtectedRoute from "@/app/context/RoleProtectedRoute";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/store/store";
import { fetchUserById } from "@/app/slices/userSlice";

export default function ViewUserPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams();
  const { token } = useAuth();

  const { user, status, error } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (token && id) {
      dispatch(fetchUserById({ id: id as string, token }));
    }
  }, [id, token]);

  return (
    <RoleProtectedRoute allowedRoles={["admin"]}>
      <div className="max-w-xl mx-auto mt-12">
        <h1 className="text-2xl font-bold mb-6">User Details</h1>

        {status === "loading" && <p>Loading...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}

        {user && (
          <div className="space-y-2 border rounded p-4 shadow">
            <p>
              <strong>Name:</strong> {user.name}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Role:</strong> {user.role}
            </p>
          </div>
        )}
      </div>
    </RoleProtectedRoute>
  );
}
