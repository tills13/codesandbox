import Router from "next/router";
import { useCallback } from "react";
import NewSandboxForm from "../components/NewSandboxForm";
import { SandboxDocument } from "../types";

export default function Index() {
  const onCreateSandbox = useCallback((sandbox: SandboxDocument) => {
    Router.push({
      pathname: "/sandbox/[sandboxId]",
      query: { sandboxId: sandbox.sandboxId },
    });
  }, []);

  return (
    <div>
      <NewSandboxForm onSuccess={onCreateSandbox} />
    </div>
  );
}
