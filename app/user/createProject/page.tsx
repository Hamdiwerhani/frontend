"use client";

import CreateProjectForm from "@/app/components/CreateProjectForm";
import RoleProtectedRoute from "@/app/context/RoleProtectedRoute";

export default function CreateProjectPage() {
  return (
    <div className="p-4">
      <RoleProtectedRoute allowedRoles={["user", "admin"]}>
        <CreateProjectForm />
      </RoleProtectedRoute>
    </div>
  );
}
