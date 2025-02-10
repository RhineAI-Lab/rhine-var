import {Native, YKey} from "@/core/native/native.type";
import {YArray, YMap} from "@/index";

export function hasKey(native: Native, key: YKey): boolean {
  if (native instanceof YMap) {
    return native.has(key + '')
  } else if (native instanceof YArray) {
    return native.length > Number(key)
  } else {
    return false
  }
}
