"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: Array<"admin" | "manager" | "user">;
}

export default function RoleProtectedRoute({
  children,
  allowedRoles,
}: RoleProtectedRouteProps) {
  const { token, user } = useAuth();
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!token) {
      router.push("/login");
    } else {
      setChecking(false);
    }
  }, [token]);

  if (checking) return null;

  if (!user || !allowedRoles.includes(user.role)) {
    return (
      <div className="p-8 text-center text-red-500 text-xl">
        Access Denied: You are not authorized to view this page.
      </div>
    );
  }

  return <>{children}</>;
}
