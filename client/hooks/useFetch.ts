import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

class GlobalState {
  state = new Map<string, any>();
  inFlight: Record<string, Promise<any> | undefined> = {};
  subscribers: Record<string, Array<(newValue: any) => void>> = {};

  async executeWithFetcher<T>(key: string, fetcher: () => T | Promise<T>) {
    if (!!this.inFlight[key]) {
      console.log(key, "is awaited");
      return this.inFlight[key];
    }

    let r = fetcher();

    if (r instanceof Promise) {
      this.inFlight[key] = r;
      r = await r;

      delete this.inFlight[key];
    }

    this.state.set(key, r);
    this.notify(key, r);
    return r;
  }

  mutate(key: string, newValue: any) {
    this.state.set(key, newValue);
    this.notify(key, newValue);
  }

  notify(key: string, newValue: any) {
    this.subscribers[key].forEach((s) => s(newValue));
  }

  get<T>(key: string): T | undefined {
    if (this.inFlight[key]) {
      console.log(key, "is awaited");
    }
    console.log(key, this.state.get(key));
    return this.state.get(key);
  }

  unsubscribe(key: string, listener: any) {
    this.subscribers[key] = (this.subscribers[key] || []).filter(
      (s) => s !== listener
    );
  }

  subscribe<T>(key: string, listener: (newValue: T) => void) {
    this.subscribers[key] = [...(this.subscribers[key] || []), listener];
  }
}

const state = new GlobalState();

type Key = string | Array<string | undefined> | undefined;

function serialize(k: Key): string | undefined {
  if (k === undefined) {
    return undefined;
  }

  if (typeof k === "string") {
    return k;
  }

  return k
    .map((part) => (typeof part === "string" ? part : "<no_value>"))
    .join("/");
}

type Fetcher<Key, T> = Key extends string
  ? Fetcher<[Key], T>
  : Key extends Array<any>
  ? (...args: Key) => Promise<T> | T
  : never;

type UseFetchOptions = {
  refreshInterval?: number;
};

export default function useFetch<K extends string[], T>(
  rawKey: K | undefined,
  fetcher: Fetcher<K, T>,
  opts: UseFetchOptions = {}
) {
  const key = serialize(rawKey);
  const [value, setValue] = useState(key ? state.get<T>(key) : undefined);

  const fetcherRef = useRef(() => () => fetcher(...rawKey!));
  useLayoutEffect(() => {
    fetcherRef.current = () => fetcher(...rawKey!) as Fetcher<K, T>;
  });

  const initializeRef = useRef(true);
  const isFirstRun = !initializeRef.current;

  useEffect(() => {
    if (key === undefined) {
      return;
    }

    state.executeWithFetcher(key, fetcherRef.current).then(setValue);
    state.subscribe(key, setValue);

    let i: any;
    if (opts.refreshInterval) {
      i = setInterval(() => {
        state.executeWithFetcher(key, fetcherRef.current).then(setValue);
      }, opts.refreshInterval * 1000);
    }

    return () => {
      state.unsubscribe(key, setValue);
      clearInterval(i);
    };
  }, [key, opts.refreshInterval]);

  // const mutate = useCallback(
  //   (newValue: T) => {
  //     if (!key) {
  //       throw new Error();
  //     }

  //     state.mutate(key, newValue);
  //   },
  //   [key]
  // );

  return { value };
}
