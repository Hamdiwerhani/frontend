"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { registerUser } from "../slices/authSlice";
import { AppDispatch, RootState } from "@/app/store/store";

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
type SignupForm = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { push } = useRouter();
  const { error, status } = useSelector((state: RootState) => state.auth);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupForm) => {
    const resultAction = await dispatch(registerUser(data));
    if (registerUser.fulfilled.match(resultAction)) {
      push("/login");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">Signup</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input className="input" placeholder="Name" {...register("name")} />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        <input className="input" placeholder="Email" {...register("email")} />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}
        <input
          className="input"
          placeholder="Password"
          type="password"
          {...register("password")}
        />
        {errors.password && (
          <p className="text-red-500">{errors.password.message}</p>
        )}
        <button
          className="btn btn-primary w-full"
          disabled={status === "loading"}
        >
          {status === "loading" ? "Signing up..." : "Sign Up"}
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
}
