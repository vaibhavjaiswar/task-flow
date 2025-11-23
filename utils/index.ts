import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

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
