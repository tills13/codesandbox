import styled from "@emotion/styled";
import SandboxLogs from "./SandboxLogs";
import SandboxPreview from "./SandboxPreview";

type Props = {
  className?: string;
  sandboxId: string;
};

function SandboxPreviewGroup({ className, sandboxId }: Props) {
  return (
    <div className={className}>
      <SandboxPreview sandboxId={sandboxId} />
      <SandboxLogs sandboxId={sandboxId} />
    </div>
  );
}

export default styled(SandboxPreviewGroup)`
  display: flex;
  flex-direction: column;

  ${SandboxPreview} {
    height: calc(100vh - 200px);
    flex: 1 1 auto;
  }

  > div:last-child {
    height: 200px;
    flex: 0 0 200px;
    overflow: scroll;
  }
`;
