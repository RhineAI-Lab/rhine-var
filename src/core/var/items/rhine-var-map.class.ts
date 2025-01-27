import RhineVarBase from "@/core/var/rhine-var-base.class";
import {NativeType} from "@/core/native/native-type.enum";

export default class RhineVarMap<T = any> extends RhineVarBase<{[key: string]: T}> implements Iterable<[string, T]> {

  type: NativeType.Map = NativeType.Map;

  [Symbol.iterator](): IterableIterator<[string, T]> {
    return {} as IterableIterator<[string, T]>
  }

  size: number = 0

  set(key: string, value: T): void {
  }

  get(key: string): T | undefined {
    return {} as T | undefined
  }

  has(key: string): boolean {
    return false
  }

  forEach(callback: (value: T, key: string, map: RhineVarMap<T>) => void, thisArg?: any): void {
  }

  delete(key: string): boolean {
    return false
  }

  clear(): void {
  }

  keys(): IterableIterator<string> {
    return {} as IterableIterator<string>
  }

  values(): IterableIterator<T> {
    return {} as IterableIterator<T>
  }

  entries(): IterableIterator<[string, T]> {
    return {} as IterableIterator<[string, T]>
  }


  // Enable this if we need to use dynamic keys later
  // @ts-ignore
  // [key: string]: T | undefined;

}
