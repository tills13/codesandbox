import styled from "@emotion/styled";
import useStateSelector from "../hooks/useStateSelector";

type Props = {
  className?: string;
};

function PlaygroundInfo({ className }: Props) {
  const numPlayers = useStateSelector((s) => s.players.length);
  return <div className={className}>{numPlayers} players</div>;
}

export default styled(PlaygroundInfo)`
  padding: var(--padding-std);
  background-color: var(--primary);
`;
