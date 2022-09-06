import { useCallback } from "react";
import Button from "./Button";

type Props = {
  sandboxId: string;
};

export default function StartSandboxButton({ sandboxId }: Props) {
  const onClick = useCallback(
    () => fetch("http://localhost:3333/api/sandbox/" + sandboxId + "/start"),
    [sandboxId]
  );

  return <Button onClick={onClick}>Start</Button>;
}
