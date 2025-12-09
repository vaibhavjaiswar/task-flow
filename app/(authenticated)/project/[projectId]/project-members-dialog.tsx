"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/context/toast-context";
// import { addMemberToProject } from "@/apis";
import { ProjectWithDetails } from "@/types/api-response";
import Dialog from "@/components/dialog";
import LoadingButton from "@/components/loading-button";

interface Props {
  open: boolean;
  project: ProjectWithDetails;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ProjectMemberDialog({ open, project, setOpen }: Props) {
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [emails, setEmails] = useState<string>("");

  const { showToast } = useToast();
  const router = useRouter();

  const handleAddMember = async () => {
    try {
      setIsAddingMember(true);
      // const response = await addMemberToProject(project.id);
      // const { ok, message } = response;

      // if (!ok) {
      //   throw new Error(message);
      // }

      showToast({
        type: "info",
        message: "Member(s) added to the project.",
      });
      setOpen(false);
    } catch (error) {
      console.error(error);

      const errorMessage =
        error instanceof Error
          ? error.message
          : "Error occured while adding member to project.";

      showToast({
        type: "error",
        message: errorMessage,
      });
    } finally {
      setIsAddingMember(false);
    }
  };

  return (
    <Dialog
      open={open}
      onBackdropClick={() => setOpen(false)}
      className="sm:w-lg bg-white"
    >
      <div className="mb-2">
        <h1 className="text-2xl font-semibold">Project members</h1>
        <p className="mt-1 text-xs font-light">
          Add users to join and access this project.
        </p>
      </div>
      <div className="mb-2">
        <h2 className="mb-1 text-sm">Current members:</h2>
        <p className="text-sm">
          {project.members.length > 0 ? (
            project.members.map((member) => (
              <span
                key={member.user.email}
                className="inline-block px-3 py-1 text-slate-600 hover:text-slate-800 bg-slate-100 border border-slate-200 hover:border-slate-400 rounded-full"
              >
                {member.user.email}
              </span>
            ))
          ) : (
            <span>No members added!</span>
          )}
        </p>
      </div>
      <div>
        <h2 className="mb-2 text-sm">User emails:</h2>
        <input
          type="text"
          value={emails}
          onChange={(e) => setEmails(e.target.value)}
          placeholder="Enter member emails..."
          className="w-full mb-4"
        />
        <div className="max-w-full flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4">
          <LoadingButton
            type="submit"
            isLoading={isAddingMember}
            onClick={handleAddMember}
            className="flex-1 primary-button w-full sm:w-auto"
          >
            Add member
          </LoadingButton>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="flex-1 secondary-button w-full sm:w-auto"
          >
            Close
          </button>
        </div>
      </div>
    </Dialog>
  );
}
