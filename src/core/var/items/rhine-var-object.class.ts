import RhineVarBase from "@/core/var/rhine-var-base.class";
import {NativeType} from "@/core/native/native-type.enum";
import {InputItem, OutputItem, StoredRhineVar} from "@/core/var/rhine-var.type";

export default class RhineVarObject<T extends object = any> extends RhineVarBase<T> implements Iterable<[keyof T, OutputItem<T[keyof T]>]> {

  type: NativeType.Object = NativeType.Object;

  size: number = -1

  set(key: keyof T, value: InputItem<T[keyof T]>): void {
  }

  // WARNING: Cannot calculate the corresponding value type based on the key on its own.
  get(key: keyof T): OutputItem<T[keyof T]> | undefined {
    return undefined
  }

  has(key: keyof T): boolean {
    return false
  }

  forEach(callback: (value: OutputItem<T[keyof T]>, key: keyof T, map: RhineVarObject<T>) => void, thisArg?: any): void {
  }

  delete(key: keyof T): boolean {
    return false
  }

  clear(): void {
  }

  keys(): IterableIterator<keyof T> {
    return {} as IterableIterator<keyof T>
  }

  values(): IterableIterator<OutputItem<T[keyof T]>> {
    return {} as IterableIterator<OutputItem<T[keyof T]>>
  }

  entries(): IterableIterator<[keyof T, OutputItem<T[keyof T]>]> {
    return {} as IterableIterator<[keyof T, OutputItem<T[keyof T]>]>
  }

  [Symbol.iterator](): Iterator<[keyof T, OutputItem<T[keyof T]>]> {
    return {} as Iterator<[keyof T, OutputItem<T[keyof T]>]>
  }

}
