import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { GlobalStateSelector, useGlobalState } from "../globalState";

export default function useStateSelector<V>(selector: GlobalStateSelector<V>) {
  const state = useGlobalState();
  const [value, setValue] = useState(selector(state.state));

  const selectorRef = useRef(selector);
  useLayoutEffect(() => {
    selectorRef.current = selector;
  });

  useEffect(() => {
    function onUpdate(s) {
      setValue(selectorRef.current(s));
    }

    state.subscribe(onUpdate);

    return () => {
      state.unsubscribe(onUpdate);
    };
  }, [state]);

  return value;
}
