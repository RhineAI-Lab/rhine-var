import {StoredRhineVarItem} from "@/core/proxy/ProxiedRhineVar";
import {isNative, jsonToNative} from "@/core/native/NativeUtils";
import RhineVarItem from "@/core/proxy/RhineVarItem";
import {rhineProxy, rhineProxyNative} from "@/core/proxy/Proxy";
import {Native} from "@/core/native/Native";

export function isObject(value: any) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

export function isArray(value: any) {
  return Array.isArray(value);
}

export function isObjectOrArray(value: any) {
  return value !== null && typeof value === 'object'
}

export function ensureRhineVar<T>(value: T | Native, parent: RhineVarItem<any>): StoredRhineVarItem<T> | any {
  if (isNative(value)) {
    return rhineProxyNative(value as Native)
  }
  if (isObjectOrArray(value)) {
    if (!(value instanceof RhineVarItem)) {
      return rhineProxy(value as object)
    }
  }
  return value
}

export function ensureNative<T>(value: T | RhineVarItem<T>): Native | any {
  if (value instanceof RhineVarItem) {
    return value.native
  }
  if (isObjectOrArray(value)) {
    return jsonToNative(value)
  }
  return value
}
