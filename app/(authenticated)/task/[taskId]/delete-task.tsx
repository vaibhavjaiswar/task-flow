import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteUserTask } from "@/apis";
import { useToast } from "@/context/toast-context";
import { Task } from "@/prisma/generated/client";
import Dialog from "@/components/dialog";
import LoadingButton from "@/components/loading-button";

interface Props {
  open: boolean;
  task: Task;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function DeleteTaskDialog({ open, task, setOpen }: Props) {
  const [isDeleting, setIsDeleting] = useState(false);

  const { showToast } = useToast();
  const router = useRouter();

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const response = await deleteUserTask(task.id);
      const { ok, message } = response;

      if (!ok) {
        throw new Error(message);
      }

      showToast({
        type: "info",
        message: "Task deleted successfully.",
      });
      router.replace(`/project/${task.projectId}`);
    } catch (error) {
      console.error(error);

      const errorMessage =
        error instanceof Error
          ? error.message
          : "Error occured while deleting task.";

      showToast({
        type: "error",
        message: errorMessage,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onBackdropClick={() => setOpen(false)}
      className="sm:w-lg bg-white"
    >
      <div className="mb-4">
        <h1 className="text-2xl font-semibold">Delete “{task.name}”?</h1>
        <p className="mt-1 text-sm font-light">
          This action cannot be undone. Are you sure you want to delete this
          task?
        </p>
      </div>
      <div className="max-w-full flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4">
        <LoadingButton
          type="submit"
          isLoading={isDeleting}
          onClick={handleDelete}
          className="flex-1 primary-button w-full sm:w-auto bg-red-700! hover:bg-red-800! border-red-700! hover:border-red-800!"
        >
          Delete Task
        </LoadingButton>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="flex-1 secondary-button w-full sm:w-auto"
        >
          Cancel
        </button>
      </div>
    </Dialog>
  );
}
