"use client";

import RoleProtectedRoute from "../components/RoleProtectedRoute";

export default function AdminPage() {
  return (
    <RoleProtectedRoute allowedRoles={["admin"]}>
      <div className="p-4">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p>Only accessible by Admin users.</p>
      </div>
    </RoleProtectedRoute>
  );
}
