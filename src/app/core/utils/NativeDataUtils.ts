import {Map as YMap, Array as YArray} from "yjs"


export function isObject(value: any) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

export function isArray(value: any) {
  return Array.isArray(value);
}

export function isObjectOrArray(value: any) {
  return value !== null && typeof value === 'object'
}

export function isYMap(value: any) {
  return value instanceof YMap
}

export function isYArray(value: any) {
  return value instanceof YArray
}

export function forceSet(target: YMap<any> | YArray<any>, key: string | symbol, value: any) {
  if (typeof key !== 'string') {
    return false
  }
  try {
    if (target instanceof YMap) {
      target.set(key, value)
      return true
    }
    if (target instanceof YArray) {
      const index = parseInt(key)
      if (!isNaN(index)) {
        if (target.length - 1 >= index) {
          target.delete(index, 1)
        }
        target.insert(index, [value])
        return true
      }
    }
  } catch (e) {
    console.error(e)
  }
  return false
}

export function jsonToNative(data: any) {
  if (isObject(data)) {
    let map = new YMap<any>()
    Object.entries(data).forEach(([key, value]) => {
      map.set(key, jsonToNative(value))
    })
    return map
  }
  if (isArray(data)) {
    let array = new YArray<any>()
    data.forEach((value: any, index: number) => {
      array.push([jsonToNative(value)])
    })
    return array
  }
  return data
}

