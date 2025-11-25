import LoadingButton from "@/components/loading-button";
import { useToast } from "@/context/toast-context";
import { ProjectResponseType, ServerResponseType } from "@/types/api-response";
import { useRef, useState } from "react";

interface Props {
  description: null | string;
  onUpdateDescription: (
    projectDescription: string
  ) => Promise<ServerResponseType<ProjectResponseType>>;
}

export default function description({
  description,
  onUpdateDescription,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [newDescription, setNewDescription] = useState(description ?? "");
  const [isUpdating, setIsUpdating] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { showToast } = useToast();

  const handleNameChange = async () => {
    try {
      // console.log("Change project description from");
      // console.log(description);
      // console.log("to");
      // console.log(newDescription);
      setIsUpdating(true);
      const response = await onUpdateDescription(newDescription);
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
          : "Error occured while updating project name.";

      showToast({
        type: "error",
        message: errorMessage,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="relative">
      <pre
        className="px-2 py-1 cursor-text font-[inter] whitespace-pre-wrap border border-transparent rounded hover:bg-slate-100 hover:border-slate-200"
        onClick={() => {
          setIsEditing(true);
          setTimeout(() => textareaRef.current?.focus());
        }}
      >
        {isEditing ? newDescription : description}
        {newDescription.endsWith("\n") && <br />}
      </pre>
      <textarea
        ref={textareaRef}
        className={`absolute top-0 bottom-0 left-0 right-0 block w-full resize-none ${
          isEditing ? "opacity-100 visible" : "opacity-0 invisible"
        } shadow-lg`}
        value={newDescription}
        onChange={(e) => setNewDescription(e.target.value)}
        onBlur={() => setTimeout(() => setIsEditing(false))}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            setIsEditing(false);
          } else if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
            handleNameChange();
          }
        }}
      />
      {isEditing && (
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
