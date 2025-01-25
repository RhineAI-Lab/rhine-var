import {YMap} from "@/index";
import {ensureNativeOrBasic} from "@/core/utils/var.utils";

export function rhineMap<T>(defaultValue: [string, T][]): YMap<T> {
  const map = new YMap<T>()
  defaultValue.forEach(item => {
    map.set(item[0], ensureNativeOrBasic(item[1]) as T)
  })
  return map
}
