import styled from "@emotion/styled";
import { Refresh } from "@emotion-icons/material-rounded/Refresh";
import { useState } from "react";
import Button from "./Button";
import ElementGroup from "./ElementGroup";
import Input from "./Input";

const PROXY_HOST = "localhost:3334";

const OmniboxContainer = styled.div``;
const RefreshIcon = styled(Refresh)`
  height: var(--height-std);
  padding: 6px;
  cursor: pointer;
  color: var(--text-primary);

  &:hover {
    color: var(--text-secondary);
  }
`;

type Props = {
  className?: string;
  sandboxId: string;
};

function SandboxPreview({ className, sandboxId }: Props) {
  const [url, setUrl] = useState("http://" + PROXY_HOST + "/p/" + sandboxId);
  const [key, setKey] = useState(0);

  return (
    <div className={className}>
      <OmniboxContainer css={{ marginBottom: "6px" }}>
        <ElementGroup gap={6}>
          <Input css={{ flex: 1 }} value={url} />
          <RefreshIcon onClick={() => setKey((k) => k + 1)}>
            Refresh
          </RefreshIcon>
        </ElementGroup>
      </OmniboxContainer>

      <iframe key={key} src={url} />
    </div>
  );
}

export default styled(SandboxPreview)`
  display: flex;
  flex-direction: column;
  /* padding: 6px; */

  ${OmniboxContainer} {
    flex: 0;

    ${Input} {
      flex: 1;
      font-family: monospace;
    }
  }

  iframe {
    flex: 1;
    border: none;
    background-color: white;
    border-radius: var(--border-radius);
  }
`;
