import {Map as YMap, Array as YArray} from "yjs"
import {Native} from "@/core/native/native.type";
import {isArray, isObject} from "@/core/utils/data.utils";
import RhineVarBaseItem from "@/core/var/rhine-var-base-item.class";


export function isNative(value: any): boolean {
  return (value instanceof YMap) || (value instanceof YArray)
}

export function nativeSet(target: Native, key: string | symbol, value: any): boolean {
  if (typeof key !== 'string') {
    return false
  }
  if (value instanceof RhineVarBaseItem) {
    value = value.native
  }
  
  try {
    if (target instanceof YMap) {
      target.set(key, value)
      return true
    } else if (target instanceof YArray) {
      const index = parseInt(key)
      if (!isNaN(index)) {
        if (target.length - 1 >= index) {
          target.delete(index, 1)
        }
        target.insert(index, [value])
        return true
      }
    } else {
      console.error('Unsupported nativeSet for:', target)
    }
  } catch (e) {
    console.error('RhineVar nativeSet.error:', e)
  }
  return false
}

export function nativeHas(target: Native, key: string | symbol | number): boolean {
  if (typeof key !== 'string') {
    return false
  }
  
  try {
    if (target instanceof YMap) {
      return target.has(key)
    } else if (target instanceof YArray) {
      const index = parseInt(key, 10)
      if (!isNaN(index)) {
        return index < target.length && index >= 0
      }
    }
  } catch (e) {
    console.error('RhineVar nativeHas.error:', e)
  }
  return false
}

export function nativeOwnKeys(target: Native): string[] {
  let keys: string[] = []
  if (target instanceof YMap) {
    target.forEach((value, key) => {
      keys.push(key)
    })
  } else if (target instanceof YArray) {
    for (let i = 0; i < target.length; i++) {
      keys.push(String(i))
    }
  }
  return keys
}

export function nativeDelete(target: Native, key: string | symbol): boolean {
  if (typeof key !== 'string') {
    return false
  }
  
  try {
    if (target instanceof YMap) {
      if (target.has(key)) {
        target.delete(key)
        return true
      }
    }
    if (target instanceof YArray) {
      const pn = parseInt(key)
      if (!isNaN(pn)) {
        if (target.length > pn && pn >= 0) {
          target.delete(pn, 1)
        }
      }
    }
  } catch (e) {
    console.error('RhineVar nativeDelete.error:', e)
  }
  return false
}

export function nativeGet(target: Native, key: string | symbol): any | undefined {
  if (typeof key !== 'string') {
    return undefined
  }
  
  try {
    if (target instanceof YMap) {
      return target.get(key)
    } else if (target instanceof YArray) {
      const pn = parseInt(key)
      if (!isNaN(pn)) return target.get(pn)
    }
  } catch (e) {
    console.error('RhineVar nativeGet.error:', e)
  }
  return undefined
}

export function jsonToNative(data: any): Native | any {
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


