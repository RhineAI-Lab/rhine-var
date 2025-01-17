import {isNative, jsonToNative} from "@/core/native/native.utils";
import {rhineProxyGeneral} from "@/core/proxy/proxy";
import {Native} from "@/core/native/native.type";
import {StoredRhineVar} from "@/core/proxy/proxied-rhine-var.type";
import {RhineVar} from "@/core/var/rhine-var.type";
import RhineVarMap from "@/core/var/itmes/rhine-var-map.class";
import RhineVarArray from "@/core/var/itmes/rhine-var-array.class";
import RhineVarText from "@/core/var/itmes/rhine-var-text.class";
import RhineVarXmlFragment from "@/core/var/itmes/rhine-var-xml-fragment.class";
import RhineVarXmlElement from "@/core/var/itmes/rhine-var-xml-element.class";
import RhineVarXmlText from "@/core/var/itmes/rhine-var-xml-text.class";

export function isObject(value: any) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

export function isArray(value: any) {
  return Array.isArray(value);
}

export function isObjectOrArray(value: any) {
  return value !== null && typeof value === 'object'
}

export function isRhineVar(value: any) {
  return value instanceof RhineVarMap
    || value instanceof RhineVarArray
    || value instanceof RhineVarText
    || value instanceof RhineVarXmlFragment
    || value instanceof RhineVarXmlElement
    || value instanceof RhineVarXmlText
}

export function ensureRhineVar<T>(value: T | Native, parent: RhineVar<any>): StoredRhineVar<T> | any {
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

export function ensureNative<T>(value: T | RhineVar<T> | Native): Native | any {
  if (isNative(value)) {
    return value
  }
  if (isRhineVar(value)) {
    return (value as RhineVar).native
  }
  if (isObjectOrArray(value)) {
    return jsonToNative(value)
  }
  return value
}
