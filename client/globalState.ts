import { useContext } from "react";
import {
  Provider,
  Selector,
  SelectableStateCtx,
} from "./components/SelectableStateProvider";

export type GlobalState = {
  players: Array<{ color: string; x: number; y: number }>;
};
export type GlobalStateSelector<V> = Selector<GlobalState, V>;

export function useGlobalState(): Provider<GlobalState> {
  return useContext(SelectableStateCtx);
}

export const globalState = new Provider<GlobalState>({
  players: [{ x: 100, y: 100, color: "#fff" }],
});
