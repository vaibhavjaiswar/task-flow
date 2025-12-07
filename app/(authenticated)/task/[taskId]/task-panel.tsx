"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import dayjs from "dayjs";
import { Task, TaskPriority, TaskStatus } from "@/prisma/generated/client";
import { fetchUserTask, updateUserTask } from "@/apis";
import { useToast } from "@/context/toast-context";
import { AlertCircle, Loader } from "@deemlol/next-icons";
import { TaskPrirotyLabel, TaskStatusLabel, timeAgo } from "@/utils";
import Select from "@/components/select";
import TaskHeading from "./task-heading";
import TaskDescription from "./task-description";

interface Props {
  taskId: string;
}

export default function TaskPanel({ taskId }: Props) {
  const [task, setTask] = useState<Task | null>(null);
  const [isFetchingTask, setIsFetchingTask] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [priority, setPriority] = useState<TaskPriority>();
  const [status, setStatus] = useState<TaskStatus>();

  const { showToast } = useToast();

  const fetchUserTaskCall = useCallback(
    async (options?: { shouldUpdateInBackground?: boolean }) => {
      const showLoader = !options?.shouldUpdateInBackground;
      try {
        if (showLoader) setIsFetchingTask(true);
        const response = await fetchUserTask(taskId);
        const { ok, message } = response;

        if (!ok) {
          console.error(
            "Error occured while fetching user's task",
            response.error
          );
          setError(message);
          if (showLoader) setIsFetchingTask(false);
          return;
        }

        setTask(response.data?.task ?? null);
        setPriority(response.data?.task.priority);
        setStatus(response.data?.task.status);
      } catch (error) {
        console.error(error);

        const errorMessage =
          error instanceof Error
            ? error.message
            : "Error occured while fetching task.";

        showToast({
          type: "error",
          message: errorMessage,
        });
      } finally {
        setIsFetchingTask(false);
      }
    },
    [taskId, showToast]
  );

  const updateTaskHeading = async (taskName: string) => {
    const response = await updateUserTask(taskId, { taskName });
    if (response.ok) {
      const task = response.data?.task;
      if (task) setTask(task);
    }
    return response;
  };

  const updateTaskDescription = async (taskDescription: string) => {
    const response = await updateUserTask(taskId, { taskDescription });
    if (response.ok) {
      const task = response.data?.task;
      if (task) setTask(task);
    }
    return response;
  };

  const handlePriorityChange = async (taskPriority: TaskPriority) => {
    try {
      setPriority(taskPriority);
      const response = await updateUserTask(taskId, { taskPriority });
      if (response.ok) {
        const task = response.data?.task;
        if (task) setTask(task);
      }
      if (!response.ok) {
        setPriority(task?.priority);
        showToast({
          type: "error",
          message: response.message,
        });
        return;
      }
    } catch (error) {
      console.error(error);

      const errorMessage =
        error instanceof Error
          ? error.message
          : "Error occured while updating task priority.";

      showToast({
        type: "error",
        message: errorMessage,
      });
    }
  };

  const handleStatusChange = async (taskStatus: TaskStatus) => {
    try {
      setStatus(taskStatus);
      const response = await updateUserTask(taskId, { taskStatus });
      if (response.ok) {
        const task = response.data?.task;
        if (task) setTask(task);
      }
      if (!response.ok) {
        setStatus(task?.status);
        showToast({
          type: "error",
          message: response.message,
        });
        return;
      }
    } catch (error) {
      console.error(error);

      const errorMessage =
        error instanceof Error
          ? error.message
          : "Error occured while updating task status.";

      showToast({
        type: "error",
        message: errorMessage,
      });
    }
  };

  useEffect(() => {
    fetchUserTaskCall();
  }, [fetchUserTaskCall]);

  const taskPriorityEntries = Object.entries(TaskPrirotyLabel) as [
    TaskPriority,
    string
  ][];
  const taskStatusEntries = Object.entries(TaskStatusLabel) as [
    TaskStatus,
    string
  ][];

  if (isFetchingTask) {
    return (
      <div className="min-h-[calc(100dvh-52px-28px)] max-w-[1440px] mx-auto side-px py-6 flex justify-center items-center gap-2">
        <Loader size={18} className="text-slate-800 animate-spin" />
        Loading task...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100dvh-52px-28px)] max-w-[1440px] mx-auto side-px py-6 flex flex-col justify-center items-center gap-2">
        <AlertCircle size={40} className="text-slate-800" />
        <h2 className="text-lg font-semibold text-slate-800">
          Error retrieving your task
        </h2>
        <p className="text-slate-800">
          {error || "An unknown error occurred while fetching your task."}
        </p>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-[calc(100dvh-52px-28px)] max-w-[1440px] mx-auto side-px py-6 flex flex-col justify-center items-center gap-4 text-center">
        <AlertCircle size={40} className="text-slate-800" />
        <p className="text-lg font-semibold text-slate-800">
          Task not available.
        </p>
        <Link href="/daskboard">Go back to Projects</Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto side-px py-6 space-y-4">
      <TaskHeading task={task} onUpdateHeading={updateTaskHeading} />
      <TaskDescription
        description={task?.description}
        onUpdateDescription={updateTaskDescription}
      />
      <div className="--mx-2 mb-10 p-6 bg-white border border-slate-200 rounded shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Task Details</h2>
        <div className="space-y-3">
          <div className="min-h-[37.6px] flex items-center">
            <div className="inline-block w-52 font-semibold">Status:</div>
            <div className="inline-block grow">
              <Select
                value={status ?? task.status}
                onChange={handleStatusChange}
                options={taskStatusEntries}
                placeholder="Select status..."
              />
            </div>
          </div>
          <div className="min-h-[37.6px] flex items-center">
            <div className="inline-block w-52 font-semibold">Priority:</div>
            <div className="inline-block grow">
              <Select
                value={priority ?? task.priority}
                onChange={handlePriorityChange}
                options={taskPriorityEntries}
                placeholder="Select priority..."
              />
            </div>
          </div>
          <div className="min-h-[37.6px] flex items-center">
            <div className="inline-block w-52 font-semibold">Created by:</div>
            <div className="inline-block grow">{task.creatorId}</div>
          </div>
          <div className="min-h-[37.6px] flex items-center">
            <div className="inline-block w-52 font-semibold">Due Date:</div>
            <div className="inline-block grow">
              {task.dueDate ? (
                dayjs(task.dueDate)?.format("DD MMM YYYY")
              ) : (
                <span className="text-slate-400">NA</span>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="px-2 text-sm text-slate-400 space-y-1">
        <p>
          <span className="font-medium">Last updated</span>{" "}
          {timeAgo(task.updatedAt)}
        </p>
        <p>
          <span className="font-medium">Created on:</span>{" "}
          {dayjs(task.createdAt).format("DD MMM YYYY")}
        </p>
      </div>
    </div>
  );
}
