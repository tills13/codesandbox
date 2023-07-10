import type { SandboxDocument } from "../types";
import useFetch from "./useFetch";

async function fetchSandbox(sandboxId: string) {
  const res = await fetch("http://localhost:3333/api/sandbox/" + sandboxId);
  const json = (await res.json()) as Result<SandboxDocument>;

  if (json.success !== true) {
    throw new Error(json.error);
  }

  return json.result;
}

export default function useSandbox(sandboxId: string | undefined) {
  return useFetch(
    sandboxId ? [sandboxId] : undefined,
    (arg0) => fetchSandbox(arg0),
    {
      refreshInterval: 2,
    }
  );
}
