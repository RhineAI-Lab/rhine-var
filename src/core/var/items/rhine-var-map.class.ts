import RhineVarBase from "@/core/var/rhine-var-base.class";
import {NativeType} from "@/core/native/native-type.enum";

export default class RhineVarMap<T = any> extends RhineVarBase<{[K in keyof T]: T[K]}> implements Iterable<[keyof T, T[keyof T]]> {

  type: NativeType.Map = NativeType.Map;

  [Symbol.iterator](): Iterator<[keyof T, T[keyof T]]> {
    return {} as Iterator<[keyof T, T[keyof T]]>;
  }

  set(key: string, value: T): void {
  }

  get(key: string): T | undefined {
    return {} as T | undefined;
  }

  has(key: string): boolean {
    return false;
  }

  forEach(callback: (value: T, key: string, map: RhineVarMap<T>) => void, thisArg?: any): void {
  }

  delete(key: string): boolean {
    return false
  }

  clear(): void {
  }

  // Enable this if we need to use dynamic keys later
  // @ts-ignore
  // [key: string]: T | undefined;

}
