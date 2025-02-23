import {YMap} from "@/index";
import {ensureNativeOrBasic} from "@/core/utils/var.utils";

export default function map<T>(defaultValue?: {
  [key: string]: T
}): YMap<T> {
  if (!defaultValue) {
    defaultValue = {}
  }
  const map = new YMap<T>()
  for (const key in defaultValue) {
    map.set(key, ensureNativeOrBasic(defaultValue[key]) as T)
  }
  return map
}
