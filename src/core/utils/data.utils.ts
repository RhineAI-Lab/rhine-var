import {StoredRhineVarItem} from "@/core/proxy/proxied-rhine-var.type";
import {isNative, jsonToNative} from "@/core/native/native.utils";
import RhineVarBaseItem from "@/core/var/rhine-var-base-item.class";
import {rhineProxyItem} from "@/core/proxy/proxy";
import {Native} from "@/core/native/native.type";

export function isObject(value: any) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

export function isArray(value: any) {
  return Array.isArray(value);
}

export function isObjectOrArray(value: any) {
  return value !== null && typeof value === 'object'
}

export function ensureRhineVar<T>(value: T | Native, parent: RhineVarBaseItem<any>): StoredRhineVarItem<T> | any {
  if (isNative(value)) {
    return rhineProxyItem(value as Native, parent)
  }
  if (isObjectOrArray(value)) {
    if (!(value instanceof RhineVarBaseItem)) {
      return rhineProxyItem(ensureNative(value), parent)
    }
  }
  return value
}

export function ensureNative<T>(value: T | RhineVarBaseItem<T> | Native): Native | any {
  if (isNative(value)) {
    return value
  }
  if (value instanceof RhineVarBaseItem) {
    return value.native
  }
  if (isObjectOrArray(value)) {
    return jsonToNative(value)
  }
  return value
}
