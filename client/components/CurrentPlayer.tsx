import { useEffect } from "react";
import { globalState } from "../globalState";

function debounce<T extends (...args: any[]) => any>(cb: T, delay: number): T {
  let t;
  let lastTrigger = Date.now();

  return (...args: any[]) => {
    if (t) {
      clearTimeout(t);
    }

    if (Date.now() - lastTrigger > delay) {
      cb(...args);
    }

    t = setTimeout(() => cb(...args), delay);
  };
}

export default function CurrentPlayer() {
  useEffect(() => {
    const onMouseMove = debounce((e: MouseEvent) => {
      globalState.set((s) => {
        const pIdx = s.players.findIndex((p) => p.color === "#0F0");

        if (pIdx === -1) {
          return s;
        }

        return {
          ...s,
          players: [
            ...s.players.slice(0, pIdx),
            { ...s.players[pIdx], x: e.clientX, y: e.clientY },
            ...s.players.slice(pIdx + 1),
          ],
        };
      });
    }, 50);

    document.addEventListener("mousemove", onMouseMove);
    globalState.set((s) => ({
      players: [...s.players, { x: 0, y: 0, color: "#0F0" }],
    }));

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return null;
}
