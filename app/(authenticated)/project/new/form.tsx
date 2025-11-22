"use client";

import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { useToast } from "@/context/toast-context";
import { NewProjectFormInputs } from "@/types";
import LoadingButton from "@/components/loading-button";
import { createNewProject } from "@/apis";

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
      const response = await createNewProject(data);

      if (!response.ok) {
        showToast({
          type: "error",
          message: response.message || "Failed to create project.",
        });
        return;
      }

      showToast({
        type: "success",
        message: `Project "${data.name}" created successfully`,
      });

      reset();
      router.push("/dashboard");
    } catch (error) {
      console.error("Create project error:", error);

      const errorMessage =
        error instanceof Error
          ? error.message
          : "An error occurred while creating the project.";

      showToast({
        type: "error",
        message: errorMessage,
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-lg lg:max-w-2xl space-y-4"
    >
      {/* Project Name */}
      <label className="block">
        <span className="text-sm mb-1">Project Name</span>
        <input
          type="text"
          placeholder="Enter project name..."
          className="block w-full"
          {...register("name", {
            required: "Project name is required",
          })}
        />
        {errors.name && (
          <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
        )}
      </label>
      {/* Description */}
      <label className="block">
        <span className="text-sm mb-1">Description</span>
        <textarea
          placeholder="Write your project's details..."
          className="block w-full h-32 bg-white resize-y"
          {...register("description")}
        ></textarea>
        {errors.description && (
          <p className="text-xs text-red-500 mt-1">
            {errors.description.message}
          </p>
        )}
      </label>
      {/* Buttons */}
      <div className="max-w-full flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4">
        <LoadingButton
          type="submit"
          isLoading={isSubmitting}
          className="flex-1 primary-button w-full sm:w-auto"
        >
          Create Project
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
