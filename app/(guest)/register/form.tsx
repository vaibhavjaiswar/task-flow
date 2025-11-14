"use client";

import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import LoadingButton from "@/components/loading-button";
import { register as registerUser } from "@/apis";
import { useToast } from "@/context/toast-context";
import { RegisterFormInputs } from "@/types";

export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormInputs>();
  const router = useRouter();
  const { showToast } = useToast();

  const onSubmit: SubmitHandler<RegisterFormInputs> = async (rawData) => {
    const trimmedName = rawData.name.trim();
    if (trimmedName.length < 2) {
      setError("name", {
        type: "minLength",
        message: "Name must be at least 2 characters",
      });
      return;
    }
    const data = rawData;

    try {
      const response = await registerUser(data);

      if (!response.ok) {
        showToast({
          type: "error",
          message: response.message,
        });
        return;
      }

      reset();
      showToast({
        type: "success",
        message: "Registeration successful. Please login to continue.",
      });
      router.push("/login");
    } catch (err: unknown) {
      console.error(err);
      const errorMessage =
        err instanceof Error ? err.message : "Error occured while registering!";
      showToast({
        type: "error",
        message: "",
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-md mx-auto space-y-4"
    >
      {/* Name */}
      <label className="block">
        <span className="text-sm mb-1">Name</span>
        <input
          type="text"
          defaultValue={"Test User"}
          placeholder="Type your name..."
          className="block w-full border rounded px-3 py-2"
          {...register("name", {
            required: "Name is required",
            minLength: {
              value: 2,
              message: "Name must be at least 2 characters",
            },
            onBlur: (e: React.FocusEvent<HTMLInputElement, Element>) => {
              e.target.value = e.target.value.trim();
            },
          })}
        />
        {errors.name && (
          <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
        )}
      </label>

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
          <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
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
          <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
        )}
      </label>

      {/* Buttons */}
      <div className="max-w-md mx-auto flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4">
        <LoadingButton
          type="submit"
          isLoading={isSubmitting}
          className="flex-1 primary-button w-full sm:w-auto"
        >
          Register
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
