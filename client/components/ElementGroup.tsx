import styled from "@emotion/styled";
import React from "react";

interface BaseProps {
  className?: string;
  children: React.ReactNode;
  equalWidthChildren?: boolean;
  gap?: number;
  tabIndex?: number;
  vertical?: boolean;
  wrap?: boolean;
}

interface AlignProps extends BaseProps {
  /** alignment on the x-axis, irrespective of `vertical` */
  xAlign?: "start" | "end";
  /** alignment on the y-axis, irrespective of `vertical` */
  yAlign?: "start" | "end";
}

interface SpacingProps extends BaseProps {
  spaceBetween: boolean;
}

type Props = AlignProps | SpacingProps;

function ElementGroup({ className, children, tabIndex }: Props) {
  return (
    <div className={className} tabIndex={tabIndex}>
      {children}
    </div>
  );
}

function justifyContent(p: Props) {
  const xAlign = (p as AlignProps).xAlign || "start";
  const yAlign = (p as AlignProps).yAlign || "start";

  if (p.vertical) {
    return `flex-${yAlign}`;
  }

  if ((p as SpacingProps).spaceBetween) {
    return "space-between";
  }

  return `flex-${xAlign}`;
}

function alignItems(p: Props) {
  const yAlign = (p as AlignProps).yAlign;
  const xAlign = (p as AlignProps).xAlign || "start";

  if (p.vertical) {
    return `flex-${xAlign}`;
  }

  return yAlign ? `flex-${yAlign}` : "center";
}

function flexDirection(p: Props) {
  return p.vertical ? "column" : "row";
}

export default styled(ElementGroup)`
  display: flex;
  flex-direction: ${flexDirection};
  justify-content: ${justifyContent};
  align-items: ${alignItems};
  gap: ${({ gap = 12 }) => gap}px;

  ${({ wrap }) => wrap && "flex-wrap: wrap;"}

  ${({ equalWidthChildren, children }) =>
    equalWidthChildren &&
    `
        > * {
            flex-grow: 1;
            flex-basis: calc(100% / ${React.Children.count(children)} - 12px);
        }
    `}

    > * {
    ${({ vertical, xAlign }: AlignProps) =>
      vertical && !xAlign && "width: 100%;"}
  }
`;
