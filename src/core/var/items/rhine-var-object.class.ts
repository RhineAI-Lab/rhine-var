import RhineVarBase from "@/core/var/rhine-var-base.class";
import {NativeType} from "@/core/native/native-type.enum";

export default class RhineVarObject<T extends object = any> extends RhineVarBase<T> implements Iterable<[keyof T, T[keyof T]]> {

  type: NativeType.Object = NativeType.Object;

  [Symbol.iterator](): Iterator<[keyof T, T[keyof T]]> {
    return {} as Iterator<[keyof T, T[keyof T]]>
  }

  set(key: keyof T, value: T[keyof T]): void {
  }

  get(key: keyof T): T[keyof T] | undefined {
    return {} as T[keyof T] | undefined
  }

  has(key: keyof T): boolean {
    return false
  }

  forEach(callback: (value: T[keyof T], key: keyof T, map: RhineVarObject<T>) => void, thisArg?: any): void {
  }

  delete(key: keyof T): boolean {
    return false
  }

  clear(): void {
  }

}
