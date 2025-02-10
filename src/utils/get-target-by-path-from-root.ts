import {YPath} from "@/core/native/native.type";

export function getTargetByPathFromRoot(
  root: any,
  path: YPath,
) {
  let target = root
  for (const key of path) {
    target = target[key]
    if (target === undefined) {
      return undefined
    }
  }
  return target
}
