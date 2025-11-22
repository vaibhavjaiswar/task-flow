"use client";

import { fetchUserProjects } from "@/apis";
import { Project } from "@/prisma/generated/client";
import { useEffect, useState } from "react";

export default function ProjectList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchProjectList = async () => {
    const response = await fetchUserProjects();
    const { ok, message } = response;

    if (!ok) {
      console.error(
        "Error occured while fetching user's projects",
        response.error
      );
      setError(message);
      return;
    }

    setProjects(response.data?.projects || []);
  };

  useEffect(() => {
    fetchProjectList();
  }, []);

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
      {projects.map(({ id, name }) => {
        // const { done, inprogress, todo, total } = tasks;
        return (
          <div
            key={id}
            className="p-6 bg-white border border-slate-100 rounded-md shadow-md hover:shadow-lg transition-shadow"
          >
            <h2
              className="mb-2 text-2xl font-semibold text-slate-800 line-clamp-1"
              title={name}
            >
              {name}
            </h2>
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
          </div>
        );
      })}
    </div>
  );
}

// const mockProjects = [
//   {
//     id: 1,
//     name: "Website Redesign",
//     owner: "Jane Doe",
//     tasks: {
//       done: 10,
//       inprogress: 12,
//       todo: 8,
//       total: 30,
//     },
//   },
//   {
//     id: 2,
//     name: "Mobile Application Development",
//     owner: "John Smith",
//     tasks: {
//       done: 5,
//       inprogress: 3,
//       todo: 2,
//       total: 10,
//     },
//   },
//   {
//     id: 3,
//     name: "E-commerce Setup",
//     owner: "Alice Johnson",
//     tasks: {
//       done: 2,
//       inprogress: 1,
//       todo: 2,
//       total: 5,
//     },
//   },
// ];
