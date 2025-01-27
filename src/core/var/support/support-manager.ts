import SupportArray from "@/core/var/support/array/support-array.class";
import RhineVarArray from "@/core/var/items/rhine-var-array.class";
import RhineVarMap from "@/core/var/items/rhine-var-map.class";
import RhineVarText from "@/core/var/items/rhine-var-text.class";
import {RhineVarAny} from "@/core/var/rhine-var.type";
import RhineVarObject from "@/core/var/items/rhine-var-object.class";
import SupportMap from "@/core/var/support/array/support-map.class";

export default class SupportManager {

  static convertProperty<T>(key: string | symbol, object: RhineVarAny) {
    if (object instanceof RhineVarArray) {
      return SupportArray.convertProperty<T>(key, object)
    } else if (object instanceof RhineVarMap) {
      return SupportMap.convertProperty<T>(key, object)
    } else if (object instanceof RhineVarObject) {

    } else if (object instanceof RhineVarText) {

    }

    return null
  }

}
