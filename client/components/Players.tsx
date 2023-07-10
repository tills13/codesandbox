import useStateSelector from "../hooks/useStateSelector";
import Player from "./Player";

export default function Players() {
  const s = useStateSelector((s) => s.players.length);

  return (
    <>
      {Array.of(...new Array(s)).map((_, i) => (
        <Player key={i} idx={i} />
      ))}
    </>
  );
}
