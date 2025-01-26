import SupportArray from "@/core/var/support/array/support-array.class";
import RhineVarArray from "@/core/var/items/rhine-var-array.class";
import RhineVarMap from "@/core/var/items/rhine-var-map.class";
import RhineVarText from "@/core/var/items/rhine-var-text.class";
import {RhineVarAny} from "@/core/var/rhine-var.type";
import RhineVarObject from "@/core/var/items/rhine-var-object.class";

export default class SupportManager {

  static convertProperty<T>(key: string | symbol, object: RhineVarAny) {

    if (object instanceof RhineVarArray) {
      if (SupportArray.hasProperty(key)) {
        return SupportArray.convertProperty<T>(key, object)
      }
    } else if (object instanceof RhineVarMap) {

    } else if (object instanceof RhineVarObject) {

    } else if (object instanceof RhineVarText) {

    }

    return null
  }

  static hasSupportedProperty<T>(object: RhineVarAny) {

  }

}
