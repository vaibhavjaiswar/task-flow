"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import LoadingButton from "@/components/loading-button";

interface LoginFormInputs {
  email: string;
  password: string;
}

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>();

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    console.log("Form submitted:", data);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Login failed");

      const result = await res.json();
      console.log(result);

      reset();
    } catch (err: any) {
      console.error(err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-md mx-auto space-y-4"
    >
      {/* Email */}
      <label className="block">
        <span className="text-sm mb-1">Email</span>
        <input
          type="email"
          defaultValue={"user@email.com"}
          placeholder="Type your email..."
          className="block w-full border rounded px-3 py-2"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Enter a valid email address",
            },
          })}
        />
        {errors.email && (
          <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
        )}
      </label>

      {/* Password */}
      <label className="block">
        <span className="text-sm mb-1">Password</span>
        <input
          type="password"
          defaultValue={"userpassword"}
          placeholder="Type your password..."
          className="block w-full border rounded px-3 py-2"
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters long",
            },
          })}
        />
        {errors.password && (
          <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
        )}
      </label>

      {/* Buttons */}
      <div className="max-w-md mx-auto flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4">
        <LoadingButton
          type="submit"
          isLoading={isSubmitting}
          className="flex-1 primary-button w-full sm:w-auto"
        >
          Log in
        </LoadingButton>

        <button
          type="button"
          onClick={() => reset()}
          className="flex-1 secondary-button w-full sm:w-auto"
        >
          Reset
        </button>
      </div>
    </form>
  );
}
