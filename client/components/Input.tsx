import styled from "@emotion/styled";

type Props = {
  compact?: boolean;
};

export default styled.input<Props>`
  display: block;
  height: var(--height-${({ compact }) => (compact ? "compact" : "std")});
  padding: ${({ compact }) => `0 ${compact ? 12 : 16}px`};
  color: var(--text-primary);
  background: none;
  background-color: var(--global-bg);
  border-radius: var(--border-radius);
  border: 1.5px solid var(--primary);
  box-shadow: none;
  outline: none;

  &:focus {
    border-color: var(--secondary);
  }

  &:disabled {
    opacity: 0.7; /* 0.7 is "native" in chrome */
    cursor: not-allowed;
  }
`;
