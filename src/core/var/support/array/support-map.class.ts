import {Native, RhineVarAny, YArray, YMap} from "@/index";
import SupportBase from "@/core/var/support/support-base";
import {ensureNativeOrBasic, isRhineVar} from "@/core/utils/var.utils";
import {isNative} from "@/core/native/native.utils";
import RhineVarMap from "@/core/var/items/rhine-var-map.class";
import {InputItem, RecursiveMap} from "@/core/var/rhine-var.type";


export default class SupportMap extends SupportBase {

  static TARGET_TAG = 'c'

  static convertProperty<T>(key: string | symbol, object: RhineVarAny): any {
    if (!(object.native instanceof YMap) || !(object instanceof RhineVarMap)) {
      console.error('Unsupported convertProperty:', object, object.native)
      return
    }
    const map = object
    const native = object.native as YMap<T>

    const get = (key: string): T => {
      if (key in map) {
        return Reflect.get(map, key)
      } else {
        return native.get(key) as T  // Basic
      }
    }

    const getJson = (key: string) => {
      let item = get(key)
      if (isNative(item)) {
        return (item as Native).toJSON() as T
      }
      if (isRhineVar(item)) {
        return item.json()
      }
      return item as T
    }


    switch (key) {
      case 'size':
        return map.size
      case 'set':
        return (key: string, value: InputItem<T>) => {
          return native.set(key, ensureNativeOrBasic(value) as T)
        }
      case 'get':
        return (key: string): T | undefined => {
          return get(key)
        }
      case 'has':
        return (key: string): boolean => {
          return native.has(key)
        }
      case 'forEach':
        return (callback: (value: T, key: string, map: RecursiveMap<T>) => void, thisArg?: any) => {
          for (const k of native.keys()) {
            callback(get(k), k, map)
          }
        }
      case 'delete':
        return (key: string): boolean => {
          let has = native.has(key)
          native.delete(key)
          return has
        }
      case 'clear':
        return () => {
          native.clear()
        }
      case 'keys':
        return () => {
          const keys = [...native.keys()]
          return {
            [Symbol.iterator]: () => {
              let index = 0
              return {
                next: () => {
                  if (index < keys.length) {
                    return {
                      value: keys[index++],
                      done: false
                    }
                  } else {
                    return {
                      value: undefined,
                      done: true
                    }
                  }
                },
                [Symbol.iterator]: () => {
                  return this
                }
              }
            }
          }
        }
      case 'values':
        return () => {
          const keys = [...native.keys()]
          return {
            [Symbol.iterator]: () => {
              let index = 0
              return {
                next: () => {
                  if (index < keys.length) {
                    return {
                      value: get(keys[index++]),
                      done: false
                    }
                  } else {
                    return {
                      value: undefined,
                      done: true
                    }
                  }
                },
                [Symbol.iterator]: () => {
                  return this
                }
              }
            }
          }
        }
      case 'entries':
        return () => {
          const keys = [...native.keys()]
          return {
            [Symbol.iterator]: () => {
              let index = 0
              return {
                next: () => {
                  if (index < keys.length) {
                    const key = keys[index++]
                    return {
                      value: [key, get(key)],
                      done: false
                    }
                  } else {
                    return {
                      value: undefined,
                      done: true
                    }
                  }
                },
                [Symbol.iterator]: () => {
                  return this
                }
              }
            }
          }
        }
      case Symbol.iterator:
        return () => {
          const keys = [...native.keys()]
          return {
            [Symbol.iterator]: () => {
              let index = 0
              return {
                next: () => {
                  if (index < keys.length) {
                    const key = keys[index++]
                    return {
                      value: [key, get(key)],
                      done: false
                    }
                  } else {
                    return {
                      value: undefined,
                      done: true
                    }
                  }
                },
                [Symbol.iterator]: () => {
                  return this
                }
              }
            }
          }
        }
      default:
        return null
    }
  }

  static SUPPORTED_PROPERTIES = new Set<string | symbol>([
    Symbol.iterator,
    'size',
    'get',
    'set',
    'has',
    'delete',
    'delete',
    'clear',
    'forEach',
    'keys',
    'values',
    'entries',
  ])

  static UNSUPPORTED_PROPERTIES = new Set<string | symbol>([
  ])
}
