import {Map as YMap, Array as YArray} from "yjs"


export function isObject(value: any) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

export function isArray(value: any) {
  return Array.isArray(value);
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

