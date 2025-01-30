import SupportArray from "@/core/var/support/array/support-array.class";
import RhineVarArray from "@/core/var/items/rhine-var-array.class";
import RhineVarMap from "@/core/var/items/rhine-var-map.class";
import RhineVarText from "@/core/var/items/rhine-var-text.class";
import {RhineVarAny} from "@/core/var/rhine-var.type";
import RhineVarObject from "@/core/var/items/rhine-var-object.class";
import SupportMap from "@/core/var/support/array/support-map.class";
import SupportText from "@/core/var/support/array/support-text.class";

export default class SupportManager {

  static convertProperty<T>(key: string | symbol, object: RhineVarAny) {
    // console.log('SupportManager.convertProperty', key, object)
    if (object instanceof RhineVarArray) {
      return SupportArray.convertProperty<T>(key, object)
    } else if (object instanceof RhineVarMap) {
      return SupportMap.convertProperty<T>(key, object)
    } else if (object instanceof RhineVarObject) {
      // Directly use the Support tool of RhineVarMap to process Object data.
      // Although the internal types of the tool do not match exactly, it doesn’t matter because the type computation at runtime comes from the definition of RhineVarObject.
      return SupportMap.convertProperty<T>(key, object)
    } else if (object instanceof RhineVarText) {
      return SupportText.convertProperty(key, object)
    }

    return null
  }

}
