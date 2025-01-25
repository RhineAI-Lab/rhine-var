import {YMap} from "yjs/dist/src/types/YMap";
import {ensureNative} from "@/core/utils/var.utils";

export function rhineMap<T>(defaultValue: [string, T][]): YMap<T> {
  const map = new YMap<T>()
  defaultValue.forEach(item => {
    map.set(item[0], ensureNative(item[1]))
  })
  return map
}
