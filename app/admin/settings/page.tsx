import RoleProtectedRoute from "@/app/components/RoleProtectedRoute";

export default function settings() {
  return (
    <RoleProtectedRoute allowedRoles={["admin"]}>
      <div> Settings : Admin</div>;
    </RoleProtectedRoute>
  );
}
