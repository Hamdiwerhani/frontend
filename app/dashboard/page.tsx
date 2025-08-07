"use client";

import LogoutButton from "../components/LogoutButton";
import ProtectedRoute from "../context/ProtectedRoute";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div className="p-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>
      <LogoutButton />
    </ProtectedRoute>
  );
}
