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
  padding: 6px;
  gap: 6px;
  height: calc(100vh);

  ${SandboxPreview} {
    flex: 1 1 auto;
    height: 100%;
    border-radius: var(--border-radius);
  }

  ${SandboxLogs} {
    height: 200px;
    flex: 0 0 200px;
    overflow-x: hidden;
    overflow-y: auto;
    border-radius: var(--border-radius);
  }
`;
