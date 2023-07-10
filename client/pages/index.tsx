import styled from "@emotion/styled";
import Router from "next/router";
import { useCallback } from "react";
import NewSandboxForm from "../components/NewSandboxForm";
import Playground from "../components/Playground";
import { SandboxDocument } from "../types";

const Wrapper = styled.div`
  height: 100%;
`;

export default function Index() {
  const onCreateSandbox = useCallback((sandbox: SandboxDocument) => {
    Router.push({
      pathname: "/sandbox/[sandboxId]",
      query: { sandboxId: sandbox.sandboxId },
    });
  }, []);

  return (
    <Playground>
      <div>.</div>
      {/* <NewSandboxForm onSuccess={onCreateSandbox} /> */}
    </Playground>
  );
}
