import RhineVarMap from "@/core/var/items/rhine-var-map.class";
import RhineVarArray from "@/core/var/items/rhine-var-array.class";
import RhineVarText from "@/core/var/items/rhine-var-text.class";
import RhineVarXmlFragment from "@/core/var/items/rhine-var-xml-fragment.class";
import RhineVarXmlElement from "@/core/var/items/rhine-var-xml-element.class";
import RhineVarXmlText from "@/core/var/items/rhine-var-xml-text.class";
import RhineVarBase from "@/core/var/rhine-var-base.class";
import {StoredRhineVar} from "@/core/proxy/proxied-rhine-var.type";
import {rhineProxyGeneral} from "@/core/proxy/proxy";
import {isNative, jsonToNative} from "@/core/native/native.utils";
import {isObjectOrArray} from "@/core/utils/data.utils";
import {Native} from "@/core/native/native.type";


export function isRhineVar(value: any) {
  return value instanceof RhineVarMap
    || value instanceof RhineVarArray
    || value instanceof RhineVarText
    || value instanceof RhineVarXmlFragment
    || value instanceof RhineVarXmlElement
    || value instanceof RhineVarXmlText
}

export function ensureRhineVar<T>(value: T | Native, parent: RhineVarBase<any>): StoredRhineVar<T> | any {
  if (isNative(value)) {
    return rhineProxyGeneral(value as Native, parent)
  }
  if (isObjectOrArray(value)) {
    if (!isRhineVar(value)) {
      return rhineProxyGeneral(ensureNative(value), parent)
    }
  }
  return value
}

export function ensureNative<T>(value: T | RhineVarBase<T> | Native): Native | any {
  if (isNative(value)) {
    return value
  }
  if (isRhineVar(value)) {
    return (value as RhineVarBase).native
  }
  if (isObjectOrArray(value)) {
    return jsonToNative(value)
  }
  return value
}
