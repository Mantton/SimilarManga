export const sleep = async (duration: number) =>
  await new Promise((r) => setTimeout(r, duration));
