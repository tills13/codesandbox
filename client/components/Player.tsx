import styled from "@emotion/styled";
import useStateSelector from "../hooks/useStateSelector";

type Props = {
  className?: string;
  idx: number;
};

function Player({ className, idx }: Props) {
  const { x, y, color } = useStateSelector((s) => s.players[idx]);
  return (
    <div
      className={className}
      css={{ transform: `translate(${x}px, ${y}px)`, backgroundColor: color }}
    />
  );
}

export default styled(Player)`
  position: absolute;
  width: 30px;
  height: 30px;
  transition: transform 0.2s ease;
  border-top-right-radius: var(--border-radius);
  border-bottom-left-radius: var(--border-radius);
  border-bottom-right-radius: var(--border-radius);
`;
