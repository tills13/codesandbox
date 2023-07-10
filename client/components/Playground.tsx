import styled from "@emotion/styled";
import { PropsWithChildren } from "react";
import useStateSelector from "../hooks/useStateSelector";
import CurrentPlayer from "./CurrentPlayer";
import Players from "./Players";
import PlaygroundInfo from "./PlaygroundInfo";

type Props = {
  className?: string;
};

function Playground({ children, className }: PropsWithChildren<Props>) {
  return (
    <div className={className}>
      <PlaygroundInfo />
      <Players />
      <CurrentPlayer />
      {children}
    </div>
  );
}

export default styled(Playground)`
  position: relative;

  ${PlaygroundInfo} {
    position: absolute;
    top: 0;
    right: 0;
  }
`;
