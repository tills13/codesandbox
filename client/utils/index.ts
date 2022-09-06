const ALPHABET = "abcdefghijklmnopqrstuvwxyz0987654321".split("");

export function extractQuery(query: string | string[] | undefined) {
  if (query === undefined) {
    return undefined;
  }

  return typeof query === "string" ? query : query[0];
}

export function newSandboxId() {
  return [...ALPHABET]
    .sort((a, b) => (Math.random() > 0.5 ? -1 : 1))
    .map((i) => (Math.random() > 0.5 ? i.toUpperCase() : i))
    .slice(0, 10)
    .join("");
}
