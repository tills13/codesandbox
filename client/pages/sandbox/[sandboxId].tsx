import styled from "@emotion/styled";
import { useRouter } from "next/router";
import useSwr from "swr";
import ElementGroup from "../../components/ElementGroup";
import SandboxPreviewGroup from "../../components/SandboxPreviewGroup";
import SandboxPreview from "../../components/SandboxPreviewGroup";
import SectionHeader from "../../components/SectionHeader";
import StartSandboxButton from "../../components/StartSandboxButton";
import StopSandboxButton from "../../components/StopSandboxButton";
import { SandboxDocument } from "../../types";
import { extractQuery } from "../../utils";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  height: 100%;

  iframe {
    border: none;
  }

  > * {
    width: 50%;
  }
`;

async function fetchSandbox(sandboxId: string) {
  const res = await fetch("http://localhost:3333/api/sandbox/" + sandboxId);
  const json = (await res.json()) as Result<SandboxDocument>;

  if (json.success !== true) {
    throw new Error(json.error);
  }

  return json.result;
}

function useSandbox(sandboxId: string | undefined) {
  return useSwr(
    () => (sandboxId ? ["sandbox", sandboxId] : null),
    (_, pId) => fetchSandbox(pId),
    { refreshInterval: 10 }
  );
}

export default function SandboxPage() {
  const router = useRouter();
  const sandboxId = extractQuery(router.query.sandboxId);
  const { data: sandbox } = useSandbox(sandboxId);

  return (
    <Container>
      <iframe src="http://127.0.0.1:8080" />
      {sandboxId && <SandboxPreviewGroup sandboxId={sandboxId} />}
    </Container>
  );
}
