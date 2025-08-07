import RoleProtectedRoute from "@/app/context/RoleProtectedRoute";

export default function settings() {
  return (
    <RoleProtectedRoute allowedRoles={["admin"]}>
      <div> Settings : Admin</div>;
    </RoleProtectedRoute>
  );
}
