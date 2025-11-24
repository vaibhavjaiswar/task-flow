"use client";

import { useEffect, useRef, useState } from "react";
import { fetchUserProject } from "@/apis";
import { Project } from "@/prisma/generated/client";
import { useToast } from "@/context/toast-context";
import { AlertCircle, Loader } from "@deemlol/next-icons";
import ProjectHeading from "./project-heading";
import ProjectDescription from "./project-description";
import Link from "next/link";

interface Props {
  projectId: string;
}

export default function ProjectPanel({ projectId }: Props) {
  const [project, setProject] = useState<Project | null>(null);
  const [isFetchingProject, setIsFetchingProject] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { showToast } = useToast();

  const fetchUserProjectCall = async () => {
    try {
      setIsFetchingProject(true);
      const response = await fetchUserProject(projectId);
      const { ok, message } = response;

      if (!ok) {
        console.error(
          "Error occured while fetching user's projects",
          response.error
        );
        setError(message);
        setIsFetchingProject(false);
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
  };

  useEffect(() => {
    fetchUserProjectCall();
  }, []);

  if (isFetchingProject) {
    return (
      <div className="min-h-[calc(100dvh-52px-28px)] max-w-7xl mx-auto side-px py-6 flex justify-center items-center gap-2">
        <Loader size={18} className="text-slate-800 animate-spin" />
        Loading project...
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-[calc(100dvh-52px-28px)] max-w-7xl mx-auto side-px py-6 flex flex-col justify-center items-center gap-4 text-center">
        <AlertCircle size={40} className="text-slate-800" />
        <p className="text-lg font-semibold text-slate-800">
          Project not available.
        </p>
        <Link href="/daskboard">Go back to Projects</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto side-px py-6 space-y-4">
      <ProjectHeading projectName={project?.name} />
      <ProjectDescription description={project?.description} />
    </div>
  );
}
