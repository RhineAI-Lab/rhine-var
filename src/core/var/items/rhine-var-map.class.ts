import RhineVarBase from "@/core/var/rhine-var-base.class";
import {NativeType} from "@/core/native/native-type.enum";
import {InputItem} from "@/core/var/rhine-var.type";

export default class RhineVarMap<T = any, N = any> extends RhineVarBase<{[key: string]: T}> implements Iterable<[string, T]> {

  type: NativeType.Map = NativeType.Map;

  size: number = 0

  set(key: string, value: InputItem<N>): void {
  }

  get(key: string): T | undefined {
    return {} as T | undefined
  }

  has(key: string): boolean {
    return false
  }

  forEach(callback: (value: T, key: string, map: this) => void, thisArg?: any): void {
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

  [Symbol.iterator](): IterableIterator<[string, T]> {
    return {} as IterableIterator<[string, T]>
  }

  // Enable this if we need to use dynamic keys later
  // @ts-ignore
  // [key: string]: T | undefined;

}
