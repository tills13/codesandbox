import styled from "@emotion/styled";
import { useRouter } from "next/router";
import { useState } from "react";
import Button from "../../components/Button";
import SandboxPreviewGroup from "../../components/SandboxPreviewGroup";
import SandboxStatusBadge from "../../components/SandboxStatusBadge";
import useSandbox from "../../hooks/useSandbox";

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

export default function SandboxPage() {
  const router = useRouter();
  const sandboxId = extractQuery(router.query.sandboxId);
  const { value: sandbox } = useSandbox(sandboxId);

  return (
    <Container>
      <div>{sandboxId && <SandboxStatusBadge sandboxId={sandboxId} />}</div>
      {sandboxId && <SandboxPreviewGroup sandboxId={sandboxId} />}
    </Container>
  );
}
