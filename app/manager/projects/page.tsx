import RoleProtectedRoute from "@/app/context/RoleProtectedRoute";

export default function ManagerProject() {
  return (
    <RoleProtectedRoute allowedRoles={["manager"]}>
      <div className="p-4">
        <h1 className="text-2xl font-bold">ManagerProject</h1>
        <p>Only accessible by Managers users.</p>
      </div>
    </RoleProtectedRoute>
  );
}
