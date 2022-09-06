import styled from "@emotion/styled";
import { useEffect, useReducer, useRef } from "react";
import useSwr from "swr";
import LogEntry from "./LogEntry";

export type LogEntry = {
  stream: string;
  timestamp: string;
  message: string;
};

async function fetchLogs(sandboxId: string) {
  const res = await fetch(
    "http://localhost:3333/api/sandbox/" + sandboxId + "/console"
  );

  const json = (await res.json()) as Result<{ entries: LogEntry[] }>;

  if (json.success === true) {
    return json.result.entries;
  } else {
    return [];
  }
}

function useLogs(sandboxId: string) {
  return useSwr(["sandbox", sandboxId, "logs"], (_, pId) => fetchLogs(pId), {
    refreshInterval: 10,
  });
}

type Props = {
  className?: string;
  sandboxId: string;
};

function SandboxLogs({ className, sandboxId }: Props) {
  const ref = useRef<HTMLDivElement>(null!);
  const { data: logs = [] } = useLogs(sandboxId);

  useEffect(() => {
    ref.current.scrollTo({ top: ref.current.scrollHeight });
  }, [logs]);

  return (
    <div className={className} ref={ref}>
      {logs.map((l, i) => (
        <LogEntry key={i} {...l} />
      ))}
    </div>
  );
}

export default styled(SandboxLogs)`
  padding: 6px;
  /* border-radius: 2px; */
  background-color: var(--primary);
`;
