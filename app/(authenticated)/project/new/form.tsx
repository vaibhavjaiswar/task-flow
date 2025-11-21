"use client";

import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { useToast } from "@/context/toast-context";
import { NewProjectFormInputs } from "@/types";
import LoadingButton from "@/components/loading-button";

export default function NewProjectForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewProjectFormInputs>();
  const router = useRouter();
  const { showToast } = useToast();

  const onSubmit: SubmitHandler<NewProjectFormInputs> = async (data) => {
    try {
      //   const response = await login(data);
      //   if (!response.ok) {
      //     showToast({
      //       type: "error",
      //       message: response.message,
      //     });
      //     return;
      //   }
      //   reset();
      //   router.push("/dashboard");
    } catch (error) {
      console.error(error);

      const errorMessage =
        error instanceof Error
          ? error.message
          : "Error occured while creating new project.";

      showToast({
        type: "error",
        message: errorMessage,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg space-y-4">
      {/* Email */}
      <label className="block">
        <span className="text-sm mb-1">Project Name</span>
        <input
          type="email"
          defaultValue={"user@email.com"}
          placeholder="Enter project name..."
          className="block w-full border rounded px-3 py-2"
          {...register("projectName", {
            required: "Project name is required",
          })}
        />
        {errors.projectName && (
          <p className="text-xs text-red-500 mt-1">{errors.projectName.message}</p>
        )}
      </label>
      {/* Buttons */}
      <div className="max-w-full flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4">
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
