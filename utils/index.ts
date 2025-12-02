import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { TaskPriority, TaskStatus } from "@/prisma/generated/enums";

dayjs.extend(relativeTime);

export async function sleep(milliseconds: number = 1000) {
  await new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export function generateRandomString() {
  return Math.random().toString(36).substring(2);
}

export function timeAgo(date: string | Date) {
  return dayjs(date).fromNow();
}

export function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

export const TaskStatusLabel: Record<TaskStatus, string> = {
  TODO: "To-Do",
  IN_PROGRESS: "In Progress",
  DONE: "Done",
  BLOCKED: "Blocked",
  NEED_INFO: "Need Info",
  CANCELLED: "Cancelled",
};

export const TaskPrirotyLabel: Record<TaskPriority, string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
};
