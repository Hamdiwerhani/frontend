"use client";

import RoleProtectedRoute from "../context/RoleProtectedRoute";

export default function UserPage() {
  return (
    <RoleProtectedRoute allowedRoles={["user"]}>
      <div className="p-4">
        <h1 className="text-2xl font-bold">User Dashboard</h1>
        <p>Only accessible by users.</p>
      </div>
    </RoleProtectedRoute>
  );
}
