import RhineVarBase from "@/core/var/rhine-var-base.class";
import {NativeType} from "@/core/native/native-type.enum";

export default class RhineVarArray<T extends object = any> extends RhineVarBase<T> implements Iterable<T> {

  type: NativeType.Array = NativeType.Array;

  [Symbol.iterator](): Iterator<T> {
    return {} as Iterator<T>
  }

}
