"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { fetchUserProject, updateUserProject } from "@/apis";
import { useToast } from "@/context/toast-context";
import { AlertCircle, Loader } from "@deemlol/next-icons";
import ProjectHeading from "./project-heading";
import ProjectDescription from "./project-description";
import { ProjectWithDetails } from "@/types/api-response";
import { timeAgo } from "@/utils";
import AddNewTaskDialog from "./add-new-task";

interface Props {
  projectId: string;
}

export default function ProjectPanel({ projectId }: Props) {
  const [project, setProject] = useState<ProjectWithDetails | null>(null);
  const [isFetchingProject, setIsFetchingProject] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddNewTaskDialog, setShowAddNewTaskDialog] = useState(false);

  const { showToast } = useToast();

  const fetchUserProjectCall = useCallback(
    async (options?: { shouldUpdateInBackground?: boolean }) => {
      const showLoader = !options?.shouldUpdateInBackground;
      try {
        showLoader && setIsFetchingProject(true);
        const response = await fetchUserProject(projectId);
        const { ok, message } = response;

        if (!ok) {
          console.error(
            "Error occured while fetching user's projects",
            response.error
          );
          setError(message);
          showLoader && setIsFetchingProject(false);
          return;
        }

        setProject(response.data?.project ?? null);
      } catch (error) {
        console.error(error);

        const errorMessage =
          error instanceof Error
            ? error.message
            : "Error occured while registering.";

        showToast({
          type: "error",
          message: errorMessage,
        });
      } finally {
        setIsFetchingProject(false);
      }
    },
    [projectId, showToast]
  );

  const updateProjectHeading = async (projectName: string) => {
    const response = await updateUserProject(projectId, { projectName });
    if (response.ok) {
      const project = response.data?.project;
      if (project) setProject(project);
    }
    return response;
  };

  const updateProjectDescription = async (projectDescription: string) => {
    const response = await updateUserProject(projectId, { projectDescription });
    if (response.ok) {
      const project = response.data?.project;
      if (project) setProject(project);
    }
    return response;
  };

  useEffect(() => {
    fetchUserProjectCall();
  }, [fetchUserProjectCall]);

  if (isFetchingProject) {
    return (
      <div className="min-h-[calc(100dvh-52px-28px)] max-w-[1440px] mx-auto side-px py-6 flex justify-center items-center gap-2">
        <Loader size={18} className="text-slate-800 animate-spin" />
        Loading project...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100dvh-52px-28px)] max-w-[1440px] mx-auto side-px py-6 flex justify-center items-center gap-2">
        <AlertCircle size={40} className="text-slate-800" />
        <h2 className="text-lg font-semibold text-slate-800">
          Error retrieving your project
        </h2>
        <p className="text-slate-800">
          {error || "An unknown error occurred while fetching your project."}
        </p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-[calc(100dvh-52px-28px)] max-w-[1440px] mx-auto side-px py-6 flex flex-col justify-center items-center gap-4 text-center">
        <AlertCircle size={40} className="text-slate-800" />
        <p className="text-lg font-semibold text-slate-800">
          Project not available.
        </p>
        <Link href="/daskboard">Go back to Projects</Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto side-px py-6 space-y-4">
      <ProjectHeading
        projectName={project?.name}
        onUpdateHeading={updateProjectHeading}
      />
      <ProjectDescription
        description={project?.description}
        onUpdateDescription={updateProjectDescription}
      />
      <div className="mx-2 p-3 max-w-sm bg-slate-100 flex items-center gap-4 border border-slate-200 rounded-md">
        {project.owner.name && (
          <div className="h-10 aspect-square text-lg text-slate-100 bg-slate-800 rounded-full flex justify-center items-center">
            {project.owner.name.charAt(0)}
          </div>
        )}
        <div>
          <p>{project.owner.name}</p>
          <p className="text-sm text-slate-400">Project Owner</p>
        </div>
      </div>
      <div className="mx-2 p-4 bg-slate-100 border border-slate-200 rounded-md">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-slate-800">
            Tasks{" "}
            <span className="text-sm text-slate-400 font-normal">
              ({project.tasks.length})
            </span>
          </h2>
          <button
            className="primary-button text-sm"
            onClick={() => setShowAddNewTaskDialog(true)}
          >
            Add Task
          </button>
        </div>
        {project.tasks.length === 0 ? (
          <div className="h-52 text-slate-400 flex justify-center items-center">
            <p className="text-sm">No tasks in this project yet.</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {project.tasks.map((task) => (
              <li
                key={task.id}
                className="p-3 bg-white hover:bg-slate-50 flex items-center justify-between border border-slate-200 rounded-md transition"
              >
                <p className="text-slate-700 text-sm">{task.name}</p>
                <span className="text-xs px-2 py-1 rounded-md bg-yellow-100 text-yellow-700">
                  {task.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="px-2 text-sm text-slate-400 space-y-1">
        <p>
          <span className="font-medium">Last updated</span>{" "}
          {timeAgo(project.updatedAt)}
        </p>
        <p>
          <span className="font-medium">Created on:</span>{" "}
          {new Date(project.createdAt).toLocaleDateString()}
        </p>
      </div>
      <AddNewTaskDialog
        projectId={project.id}
        open={showAddNewTaskDialog}
        setOpen={setShowAddNewTaskDialog}
        onSuccess={() =>
          fetchUserProjectCall({ shouldUpdateInBackground: true })
        }
      />
    </div>
  );
}
