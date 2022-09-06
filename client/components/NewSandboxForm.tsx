import styled from "@emotion/styled";
import { useCallback } from "react";
import { SandboxDocument } from "../types";
import Button from "./Button";

const ProjectTypeContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
`;

type Props = {
  onSuccess: (sandboxProject: SandboxDocument) => void;
};

export default function NewSandboxForm({ onSuccess }: Props) {
  const onClickNewSandbox = useCallback(
    async (type: string) => {
      const r = await fetch("http://localhost:3333/api/sandbox/_/create", {
        body: JSON.stringify({ type }),
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const response = (await r.json()) as Result<SandboxDocument>;

      if (response.success) {
        onSuccess(response.result);
      }
    },
    [onSuccess]
  );

  return (
    <div>
      <h1 css={{ marginBottom: "12px" }}>New Project</h1>
      <ProjectTypeContainer>
        <Button onClick={() => onClickNewSandbox("nextjs_javascript")}>
          NextJS + JavaScript
        </Button>
        <Button onClick={() => onClickNewSandbox("React")}>React</Button>
        <Button onClick={() => onClickNewSandbox("React_TypeScript")}>
          React + TypeScript
        </Button>
        <Button onClick={() => onClickNewSandbox("React_JavaScript")}>
          React + JavaScript
        </Button>
        <Button onClick={() => onClickNewSandbox("Golang")}>Golang</Button>
      </ProjectTypeContainer>
    </div>
  );
}
