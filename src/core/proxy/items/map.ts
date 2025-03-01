import {YMap} from "@/index";
import {ensureNativeOrBasic} from "@/core/utils/var.utils";
import RhineVarMap from "@/core/var/items/rhine-var-map.class";

export default function map<T>(defaultValue?: {
  [key: string]: T
}): RhineVarMap<T> {
  if (!defaultValue) {
    defaultValue = {}
  }
  const map = new YMap<T>()
  for (const key in defaultValue) {
    map.set(key, ensureNativeOrBasic(defaultValue[key]) as T)
  }
  return map as any
}
