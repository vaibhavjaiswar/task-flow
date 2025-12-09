"use client";

import { SubmitHandler, useForm, useWatch } from "react-hook-form";
import { TaskPriority, TaskStatus } from "@/prisma/generated/enums";
import { useToast } from "@/context/toast-context";
import { createNewTaskInProject } from "@/apis";
import { NewTaskFormInputs } from "@/types";
import { TaskPrirotyLabel, TaskStatusLabel } from "@/utils";
import Dialog from "@/components/dialog";
import LoadingButton from "@/components/loading-button";
import Select from "@/components/select";

interface Props {
  projectId: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSuccess?: () => void;
}

export default function AddNewTaskDialog({
  projectId,
  open,
  setOpen,
  onSuccess,
}: Props) {
  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<NewTaskFormInputs>({
    defaultValues: { status: "TODO", priority: "MEDIUM" },
  });
  const { showToast } = useToast();

  const onSubmit: SubmitHandler<NewTaskFormInputs> = async (task) => {
    try {
      const response = await createNewTaskInProject(projectId, task);

      if (!response.ok) {
        showToast({
          type: "error",
          message: response.message || "Failed to create task.",
        });
        return;
      }

      showToast({
        type: "success",
        message: `Task "${task.name}" created successfully.`,
      });

      reset();
      setOpen(false);
      onSuccess?.();
    } catch (error) {
      console.error("Create task error:", error);

      const errorMessage =
        error instanceof Error
          ? error.message
          : "An error occurred while creating the task.";

      showToast({
        type: "error",
        message: errorMessage,
      });
    }
  };

  const status = useWatch({
    control,
    name: "status",
  });
  const taskStatusEntries = Object.entries(TaskStatusLabel) as [
    TaskStatus,
    string
  ][];
  const priority = useWatch({
    control,
    name: "priority",
  });
  const taskPriorityEntries = Object.entries(TaskPrirotyLabel) as [
    TaskPriority,
    string
  ][];

  return (
    <Dialog
      open={open}
      onBackdropClick={() => setOpen(false)}
      className="sm:w-xl md:w-3xl bg-white"
    >
      <div className="mb-4">
        <h1 className="text-2xl font-semibold">Create New Task</h1>
        <p className="mt-1 text-sm font-light">
          Fill out the details below to add task in the project.
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Project Name */}
        <label className="block">
          <span className="text-sm mb-1">Task Name</span>
          <input
            type="text"
            placeholder="Enter Task name..."
            className="block w-full"
            {...register("name", {
              required: "Task name is required",
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
            placeholder="Write your task's details..."
            className="block w-full h-32 bg-white resize-y"
            {...register("description")}
          ></textarea>
          {errors.description && (
            <p className="text-xs text-red-500 mt-1">
              {errors.description.message}
            </p>
          )}
        </label>

        {/* Priority */}
        <label className="block space-y-1">
          <span className="text-sm mb-1">Priority</span>
          <Select
            value={priority}
            onChange={(value) => setValue("priority", value)}
            options={taskPriorityEntries}
            placeholder="Select priority..."
          />
        </label>

        {/* Status */}
        <label className="block space-y-1">
          <span className="text-sm mb-1">Status</span>
          <Select
            value={status}
            onChange={(value) => setValue("status", value)}
            options={taskStatusEntries}
            placeholder="Select status..."
          />
        </label>

        {/* Due Date */}
        <label className="block">
          <span className="text-sm mb-1">Due Date</span>
          <input
            type="date"
            min={new Date().toISOString().split("T")[0]}
            className="block w-full"
            {...register("dueDate")}
          />
          {errors.dueDate && (
            <p className="text-xs text-red-500 mt-1">
              {errors.dueDate.message}
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
            Create Task
          </LoadingButton>

          {/* <button
            type="button"
            onClick={() => reset()}
            className="flex-1 secondary-button w-full sm:w-auto"
          >
            Reset
          </button> */}

          <button
            type="button"
            onClick={() => setOpen(false)}
            className="flex-1 secondary-button w-full sm:w-auto"
          >
            Close
          </button>
        </div>
      </form>
    </Dialog>
  );
}
