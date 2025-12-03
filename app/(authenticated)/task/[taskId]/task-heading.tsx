import LoadingButton from "@/components/loading-button";
import { useToast } from "@/context/toast-context";
import { TaskResponseType, ServerResponseType } from "@/types/api-response";
import { useRef, useState } from "react";

interface Props {
  taskName: string;
  onUpdateHeading: (
    taskName: string
  ) => Promise<ServerResponseType<TaskResponseType>>;
}

export default function TaskHeading({ taskName, onUpdateHeading }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(taskName);
  const [isUpdating, setIsUpdating] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { showToast } = useToast();

  const handleNameChange = async () => {
    try {
      if (isNameSame) return;
      setIsUpdating(true);
      const response = await onUpdateHeading(newName);
      if (!response.ok) {
        showToast({
          type: "error",
          message: response.message,
        });
        return;
      }
      setIsEditing(false);
    } catch (error) {
      console.error(error);

      const errorMessage =
        error instanceof Error
          ? error.message
          : "Error occured while updating task name.";

      showToast({
        type: "error",
        message: errorMessage,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const isNameSame = taskName === newName.trim();

  return (
    <div className="relative">
      <h1
        className="px-2 py-1 text-2xl sm:text-3xl font-semibold cursor-text border border-transparent rounded hover:bg-slate-100 hover:border-slate-200"
        onClick={() => {
          setIsEditing(true);
          setTimeout(() => inputRef.current?.focus());
        }}
      >
        {taskName}
      </h1>
      <input
        ref={inputRef}
        type="text"
        className={`absolute top-0 left-0 right-0 block w-full text-2xl sm:text-3xl font-semibold ${
          isEditing ? "opacity-100 visible" : "opacity-0 invisible"
        } shadow-lg`}
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
        onBlur={() => setTimeout(() => setIsEditing(false))}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            setIsEditing(false);
          } else if (e.key === "Enter") {
            handleNameChange();
          }
        }}
      />
      {isEditing && !isNameSame && (
        <LoadingButton
          className="primary-button absolute top-full right-0 mt-2 shadow-lg z-10 disabled:opacity-100!"
          onMouseDown={handleNameChange}
          isLoading={isUpdating}
        >
          Save
        </LoadingButton>
      )}
    </div>
  );
}
