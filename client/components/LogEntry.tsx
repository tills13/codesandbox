import styled from "@emotion/styled";

const Timestamp = styled.span`
  float: right;
  color: var(--text-secondary);
  clear: none;
`;

type Props = {
  className?: string;
  message: string;
  stream: string;
  timestamp: string;
};

function LogEntry({ className, message, stream, timestamp }: Props) {
  return (
    <div className={className}>
      <span css={stream === "stderr" && { color: "var(--states-error)" }}>
        {message || "-"}
      </span>
      <Timestamp>{timestamp}</Timestamp>
    </div>
  );
}

export default styled(LogEntry)`
  font-family: monospace;

  span:first-of-type {
    width: 100%;
  }
`;
