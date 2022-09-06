import { useCallback } from "react";
import Button from "./Button";

type Props = {
  sandboxId: string;
};

export default function StopSandboxButton({ sandboxId }: Props) {
  const onClick = useCallback(
    () =>
      fetch("http://localhost:3333/api/sandbox/" + sandboxId + "/stop", {
        method: "POST",
      }),
    [sandboxId]
  );

  return <Button onClick={onClick}>Stop</Button>;
}
