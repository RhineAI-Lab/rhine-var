import RhineVarBase from "@/core/var/rhine-var-base.class";
import {NativeType} from "@/core/native/native-type.enum";
import {InputItem, OutputItem} from "@/core/var/rhine-var.type";

export default class RhineVarMap<T = any> extends RhineVarBase<{[key: string]: T}> implements Iterable<[string, OutputItem<T>]> {

  type: NativeType.Map = NativeType.Map;

  [Symbol.iterator](): IterableIterator<[string, OutputItem<T>]> {
    return {} as IterableIterator<[string, OutputItem<T>]>
  }

  size: number = 0

  set(key: string, value: InputItem<T>): void {
  }

  get(key: string): T | undefined {
    return {} as T | undefined
  }

  has(key: string): boolean {
    return false
  }

  forEach(callback: (value: OutputItem<T>, key: string, map: RhineVarMap<T>) => void, thisArg?: any): void {
  }

  delete(key: string): boolean {
    return false
  }

  clear(): void {
  }

  keys(): IterableIterator<string> {
    return {} as IterableIterator<string>
  }

  values(): IterableIterator<OutputItem<T>> {
    return {} as IterableIterator<OutputItem<T>>
  }

  entries(): IterableIterator<[string, OutputItem<T>]> {
    return {} as IterableIterator<[string, OutputItem<T>]>
  }


  // Enable this if we need to use dynamic keys later
  // @ts-ignore
  // [key: string]: T | undefined;

}
