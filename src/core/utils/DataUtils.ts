import {ProxiedRhineVar} from "@/core/proxy/ProxiedRhineVar";
import {isNative} from "@/core/native/NativeUtils";
import RhineVar from "@/core/proxy/RhineVar";
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

export function ensureRhineVar<T>(value: T | Native): ProxiedRhineVar<T> | any {
  if (isNative(value)) {
    return rhineProxyNative(value as Native)
  }
  if (isObjectOrArray(value)) {
    if (!(value instanceof RhineVar)) {
      return rhineProxy(value as object)
    }
  }
  return value
}
