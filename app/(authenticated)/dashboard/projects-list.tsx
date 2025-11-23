"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchUserProjects } from "@/apis";
import { Project } from "@/prisma/generated/client";
import { timeAgo } from "@/utils";

export default function ProjectList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjectList = async () => {
    setIsLoading(true);
    const response = await fetchUserProjects();
    const { ok, message } = response;

    if (!ok) {
      console.error(
        "Error occured while fetching user's projects",
        response.error
      );
      setError(message);
      setIsLoading(false);
      return;
    }

    setProjects(response.data?.projects || []);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchProjectList();
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="p-6 bg-white border border-slate-100 rounded-md shadow-md animate-pulse"
          >
            <div className="h-8 bg-slate-200 rounded w-3/4 mb-3" />
            <div className="h-6 bg-slate-200 rounded w-1/2 mb-5" />
            <div className="mb-3 space-y-2">
              <div className="h-4 bg-slate-200 rounded w-full" />
              <div className="h-4 bg-slate-200 rounded w-2/3" />
              <div className="h-4 bg-slate-200 rounded w-5/6" />
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-slate-200 rounded w-2/6" />
              <div className="h-4 bg-slate-200 rounded w-2/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[60dvh] text-center flex flex-col items-center justify-center px-4">
        <h2 className="text-2xl font-semibold mb-2">
          Unable to fetch your projects
        </h2>
        <p className="max-w-md">
          {error || "Some error occurred while fetching your projects..."}
        </p>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="h-[60dvh] text-center flex flex-col items-center justify-center">
        <h2 className="text-2xl font-semibold mb-2">
          You have no projects yet
        </h2>
        <p className="text-gray-500 mb-6">
          Create your first project to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {projects.map(({ id, name, description, updatedAt }) => {
        // const { done, inprogress, todo, total } = tasks;
        return (
          <Link
            key={id}
            href={`/project/${id}`}
            className="relative p-6 pb-10 bg-white border border-slate-100 rounded-md shadow-md hover:shadow-lg transition-shadow no-underline!"
          >
            <h2
              className="mb-2 text-2xl font-semibold text-slate-800 line-clamp-1"
              title={name}
            >
              {name}
            </h2>

            {description && (
              <p
                className="mb-4 text-sm text-slate-600 line-clamp-2"
                title={description}
              >
                {description}
              </p>
            )}

            <p className="mb-3 text-sm text-slate-600">
              <strong>Owner:</strong> {"owner"}
            </p>

            <div className="space-y-1">
              <p className="text-sm text-slate-600">
                <strong>Total:</strong> {"total"} task(s)
              </p>
              <p className="text-sm text-slate-600">
                <strong>Done:</strong> {"done"}
              </p>
              <p className="text-sm text-slate-600">
                <strong>In Progress:</strong> {"inprogress"}
              </p>
              <p className="text-sm text-slate-600">
                <strong>To Do:</strong> {"todo"}
              </p>
            </div>

            <div className="absolute bottom-0 left-0 right-0 px-6 py-2 text-xs text-slate-400 font-light border-t border-slate-200">
              <p>
                Last updated{" "}
                <span className="text-slate-500">{timeAgo(updatedAt)}</span>
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
