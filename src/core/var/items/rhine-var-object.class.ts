import RhineVarBase from "@/core/var/rhine-var-base.class";
import {NativeType} from "@/core/native/native-type.enum";

export default class RhineVarObject<T extends object = any> extends RhineVarBase<T> {

  type: NativeType.Object = NativeType.Object

}
