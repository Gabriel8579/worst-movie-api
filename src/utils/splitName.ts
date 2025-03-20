export const splitNames = (input: string): string[] => {
  return input
    .replace(/ and /g, ', ')
    .split(', ')
    .map((name) => name.trim());
};
