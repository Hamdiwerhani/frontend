"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import RoleProtectedRoute from "@/app/context/RoleProtectedRoute";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/store/store";
import { fetchUserById, updateUser } from "@/app/slices/userSlice";

const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  role: z.enum(["admin", "manager", "user"]),
});
type UserForm = z.infer<typeof userSchema>;

export default function EditUserPage() {
  const { token } = useAuth();
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const { user, status, error } = useSelector((state: RootState) => state.user);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<UserForm>({
    resolver: zodResolver(userSchema),
  });

  useEffect(() => {
    if (typeof id === "string" && token) {
      dispatch(fetchUserById({ id, token }));
    }
  }, [id, token, dispatch]);

  useEffect(() => {
    if (user) {
      setValue("name", user.name);
      setValue("email", user.email);
      setValue("role", user.role as "admin" | "manager" | "user");
    }
  }, [user, setValue]);

  const onSubmit = async (data: UserForm) => {
    if (!token || typeof id !== "string") return;
    const resultAction = await dispatch(updateUser({ id, data, token }));

    if (updateUser.fulfilled.match(resultAction)) {
      router.push("/admin/users");
    }
  };

  if (status === "loading") {
    return <div className="text-center mt-20 text-gray-600">Loading...</div>;
  }

  return (
    <RoleProtectedRoute allowedRoles={["admin"]}>
      <div className="max-w-xl mx-auto mt-12">
        <h1 className="text-2xl font-bold mb-6">Edit User</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              className="w-full border rounded p-2"
              type="text"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-red-500">{errors.name.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              className="w-full border rounded p-2"
              type="email"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-500">{errors.email.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium">Role</label>
            <select className="w-full border rounded p-2" {...register("role")}>
              <option value="">Select role</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="user">User</option>
            </select>
            {errors.role && (
              <p className="text-red-500">{errors.role.message}</p>
            )}
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </form>
      </div>
    </RoleProtectedRoute>
  );
}
