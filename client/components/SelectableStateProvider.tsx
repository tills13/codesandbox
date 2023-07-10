import React, { PropsWithChildren } from "react";

type OnNewStateCallback<T> = (newState: T) => void;
export type Selector<S, V> = (newState: S) => V;

function mergeObjects(src: Record<string, any>, dest: Record<string, any>) {
  for (const [k, v] of Object.entries(src)) {
    if (Array.isArray(v)) {
      if (!Array.isArray(dest[k])) {
        dest[k] = [];
      }

      for (let i = 0; i < v.length; i++) {
        dest[k][i] = v[i];
      }
    } else if (typeof v === "object") {
      if (typeof dest[k] !== "object") {
        dest[k] = {};
      }

      dest[k] = mergeObjects(v, dest[k]);
    } else {
      dest[k] = v;
    }
  }

  return dest;
}

export class Provider<T extends Record<string, any>> {
  state: T;
  subscribers: Array<OnNewStateCallback<T>> = [];

  constructor(initialState: T) {
    this.state = initialState;
  }

  notify() {
    this.subscribers.forEach((s) => s(this.state));
  }

  set(merge: Partial<T> | ((currentState: T) => T)) {
    if (typeof merge === "function") {
      this.state = merge(this.state);
    } else {
      this.state = mergeObjects(merge, this.state) as T;
    }

    this.notify();
  }

  subscribe(cb: OnNewStateCallback<T>) {
    this.subscribers.push(cb);
  }

  unsubscribe(cb: OnNewStateCallback<T>) {
    this.subscribers.splice(this.subscribers.indexOf(cb), 1);
  }
}

export const SelectableStateCtx = React.createContext<Provider<any>>(
  new Provider({})
);

type Props<T extends Record<string, any>> = {
  provider: Provider<T>;
};

export default function SelectableStateProvider<T extends Record<string, any>>({
  children,
  provider,
}: PropsWithChildren<Props<T>>) {
  return (
    <SelectableStateCtx.Provider value={provider}>
      {children}
    </SelectableStateCtx.Provider>
  );
}
