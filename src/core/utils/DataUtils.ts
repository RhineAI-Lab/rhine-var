import {ProxiedRhineVar} from "@/core/proxy/ProxiedRhineVar";
import {isYMapOrYArray} from "@/core/native/NativeUtils";
import RhineVar from "@/core/proxy/RhineVar";
import {rhineProxy, rhineProxyNative} from "@/core/proxy/Proxy";

export function isObject(value: any) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

export function isArray(value: any) {
  return Array.isArray(value);
}

export function isObjectOrArray(value: any) {
  return value !== null && typeof value === 'object'
}

export function ensureRhineVar<T>(value: T | ProxiedRhineVar<T>): ProxiedRhineVar<T> | any {
  if (isYMapOrYArray(value)) {
    return rhineProxyNative(value)
  }
  if (isObjectOrArray(value)) {
    if (!(value instanceof RhineVar)) {
      return rhineProxy(value as object)
    }
  }
  return value
}
