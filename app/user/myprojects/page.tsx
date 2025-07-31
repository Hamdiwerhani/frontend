import RoleProtectedRoute from "@/app/components/RoleProtectedRoute";

export default function ManagerProject() {
  return (
    <RoleProtectedRoute allowedRoles={["user", "admin"]}>
      <div className="p-4">
        <h1 className="text-2xl font-bold">UserProject</h1>
        <p>Only accessible by users.</p>
      </div>
    </RoleProtectedRoute>
  );
}
