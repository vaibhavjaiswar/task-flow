"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useToast } from "@/context/toast-context";
import { addMembersInProject } from "@/apis";
import { ProjectWithDetails } from "@/types/api-response";
import { MemberType } from "@/types";
import { emailRegex } from "@/utils";
import { X } from "@deemlol/next-icons";
import Dialog from "@/components/dialog";
import LoadingButton from "@/components/loading-button";

interface Props {
  open: boolean;
  project: ProjectWithDetails;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ProjectMemberDialog({ open, project, setOpen }: Props) {
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [members, setMembers] = useState<MemberType[]>(
    project.members.map((member) => ({
      email: member.user.email,
      role: member.role,
    }))
  );
  const [newMemberEmailsInput, setNewMemberEmailsInput] = useState<string>("");
  const [newMembers, setNewMembers] = useState<MemberType[]>([]);
  // const [removedMembers, setRemovedMembers] = useState<MemberType[]>([]);

  const { showToast } = useToast();
  const router = useRouter();

  const handleAddMember = async () => {
    try {
      setIsAddingMember(true);
      const response = await addMembersInProject(project.id, newMembers);
      const { ok, message } = response;

      if (!ok) {
        throw new Error(message);
      }

      showToast({
        type: "success",
        message: "Member(s) added to the project.",
      });
      // setOpen(false);
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
    setNewMembers([]);
    if (newMemberEmailsInput) {
      const emailArray = newMemberEmailsInput.split(",");
      const uniqueEmails = [
        ...new Set(emailArray.map((email) => email.trim().toLowerCase())),
      ];
      uniqueEmails.forEach((email) => {
        const isEmailValid = emailRegex.test(email);
        const isAlreadyMember = members
          .map((member) => member.email)
          .includes(email);
        if (isEmailValid && !isAlreadyMember) {
          setNewMembers((newMembers) => [
            ...newMembers,
            { email, role: "MEMBER" },
          ]);
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
          Manage who can access and collaborate on this project.
        </p>
      </div>
      <div className="mb-2 p-4 py-3 border border-slate-400 rounded-2xl">
        <h2 className="mb-2 text-sm">Current members</h2>
        <p className="text-sm flex gap-2 flex-wrap">
          {project.members.length > 0 ? (
            project.members.map((member) => (
              <span
                key={member.user.email}
                className="flex items-center gap-1 w-max px-3 py-1 text-slate-600 hover:text-slate-700 bg-slate-100 border border-slate-200 hover:border-slate-300 rounded-full"
              >
                {member.user.email}
                {member.role !== "ADMIN" ? (
                  <span className="mt-0.5 w-3 h-3 flex justify-center items-center aspect-square">
                    <X
                      size={12}
                      className="inline-block text-slate-400 hover:text-slate-600"
                    />
                  </span>
                ) : null}
              </span>
            ))
          ) : (
            <span>No members added!</span>
          )}
        </p>
      </div>
      <div>
        <h2 className="mb-2 text-sm">Add new members</h2>
        <input
          type="text"
          value={newMemberEmailsInput}
          onChange={(e) => setNewMemberEmailsInput(e.target.value)}
          placeholder="Enter one or more email, separated by commas."
          className="w-full mb-4"
        />
        {newMembers.length > 0 ? (
          <div className="mb-4 text-sm">
            <h3 className="mb-2 text-xs font-light">
              These members will be added
            </h3>
            {newMembers.map((newMember) => (
              <span
                key={newMember.email}
                className="inline-block px-3 py-1 text-blue-600 hover:text-blue-700 bg-blue-100 border border-blue-200 hover:border-blue-300 rounded-full"
              >
                {newMember.email}
              </span>
            ))}
          </div>
        ) : null}
        <div className="max-w-full flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4">
          <LoadingButton
            type="submit"
            isLoading={isAddingMember}
            disabled={newMembers.length < 1}
            onClick={handleAddMember}
            className="flex-1 primary-button w-full sm:w-auto"
          >
            Add members
          </LoadingButton>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="flex-1 secondary-button w-full sm:w-auto"
          >
            Cancel
          </button>
        </div>
      </div>
    </Dialog>
  );
}
