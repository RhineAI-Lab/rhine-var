import RhineVarBase from "@/core/var/rhine-var-base.class";
import {NativeType} from "@/core/native/native-type.enum";

export default class RhineVarArray<T> extends RhineVarBase<T> {

  type: NativeType.Array = NativeType.Array

}
