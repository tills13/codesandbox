import styled from "@emotion/styled";
import useSandbox from "../hooks/useSandbox";

type Props = {
  className?: string;
  sandboxId: string;
};

function SandboxStatusBadge({ className, sandboxId }: Props) {
  const { value: sandbox } = useSandbox(sandboxId);
  console.log("SandboxStatusBadge", sandbox);

  return (
    <div className={className}>
      <pre>{JSON.stringify(sandbox, undefined, 2)}</pre>
    </div>
  );
}

export default styled(SandboxStatusBadge)`
  text-transform: uppercase;
  padding: var(--padding);
`;
