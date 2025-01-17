import RhineVarBase from "@/core/var/rhine-var-base.class";
import {NativeType} from "@/core/native/native-type.enum";

export default class RhineVarMap<T> extends RhineVarBase<T> {

  type: NativeType.Map = NativeType.Map

}
