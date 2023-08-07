import { getStore } from "./mod.ts";

export type Get<T> = (connId: string) => T | undefined;
export type Init<T> = (connId: string) => T;

export function getFn<const T extends Shape>(shape: T) {
  type Model = { [key in keyof T]: Field<T, key> } & { connId: string };
  return function get(connId: string): Model | undefined {
    const store = getStore(connId);
    if (!store) return;
    const result = { connId } as Model;
    for (const key in shape) {
      if (!(key in store)) store[key] = shape[key](connId);
      result[key] = store[key];
    }
    return result;
  };
}

interface Shape {
  [key: string]: Init<any>;
}
type Field<T extends Shape, U extends keyof T> = T[U] extends Init<infer V> ? V
  : never;
