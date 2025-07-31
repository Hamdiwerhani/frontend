import RoleProtectedRoute from "@/app/components/RoleProtectedRoute";

export default function AdminUsers() {
  return (
    <RoleProtectedRoute allowedRoles={["admin"]}>
      <div className="p-4">
        <h1 className="text-2xl font-bold">Admin: Users</h1>
        <p>Only accessible by Admin users.</p>
      </div>
    </RoleProtectedRoute>
  );
}
