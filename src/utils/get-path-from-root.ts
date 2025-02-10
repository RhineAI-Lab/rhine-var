import {RhineVarAny, StoredRhineVar} from "@/core/var/rhine-var.type";
import {YPath} from "@/core/native/native.type";
import {YArray, YMap} from "@/index";
import {error} from "@/utils/logger";

export function getPathFromRoot(target: StoredRhineVar): YPath {
  const path: YPath = []
  let current = target
  let native = current.native
  let parent = current.parent?.native
  while (parent) {
    let flag = false
    if (parent instanceof YMap) {
      parent.forEach((value, key) => {
        if (value === native) {
          path.unshift(key)
          flag = true
        }
      })
    } else if (parent instanceof YArray) {
      parent.forEach((value, key) => {
        if (value === native) {
          path.unshift(key)
          flag = true
        }
      })
    }
    if (!flag) {
      error('Failed to get path from root')
    }
    current = current.parent! as RhineVarAny
    native = current.native
    parent = current.parent?.native
  }
  return path
}