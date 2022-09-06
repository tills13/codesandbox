import styled from "@emotion/styled";

type Props = {
  iconPosition?: "left" | "right";
  compact?: boolean;
  block?: boolean;
  variant?: "primary" | "secondary" | "success" | "error";
};

function color({ variant }: Props) {
  if (variant === "success" || variant === "secondary" || variant === "error") {
    return "var(--text-dark-bg)";
  }
  return `var(--text-primary)`;
}

export default styled.button<Props>`
  position: relative;
  display: ${({ block }) => (block ? "block" : "inline-block")};
  text-align: ${({ iconPosition }) => {
    if (!iconPosition) {
      return "center";
    }

    return iconPosition === "left" ? "left" : "right";
  }};
  padding: 0 ${({ compact }) => (compact ? 12 : 24)}px;
  height: ${({ compact }) => (compact ? 30 : 40)}px;
  color: ${color};
  font-family: var(--fonts-text);
  font-size: 0.8rem;
  background-color: ${({ variant = "primary" }) => {
    if (variant === "primary") {
      return `var(--global-bg)`;
    } else if (variant === "secondary") {
      return `var(--${variant})`;
    }

    return `var(--states-${variant})`;
  }};

  line-height: ${({ compact }) => (compact ? 30 : 40) - 2}px;
  border-width: 1px;
  border-style: solid;
  border-color: ${({ variant = "primary" }) => {
    if (variant === "primary" || variant === "secondary") {
      return `var(--${variant})`;
    }

    return `var(--states-${variant}-secondary)`;
  }};
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: background-color 0.1s ease;
  text-transform: uppercase;
  outline: none;
  overflow: hidden;
  text-overflow: ellipsis;
  box-sizing: border-box;

  &:hover:not(:disabled) {
    /* box-shadow: inset 0 0 20px 5px rgba(122, 122, 122, 0.5); */
    background-color: ${({ variant = "primary" }) => {
      if (variant === "primary" || variant === "secondary") {
        return `var(--${variant})`;
      }

      return `var(--states-${variant}-secondary)`;
    }};

    color: ${(props) => {
      if (props.variant === "success") {
        return `var(--text-primary)`;
      }

      return color(props);
    }};
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;
