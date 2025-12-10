"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useToast } from "@/context/toast-context";
// import { addMemberToProject } from "@/apis";
import { ProjectWithDetails } from "@/types/api-response";
import { emailRegex } from "@/utils";
import Dialog from "@/components/dialog";
import LoadingButton from "@/components/loading-button";

interface Props {
  open: boolean;
  project: ProjectWithDetails;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ProjectMemberDialog({ open, project, setOpen }: Props) {
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [newMemberEmailsInput, setNewMemberEmailsInput] = useState<string>("");
  const [newMemberEmails, setNewMemberEmails] = useState<string[]>([]);

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
        type: "success",
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

  useEffect(() => {
    setNewMemberEmails([]);
    if (newMemberEmailsInput) {
      const emailArray = newMemberEmailsInput.split(",");
      console.log(emailArray);
      emailArray.forEach((email) => {
        const isEmailValid = emailRegex.test(email);
        console.log(
          `Email "${email}" is ${isEmailValid ? "VALID" : "INVALID"}`
        );
        if (isEmailValid) {
          setNewMemberEmails((emails) => [...emails, email]);
        }
      });
    }
  }, [newMemberEmailsInput]);

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
                className="inline-block px-3 py-1 text-slate-600 hover:text-slate-700 bg-slate-100 border border-slate-200 hover:border-slate-300 rounded-full"
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
        <h2 className="mb-2 text-sm">Add new members:</h2>
        <input
          type="text"
          value={newMemberEmailsInput}
          onChange={(e) => setNewMemberEmailsInput(e.target.value)}
          placeholder="Enter new member emails with comma..."
          className="w-full mb-4"
        />
        {newMemberEmails.length > 0 ? (
          <div className="mb-4 text-sm">
            <h3 className="mb-2 text-sm">These members will be added:</h3>
            {newMemberEmails.map((newMemberEmail) => (
              <span className="inline-block px-3 py-1 text-green-600 hover:text-green-700 bg-green-100 border border-green-200 hover:border-green-300 rounded-full">
                {newMemberEmail}
              </span>
            ))}
          </div>
        ) : null}
        <div className="max-w-full flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4">
          <LoadingButton
            type="submit"
            isLoading={isAddingMember}
            disabled={newMemberEmails.length < 1}
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
