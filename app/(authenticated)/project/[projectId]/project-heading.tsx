import { useRef, useState } from "react";
import { Project } from "@/prisma/generated/client";
import { useToast } from "@/context/toast-context";
import { ProjectResponseType, ServerResponseType } from "@/types/api-response";
import { MoreVertical, Trash } from "@deemlol/next-icons";
import { Popup, PopupContent, PopupTrigger } from "@/components/popup";
import LoadingButton from "@/components/loading-button";
import DeleteProjectDialog from "./delete-project-dialog";

interface Props {
  project: Project;
  onUpdateHeading: (
    projectName: string
  ) => Promise<ServerResponseType<ProjectResponseType>>;
}

export default function ProjectHeading({ project, onUpdateHeading }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(project.name);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showOption, setShowOption] = useState(false);
  const [showDeleteTaskDialog, setShowDeleteProjectDialog] = useState(false);

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
          : "Error occured while updating project name.";

      showToast({
        type: "error",
        message: errorMessage,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const isNameSame = project.name === newName.trim();

  return (
    <div className="relative flex items-center gap-2">
      <div className="grow">
        <h1
          className="px-2 py-1 text-2xl sm:text-3xl font-semibold cursor-text border border-transparent rounded hover:bg-slate-100 hover:border-slate-200 line-clamp-1"
          onClick={() => {
            setIsEditing(true);
            setTimeout(() => inputRef.current?.focus());
          }}
        >
          {project.name}
        </h1>
      </div>
      <input
        ref={inputRef}
        type="text"
        className={`absolute top-0 bottom-0 left-0 right-0 block w-full text-2xl sm:text-3xl font-semibold ${
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
      <Popup open={showOption} setOpen={setShowOption}>
        <PopupTrigger>
          <div className="w-[42px] h-[42px] sm:w-[48px] sm:h-[48px] flex justify-center items-center hover:bg-slate-200 rounded cursor-pointer">
            <MoreVertical size={22} className="text-slate-800" />
          </div>
        </PopupTrigger>
        <PopupContent
          offset={8}
          stickTo="right"
          className="min-w-52 border border-slate-300 rounded-md shadow-lg overflow-hidden"
        >
          <div
            className="px-4 py-2 text-red-700 bg-slate-100 hover:bg-red-100 flex items-center gap-2 cursor-pointer"
            onClick={() => {
              setShowDeleteProjectDialog(true);
              setShowOption(false);
            }}
          >
            <Trash size={18} />
            Delete project
          </div>
        </PopupContent>
      </Popup>
      <DeleteProjectDialog
        open={showDeleteTaskDialog}
        project={project}
        setOpen={setShowDeleteProjectDialog}
      />
    </div>
  );
}
