import styled from "@emotion/styled";
import { useState } from "react";
import Button from "./Button";
import ElementGroup from "./ElementGroup";
import Input from "./Input";

const PROXY_HOST = "localhost:3334";

const OmniboxContainer = styled.div`
  padding: 6px;
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
      <OmniboxContainer>
        <ElementGroup>
          <Input css={{ flex: 1 }} value={url} compact />
          <Button onClick={() => setKey((k) => k++)} compact>
            Refresh
          </Button>
        </ElementGroup>
      </OmniboxContainer>

      <iframe key={key} src={url} />
    </div>
  );
}

export default styled(SandboxPreview)`
  display: flex;
  flex-direction: column;

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
  }
`;
