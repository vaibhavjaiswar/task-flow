export async function sleep(milliseconds: number = 1000) {
  await new Promise((resolve) => setTimeout(resolve, milliseconds));
}
