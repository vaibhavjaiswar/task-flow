export async function sleep(milliseconds: number = 1000) {
  await new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export function generateRandomString() {
  return Math.random().toString(36).substring(2);
}
